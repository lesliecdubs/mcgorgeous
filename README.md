# McGorgeous

Validates the schema of a JSON data return type

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
[{ id: 0 }];
```

### Boolean type
```javascript
[{ id: true }];
```

### Array of type
```javascript
{
  names: ["string"]
}
```

Check out the tests for full examples