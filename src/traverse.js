import { isPlainObject, looseEqual } from "./util";

let uid = 0;

export function checkObjectSchema(schema, obj) {
  return _traverseObjects(schema, obj);
}

// taken from https://github.com/vuejs/vue/blob/52719ccab8fccffbdf497b96d3731dc86f04c1ce/src/core/observer/traverse.js#L19
// JSON data won't be cyclical so we don't need to do id checking
function _traverseObjects(val1, val2) {
  const isO1 = isPlainObject(val1);
  const isO2 = isPlainObject(val2);
  const isA1 = Array.isArray(val1);
  const isA2 = Array.isArray(val2);
  let i, keys1, keys2, result;
  if (isO1 || isO2) {
    console.log("doing objects");
    if (!isO2 || !isO1) {
      return {
        result: false,
        message: "Schema has object where data does not",
        info: []
      };
    }
    //loop object
    keys1 = Object.keys(val1);
    keys2 = Object.keys(val2);
    if (!looseEqual(keys1, keys2)) {
      console.log("no match");
      return {
        result: false,
        message: "Keys in schema don't match keys in data",
        info: [keys1, keys2]
      };
    }
    i = keys1.length;
    console.log("i", i);
    while (i--) {
      result = _traverseObjects(val1[keys1[i]], val2[keys2[i]]);
      console.log("while, ", result);
      if (!result) return result;
    }
  } else if (isA1 || isA2) {
    console.log("doing arrays");
    if (!isA2 || !isA1) {
      return {
        result: false,
        message: "Schema has Array where data does not",
        info: []
      };
    }
    i = val2.length;
    while (i--) {
      result = _traverseObjects(val1[0], val2[i]);
      console.log("while, A ", result);
      if (!result) return result;
    }
  } else {
    console.log(
      "vals",
      typeof val1,
      typeof val2 === "object" ? Object.keys(val2) : val2
    );
  }
  return {
    result: true,
    message: "Schema matches data",
    info: []
  };
}
