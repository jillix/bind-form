M.wrap('github/jillix/bind-form/dev/form.js', function (require, module, exports) {
var controls = require('./controls');

// TODO remove when crud is tested
var data = require('./data');

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

function setData (data) {
    var self = this;
    
    // TODO which data are mandatory for a item?
    if (typeof data !== 'object') {
        return;
    }
    
    self.data = data;
    self.emit('dataSet', data);
}

function save () {
    var self = this;
    
    if (!self.data) {
        return;
    }
    
    var crud = {
        t: self.data._tp,
        d: self.data,
        o: {upsert: true}
    };
    
    if (self.data._id) {
        crud.q = {_id: self.data._id};
    }
    
    self.emit(crud.q ? 'update' : 'insert', crud, function (err, data) {
        
        console.log('save:');
        console.log(err || data);
        self.emit('saved', err, data);
    });
}

function remove () {
    var self = this;
    
    if (!self.data || !self.data._id) {
        return;
    }
    
    var crud = {
        t: self.data._tp,
        q: {_id: self.data._id}
    }
    
    self.emit('remove', crud, function (err, result) {
        if (!err && result) {
            self.data = null;
        }
        
        self.emit('removed', err, result);
    });
}

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
        
        self.on('setData', setData);
        self.on('save', save);
        self.on('remove', remove);
        
        // TODO remove when crud is tested
        data.call(self);
        
    });
}

module.exports = init;

return module; });
