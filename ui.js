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
            
            // TODO handle i18n
            label.innerHTML = self.template.schema[field].label;
            domRefs[field].label = label;
        }
        
        // get the value field
        if (value = get(selectors.value, form)) {
            domRefs[field].value = value;
            
            // check if value is an input
            tagName = value.tagName.toLowerCase();
            if (tagName !== 'input' && tagName !== 'select' && tagName !== 'textarea') {
                
                // set html to true to use innerHTML
                domRefs[field].html = true;
                domRefs[field].attr = selectors.attr;
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
            var form = elm('form');
            form.innerHTML = html;
            
            // cache form
            self.formCache[self.template.id] = {
                dom: form,
                refs: getDomRefs.call(self, form)
            };
            
            // append form to the dom
            self.target.innerHTML = '';
            self.target.appendChild(form);
            
            self.emit('formRendered');
        });
    } else {
        
        // append form to the dom
        self.target.innerHTML = '';
        self.target.appendChild(self.formCache[self.template.id].dom);
        
        self.emit('formRendered');
    }
}

function init () {
    var self = this;
    
    // get form target
    if (!self.config.ui.target || !(self.target = get(self.config.ui.target, self.dom))) {
        return;
    }
    
    // attach cache to module
    self.formCache = formCache;
    
    // handle template
    self.on('templateSet', getTemplateHtml);
    
    // init fields rendering
    self.once('formRendered', function () {
        
        fields.call(self);
        
        // init controls
        if (self.config.ui.controls) {
            controls.call(self);
        }
    });
    
    // init progress handling
    if (self.config.ui.progress) {
        progress.call(self);
    }
    
    
}

module.exports = init;

return module; });
