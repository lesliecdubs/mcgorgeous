import {
  isPlainObject,
  looseEqual,
  arrayDifference,
  isString,
  isNumber,
  isBoolean
} from "./util";

// similar to VueJS traverse https://github.com/vuejs/vue/blob/52719ccab8fccffbdf497b96d3731dc86f04c1ce/src/core/observer/traverse.js#L19
// JSON data won't be cyclical so we don't need to do id checking
export function traverseObjects(schema, data) {
  const isSchemaAnObject = isPlainObject(schema);
  const isDataAnObject = isPlainObject(data);
  const isSchemaAnArray = Array.isArray(schema);
  const isDataAnArray = Array.isArray(data);
  if (isSchemaAnArray) {
    if (!isDataAnArray) {
      throw Error(
        `Schema is looking for "array", data is ${JSON.stringify(data)}`
      );
    }
    let i = data.length;
    while (i--) {
      traverseObjects(schema[0], data[i]);
    }
  } else if (isSchemaAnObject) {
    if (isDataAnArray || !isDataAnObject) {
      throw Error(
        `Schema is looking for "object", data is ${JSON.stringify(data)}`
      );
    }
    //loop object
    const schemaKeys = Object.keys(schema).sort();
    const dataKeys = Object.keys(data).sort();
    if (!looseEqual(schemaKeys, dataKeys)) {
      throw Error(
        `Keys in schema don't match keys in data: ${JSON.stringify(
          arrayDifference(schemaKeys, dataKeys)
        )}`
      );
    }
    let i = schemaKeys.length;
    while (i--) {
      traverseObjects(schema[schemaKeys[i]], data[dataKeys[i]]);
    }
  } else {
    switch (schema) {
      case "string":
        if (!isString(data)) {
          throw Error(`"${data}" is not a string.`);
        }
        break;
      case 0:
        if (!isNumber(data)) {
          throw Error(`"${data}" is not a number.`);
        }
        break;
      case true:
        if (!isBoolean(data)) {
          throw Error(`"${data}" is not a boolean.`);
        }
        break;
    }
  }
  return true;
}
