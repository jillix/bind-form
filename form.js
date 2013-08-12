M.wrap('github/jillix/bind-form/dev/form.js', function (require, module, exports) {
var Events = require('github/jillix/events');
var data = require('./data');
var ui = require('./ui');

function setTemplate (template) {
    var self = this;
    
    // check tempalte
    if (typeof template !== 'object' || !template.id) {
        return;
    }
    
    //set current tempalte
    self.template = template;
    self.emit('templateSet');
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
    });
}

module.exports = init;

return module; });
