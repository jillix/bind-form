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
    
    // TODO progress config
    "progress": {}
},
```

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
