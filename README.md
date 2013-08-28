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
