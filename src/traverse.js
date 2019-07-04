import {
  isPlainObject,
  looseEqual,
  arrayDifference,
  isString,
  isNumber,
  isBoolean
} from "./util";

let uid = 0;

export function checkObjectSchema(schema, obj) {
  return _traverseObjects(schema, obj);
}

// similar to VueJS traverse https://github.com/vuejs/vue/blob/52719ccab8fccffbdf497b96d3731dc86f04c1ce/src/core/observer/traverse.js#L19
// JSON data won't be cyclical so we don't need to do id checking
function _traverseObjects(val1, val2) {
  const isO1 = isPlainObject(val1);
  const isO2 = isPlainObject(val2);
  const isA1 = Array.isArray(val1);
  const isA2 = Array.isArray(val2);
  let i, keys1, keys2;
  if (isA1) {
    if (!isA2) {
      throw Error(
        `Schema is looking for "array", data is ${JSON.stringify(val2)}`
      );
    }
    i = val2.length;
    while (i--) {
      _traverseObjects(val1[0], val2[i]);
    }
  } else if (isO1) {
    if (!isO2) {
      throw Error(
        `Schema is looking for "object", data is ${JSON.stringify(val2)}`
      );
    }
    //loop object
    keys1 = Object.keys(val1).sort();
    keys2 = Object.keys(val2).sort();
    if (!looseEqual(keys1, keys2)) {
      throw Error(
        `Keys in schema don't match keys in data: ${JSON.stringify(
          arrayDifference(keys1, keys2)
        )}`
      );
    }
    i = keys1.length;
    while (i--) {
      _traverseObjects(val1[keys1[i]], val2[keys2[i]]);
    }
  } else {
    switch (val1) {
      case "string":
        if (!isString(val2)) {
          throw Error(`"${val2}" is not a string.`);
        }
        break;
      case 0:
        if (!isNumber(val2)) {
          throw Error(`"${val2}" is not a number.`);
        }
        break;
      case true:
        if (!isBoolean(val2)) {
          throw Error(`"${val2}" is not a boolean.`);
        }
        break;
    }
  }
  return true;
}
