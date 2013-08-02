M.wrap('github/jillix/bind-form/dev/form.js', function (require, module, exports) {
var controls = require('./controls');

// TODO remove when crud is tested
var testCrud = require('./test-crud');

var devConfig = {
    crud: 'crud', // crud miid
    
    // where to put the form
    target: '',
    
    // controls
    controls: {
        addField: '',
        cancel: '',
        remove: '',
    },
    
    // main field config
    fields: {},
    
    // set predefined fields and values
    setFields: [
        {
            name: 'field1',
            label: 'Field 1',
            type: 'text',
            placeholder: 'Placeholder',
            value: 'Value field 1'
        },
        {
            name: 'field2',
            label: 'Field 2',
            type: 'select',
            value: 'item1',
            options: [],
            data: '',
            valueKey: '',
            labelKey: ''
        }
    ],
    
    // progress settings
    progress: {}
};

function init (config) {
    var self = this;
    
    // TODO only for dev
    config = devConfig;
    
    self.config = config;
    
    if (!config.crud) {
        return console.error('No crud miid defined.');
    }

    // wait for the crud module
    self.onready(config.crud, function () {
        
        // TODO remove when crud is tested
        testCrud.call(self);
        
        // init controls
        controls.call(self);
    });
}

module.exports = init;

return module; });
