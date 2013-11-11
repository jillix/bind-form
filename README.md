bind-form
====

Insert, update and remove for crud.

####Configuration
```js
// miid of crud module
"crud": "crud",

// ui configuration
"ui": {
    // the target of the form html
    "target": ".form-container",

    // the control handlers
    "controls": {
        "save": "button[name=save]",
        "remove": "button[name=remove]",
        "cancel": "button[name=cancel]"
    },

    "options": {
        "dataChanged": "input/change" // (default: "change")
    }

    // TODO progress config
    "progress": {}
},
```

#####Configuration options

 - `dataChanged`: indicates when the module will emit `dataChanged` event. It can take two values: `change` (the default one) or `input`. If `input` is set, the `dataChanged` event will be emited every time when the text from an input is changed (for example).

####Event interface

#####setTemplate
```js
self.emit('setTemplate', {_id: 'templateId'});
```

#####setData
```js
self.emit('setData', {_id: 'itemId'});
```

#####formRendered
```js
self.on('formRendered', function () {});
```

#####dataSet
```js
self.on('dataSet', function () {});
```

#####saved
```js
self.on('saved', function () {});
```

#####removed
```js
self.on('removed', function () {});
```

## Change Log

### v0.1.4
 - `config.options.dataChanged` can be any event
 - `config.options.dataChanged` is an `Array` or a `String`

### v0.1.3
 - listen change event if other event is not provided

### v0.1.2

- When sending create CRUD requests, the CRUD document is unflattened

### v0.1.1
 - Fixed displaying Array values in the value input in IE8
 - Added bind dependency and support for `config.binds`

### v0.1.0

- First versioned release

