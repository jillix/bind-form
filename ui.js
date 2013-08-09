M.wrap('github/jillix/bind-form/dev/ui.js', function (require, module, exports) {
var fields = require('./ui/fields');
var progress = require('./ui/progress');

var formCache = {};

function save () {
    var self = this;
}

function remove () {
    var self = this;
}

function cancel () {
    var self = this;
}

function getTemplateHtml () {
    var self = this;
    
    // return if template has no html
    if (!self.template.html) {
        return;
    }
    
    // get the html
    if (!self.formCache[self.template.id]) {
        self.link(self.template.html, function (err, html) {
            if (err || html === '') {
                return;
            }
            
            // create dom structure
            var div = document.createElement('div');
            div.innerHTML = html;
            
            // cache form
            self.formCache[self.template.id] = {
                dom: div
            };
            
            self.emit('formHtmlFetched');
        });
    } else {
        self.emit('formHtmlFetched');
    }
}

function init () {
    var self = this;
    
    self.formCache = formCache;
    // TODO get form fields form a html
    // TODO attach events
    
    // listen to controls
    self.on('uiSave', save);
    self.on('uiRm', remove);
    self.on('uiCancel', cancel);
    
    // handle template
    self.on('templateSet', getTemplateHtml);
    
    // init fields rendering
    fields.call(self);
    
    // init progress handling
    if (self.config.ui.progress) {
        progress.call(self);
    }
}

module.exports = init;

return module; });
