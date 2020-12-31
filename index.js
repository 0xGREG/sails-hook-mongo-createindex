module.exports = function mongoIndex(sails) {
    // fix indexes for models

    fixModels = () => {
        const indexes = []

        // enumerate all models

        _.forIn(sails.models, (model, modelKey) => {
            // skip Sails' built in archive model

            if (modelKey == "archive")
                return

            // if adapter is not sails-mongo, then skip

            if (sails.config.datastores.default.adapter !== "sails-mongo") {
                sails.log.verbose(`sails-hook-mongo-index: skipping model '${modelKey}', not a sails-mongo model`)
                return
            }

            // enumerate model's attributes

            _.forIn(model.attributes, (attribute, attributeKey) => {
                // skip id

                if (attributeKey == "id")
                    return

                // add attribute to indexes if it has unique or index key

                if (attribute.autoMigrations && attribute.autoMigrations.unique)
                    indexes.push({
                        model,
                        attributeKey,
                        unique: true
                    })

                if (attribute.index)
                    indexes.push({
                        model,
                        attributeKey,
                        unique: false
                    })
            })
        })

        // do createIndex on all indexes

        indexes.reduce(async (promise, index) => {
            await promise

            const db = index.model.getDatastore().manager

            await db.collection(index.model.tableName).createIndex(index.attributeKey, { unique: index.unique })
        }, Promise.resolve())
    }

    return {
        initialize: async () => {
            return new Promise((resolve) => {
                sails.on("hook:orm:loaded", () => {
                    fixModels()

                    resolve()
                })
            })
        }
    }
}
