M.wrap('github/jillix/bind-form/dev/ui.js', function (require, module, exports) {
var fields = require('./ui/fields');
var controls = require('./ui/controls');
var progress = require('./ui/progress');

var formCache = {};

function getDomRefs () {
    var self = this;
    
    if (!self.template.schema) {
        return;
    }
    
    for (var field in self.template.schema) {
        // TODO get dom refs and config (value, attr, html)
        console.log(self.template.schema[field]);
    }
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
                dom: div,
                refs: getDomRefs.call(self)
            };
            
            self.emit('formHtmlFetched');
        });
    } else {
        self.emit('formHtmlFetched');
    }
}

function init () {
    var self = this;
    
    // attach cache to module
    self.formCache = formCache;
    
    // handle template
    self.on('templateSet', getTemplateHtml);
    
    // init fields rendering
    fields.call(self);
    
    // init controls
    if (self.config.ui.controls) {
        controls.call(self);
    }
    
    // init progress handling
    if (self.config.ui.progress) {
        progress.call(self);
    }
}

module.exports = init;

return module; });
