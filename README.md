# McGorgeous

Validates the schema of a JSON data return type

[![CircleCI](https://circleci.com/gh/jschatz1/mcgorgeous.svg?style=svg)](https://circleci.com/gh/jschatz1/mcgorgeous)

## Usage

### Install
Using browser

```html
<script src="dist/mcgorgeous.min.js"></script>
```

Using Yarn
```
yarn add mcgorgeous
```
Using NPM
```
npm install mcgorgeous
```

### JavaScript

Use via `try` and `catch`

```javascript
import check from "mcgorgeous";

const sitesSchema = [{ name: "string" }];
// data coming back from server 
const sitesData = [{ name: "Jeff" }, { name: "Gary" }];
try{
  check(sitesSchema, sitesData);
} catch(e) {
  // throw proper error
  console.log(e.message);
}
```

## Types

### String type
```javascript
[{ name: "string" }];
```

### Numeric type
```javascript
[{ id: "number" }];
```

### Boolean type
```javascript
[{ id: "boolean" }];
```

### Null type
```javascript
[{ id: null }];
```
Null type will be skipped. Can be `null` or `"null"`.

### Not Null
```javascript
[{ name: "string notnull" }];
[{ name: "number notnull" }];
[{ name: "boolean notnull" }];
```
Will throw an error if the strings value is null.

### Array of type
```javascript
{
  names: ["string"]
}
```

Check out the tests for full examples