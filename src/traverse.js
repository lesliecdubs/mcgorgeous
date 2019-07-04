import {
  isPlainObject,
  looseEqual,
  arrayDifference,
  toString,
  isString,
  isNumber,
  isBoolean,
  isUndef
} from "./util";

// similar to VueJS traverse https://github.com/vuejs/vue/blob/52719ccab8fccffbdf497b96d3731dc86f04c1ce/src/core/observer/traverse.js#L19
// JSON data won't be cyclical so we don't need to do id checking
/**
 * {prop: type} e.g.
 * {name: String}
 **/
export function traverseObjects(schema, data) {
  // On the top level we have three "types" of cases
  // - Arrays
  // - Objects
  // - Literals

  if (Array.isArray(schema)) {
    // Handling arrays
    if (!Array.isArray(data)) {
      throw Error(
        `Schema is looking for "array", data is ${JSON.stringify(data)}`
      );
    }
    let i = data.length;
    while (i--) {
      traverseObjects(schema[0], data[i]);
    }
  } else if (isPlainObject(schema)) {
    // Handling object
    if (Array.isArray(data) || !isPlainObject(data)) {
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
    const schemaDefinition = toString(schema).split(" ");
    schemaDefinition.push("");
    const canBeNull = schemaDefinition[1] !== "notnull";
    const isUndefProblem = !canBeNull && isUndef(data);
    switch (schemaDefinition[0]) {
      case "":
        break;
      case "null":
        break;
      case "string":
        if (isUndefProblem) {
          throw Error("String cannot be null");
        } else if (!isString(data) && !isUndef(data)) {
          throw Error(`"${data}" is not a string.`);
        }
        break;
      case "number":
        if (isUndefProblem) {
          throw Error("Number cannot be null");
        } else if (!isNumber(data) && !isUndef(data)) {
          throw Error(`"${data}" is not a number.`);
        }
        break;
      case "boolean":
        if (isUndefProblem) {
          throw Error("Boolean cannot be null");
        } else if (!isBoolean(data) && !isUndef(data)) {
          throw Error(`"${data}" is not a boolean.`);
        }
        break;
      default:
        throw new Error(
          `Unknown schema type: ${JSON.stringify(schemaDefinition[0])}`
        );
    }
  }

  return true;
}
