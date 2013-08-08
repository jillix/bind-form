M.wrap('github/jillix/bind-form/dev/ui.js', function (require, module, exports) {
var progress = require('./ui/progress');    

function save () {
    var self = this;
}

function remove () {
    var self = this;
}

function cancel () {
    var self = this;
}

function fillForm () {
    var self = this;
}

function init () {
    var self = this;
    
    // TODO get form fields form a html
    // TODO attach events
    
    // init progress handling
    if (self.config.ui.progress) {
        progress.call(self);
    }
    
    // listen to controls
    self.on('uiSave', save);
    self.on('uiRm', remove);
    self.on('uiCancel', cancel);
    
    // listen to core events
    self.on('setData', fillForm);
}

module.exports = init;

return module; });