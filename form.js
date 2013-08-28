M.wrap('github/jillix/bind-form/dev/form.js', function (require, module, exports) {
var Events = require('github/jillix/events');
var data = require('./data');
var ui = require('./ui');

function setTemplate (template) {
    var self = this;

    var template = typeof template === 'string' ? template : (template.id || template._id);
    // check template
    if (!template) {
        // TODO handle error
        alert('Invalid template');
        return;
    }

    self.emit('getTemplates', [template], function (err, templates) {

        // TODO handle error
        if (err || !templates[template]) {
            return;
        }

        // set current template
        self.template = templates[template];
        self.emit('templateSet');
    });
}

function init (config) {
    var self = this;
    
    self.config = config;
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

return module; });
