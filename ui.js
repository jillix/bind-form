M.wrap('github/jillix/bind-form/dev/ui.js', function (require, module, exports) {
// TODO use bind for dom interaction/manipulation
function elm(d,a){try{var b=document.createElement(d);if("object"===typeof a)for(var c in a)b.setAttribute(c,a[c]);return b}catch(e){return null}}
function get(s,c){
    try{return (c||document).querySelector(s);}
    catch (err) {
        return null;
    }
}

var fields = require('./ui/fields');
var controls = require('./ui/controls');
var progress = require('./ui/progress');

var formCache = {};

function getDomRefs (form) {
    var self = this;
    
    // return if no schema is defined
    if (!self.template.schema) {
        return;
    }
    
    var domRefs = {};
    var label, value, selectors, tagName;
    
    // det dom refs
    for (var field in self.template.schema) {
        
        selectors = self.template.schema[field].selectors;
        
        domRefs[field] = {};
        
        // get the label field
        if (selectors.label && (label = get(selectors.label, form))) {
            domRefs[field].label = label;
        }
        
        // get the value field
        if (value = get(selectors.value, form)) {
            domRefs[field].value = value;
            
            // check if value is an input
            tagName = value.tagName.toLowerCase();
            if (tagName !== 'input' && tagName !== 'select') {
                
                // save content as inner html (1) or as attribute (2)
                domRefs[field].html = selectors.attr ? 2 : 1;
            }
        }
    }
    
    return domRefs;
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
            // TODO set form attributes
            var form = elm('form');
            form.innerHTML = html;
            
            // cache form
            self.formCache[self.template.id] = {
                dom: form,
                refs: getDomRefs.call(self, form)
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
