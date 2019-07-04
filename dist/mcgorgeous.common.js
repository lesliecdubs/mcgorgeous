'use strict';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

/* @flow */
var emptyObject = Object.freeze({}); // These helpers produce better VM code in JS engines due to their
/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */

function isObject(obj) {
  return obj !== null && _typeof(obj) === "object";
}
/**
 * Get the raw type string of a value, e.g., [object Object].
 */

var _toString = Object.prototype.toString;
/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */

function isPlainObject(obj) {
  return _toString.call(obj) === "[object Object]";
}
/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */

function makeMap(str, expectsLowerCase) {
  var map = Object.create(null);
  var list = str.split(",");

  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }

  return expectsLowerCase ? function (val) {
    return map[val.toLowerCase()];
  } : function (val) {
    return map[val];
  };
}
/**
 * Check if a tag is a built-in tag.
 */

var isBuiltInTag = makeMap("slot,component", true);
/**
 * Check if an attribute is a reserved attribute.
 */

var isReservedAttribute = makeMap("key,ref,slot,slot-scope,is");
/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */

function polyfillBind(fn, ctx) {
  function boundFn(a) {
    var l = arguments.length;
    return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
  }

  boundFn._length = fn.length;
  return boundFn;
}

function nativeBind(fn, ctx) {
  return fn.bind(ctx);
}

var bind = Function.prototype.bind ? nativeBind : polyfillBind;
/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */

function looseEqual(a, b) {
  if (a === b) return true;
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);

  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);

      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i]);
        });
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key]);
        });
      } else {
        /* istanbul ignore next */
        return false;
      }
    } catch (e) {
      /* istanbul ignore next */
      return false;
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b);
  } else {
    return false;
  }
}
function isBoolean(b) {
  return b === true || b === false;
}
function isNumber(n) {
  return typeof n == "number";
}
function isString(x) {
  return Object.prototype.toString.call(x) === "[object String]";
}
function arrayDifference(arr1, arr2) {
  return arr1.filter(function (x) {
    return !arr2.includes(x);
  });
}

function checkObjectSchema(schema, obj) {
  return _traverseObjects(schema, obj);
} // taken from https://github.com/vuejs/vue/blob/52719ccab8fccffbdf497b96d3731dc86f04c1ce/src/core/observer/traverse.js#L19
// JSON data won't be cyclical so we don't need to do id checking

function _traverseObjects(val1, val2) {
  var isO1 = isPlainObject(val1);
  var isO2 = isPlainObject(val2);
  var isA1 = Array.isArray(val1);
  var isA2 = Array.isArray(val2);
  var i, keys1, keys2;

  if (isA1) {
    if (!isA2) {
      throw Error("Schema is looking for \"array\", data is ".concat(JSON.stringify(val2)));
    }

    i = val2.length;

    while (i--) {
      _traverseObjects(val1[0], val2[i]);
    }
  } else if (isO1) {
    if (!isO2) {
      throw Error("Schema is looking for \"object\", data is ".concat(JSON.stringify(val2)));
    } //loop object


    keys1 = Object.keys(val1).sort();
    keys2 = Object.keys(val2).sort();

    if (!looseEqual(keys1, keys2)) {
      throw Error("Keys in schema don't match keys in data: ".concat(JSON.stringify(arrayDifference(keys1, keys2))));
    }

    i = keys1.length;

    while (i--) {
      _traverseObjects(val1[keys1[i]], val2[keys2[i]]);
    }
  } else {
    switch (val1) {
      case "string":
        if (!isString(val2)) {
          throw Error("\"".concat(val2, "\" is not a string."));
        }

        break;

      case 0:
        if (!isNumber(val2)) {
          throw Error("\"".concat(val2, "\" is not a number."));
        }

        break;

      case true:
        if (!isBoolean(val2)) {
          throw Error("\"".concat(val2, "\" is not a boolean."));
        }

        break;
    }
  }

  return true;
}

function index (schema, data) {
  /**
   * {prop: type} e.g.
   * {name: String}
   **/
  return checkObjectSchema(schema, data);
}

module.exports = index;
