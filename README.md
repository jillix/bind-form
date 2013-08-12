bind-form
====

Insert, update and remove for crud.

####Example config
```
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

// listen to external events
"listen": {
    /*
        see here how to config:
        https://github.com/jillix/events
    */
}
```

####Event interface

#####setTemplate
```
self.emit('setTemplate', {_id: 'templateId'});
```

#####setData
```
self.emit('setData', {_id: 'itemId'});
```

#####formRendered
```
self.on('formRendered', function () {});
```

#####dataSet
```
self.on('dataSet', function () {});
```

#####saved
```
self.on('saved', function () {});
```

#####removed
```
self.on('removed', function () {});
```
