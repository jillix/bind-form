var Events = require('github/jillix/events');
var data = require('./data');
var ui = require('./ui');

function setTemplate (template, callback) {
    var self = this;
    
    callback = typeof callback === 'function' ? callback :  function () {};

    var template = typeof template === 'string' ? template : (template.id || template._id);
    // check template
    if (!template) {
        // TODO handle error
        alert('Invalid template');
        return callback('Invalid template');
    }

    self.emit('find', [template], function (err, templates) {

        for (var key in templates) {
            if (!templates.hasOwnProperty(key)) continue;

            if (templates[key]._id === template) {
                self.template = templates[key];
            }
        }

        // TODO handle error
        if (err || !self.template) {
            return callback(err);
        }
      
        // set current template
        self.emit('templateSet');
        callback(null, self.template);
    });
}

function init (config) {
    var self = this;
    
    self.config = config;
    config.binds = config.binds || [];
    config.options = config.options || {};
    config.options.dataChanged = config.options.dataChanged || "change";
    
    if (!config.waitFor) {
        return console.error('No crud miid defined.');
    }
    
    // init ui
    if (self.config.ui) {
        ui.call(self);
    }
    
    // init data events
    data.call(self);
    
    // set template
    self.on('setTemplate', setTemplate);
    
    // listen to external events
    Events.call(self, config);
    
    self.emit('ready');
}

module.exports = init;
