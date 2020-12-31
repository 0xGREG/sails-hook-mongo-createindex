# sails-hook-mongo-createindex

In a production environment, Sails.js does not create MongoDB index/unique indexes defined in the models, so you would have to do it manually.

This hook solves it by using MongoDB's `createIndex` function to create the indexes.

## Getting started

1. Install the package using `npm install --save sails-hook-mongo-createindex`
2. Make sure you are using the `sails-mongo` database adapter
3. Lift the app: `sails lift`

## Usage

Just add `unique` or `index` to your model's attribute.

```js
attribute: {
    type: "string",
    index: true
}
```
or
```js
attribute: {
    type: "string",
    unique: true
}
```

## Contributions

If you find any bugs or want to improve the hook just open an issue or send a pull request, thanks!