M.wrap('github/jillix/bind-form/dev/ui.js', function (require, module, exports) {
// TODO use bind for dom interaction/manipulation
function elm(d,a){try{var b=document.createElement(d);if("object"===typeof a)for(var c in a)b.setAttribute(c,a[c]);return b}catch(e){return null}}
function get(s,c){
    try{return (c||document).querySelector(s);}
    catch (err) {
        return null;
    }
}
function getAll(s,c){
    try{return (c||document).querySelectorAll(s);}
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
    var label, value, selectors;
    
    // det dom refs
    for (var field in self.template.schema) {
        
        selectors = self.template.schema[field].selectors;
        
        if (!selectors) {
            continue;
        }
        
        domRefs[field] = {};
        
        // get the label field
        if (selectors.label && (label = getAll(selectors.label, form))) {
            
            for (var i = 0, l = label.length; i < l; ++i) {
                // TODO handle i18n
                label[i].innerHTML = self.template.schema[field].label;
            }
            
            domRefs[field].label = label;
        }
        
        // get the value field
        if (value = getAll(selectors.value, form)) {
            
            for (var i = 0, l = value.length, tagName; i < l; ++i) {
                // check if value is an input
                tagName = value[i].tagName.toLowerCase();
                
                if (tagName !== 'input' && tagName !== 'select' && tagName !== 'textarea') {
                    
                    // set html to true to use innerHTML
                    value[i].html = true;
                    value[i].attr = selectors.attr;
                }
            }
            
            domRefs[field].value = value;
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
            var div = elm('div');
            div.innerHTML = html;
            
            // cache form
            self.formCache[self.template.id] = {
                dom: div,
                refs: getDomRefs.call(self, div)
            };
            
            // append form to the dom
            self.target.innerHTML = '';
            self.target.appendChild(div);
            
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
    
    // handle save
    self.on('dataUpdated', function () {
        self.emit('saveCrud');
    });
    self.on('save', function () {
        self.emit('updateData');
    });
}

module.exports = init;

return module; });
