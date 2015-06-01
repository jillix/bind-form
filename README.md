bind-form
====

Insert, update and remove for crud.

####Configuration
```js
// miid of crud module
"crud": "crud",

// ui configuration
"ui": {
    //focus the first textbox
    "autofocus": "true/false" // (default: "false")

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

### 0.4.0
 - transferred module to the new jxMono organization
 - updated Bind to `v0.4.0`, Events to `v0.4.0`

### 0.3.4
 - Broadcast save errors on update queries;

### 0.3.3
 - Fixed small memory leak caused by click events that were not removed

### 0.3.2
 - Updated to Bind `v0.3.1`

### 0.3.1
 - Do not disable fields that have a modm validation

### 0.3.0
 - Added remove field functionality
 - Added template parameter to `formRendered` event.
 - Do not ignore missing template fields from data. Letting the filters still do their job. Defaulting to empty string, `false`, or `0` for fields not present in the data.
 - Added support for checkbox and radio button change events.
 - Added isInsert boolean argument to `saved` event emit.
 - Emitting `fieldsRendered` immediately after attaching the template HTML. This allows for executing code before the DOM references are gathered (like preparing for i18n inputs).
 - Updated to Events `v0.3.0` and Bind `v0.3.0`

### v0.2.2
 - Fixed default value for fields when min and max exist

### v0.2.1
 - Updated to Events `v0.1.11` and Bind `v0.2.2`
 - the `selected` option value in a `SELECT` input will be considered when reseting a form

### v0.2.0
 - Bind-form can now load more modules in the html of a template
 - Fixed bug with forms not reacting at SELECT input changes

### v0.1.9
 - Upgrade to Events v0.1.9

### v0.1.8
 - Upgrade to Events v0.1.8 and Bind v0.2.1

### v0.1.7
 - Added i18n template HTML support

### v0.1.6
 - Added autofocus option

### v0.1.5
 - Replaced `forEach` calls with for loops to be compatible with IE

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
