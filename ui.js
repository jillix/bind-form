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
                var labelValue = self.template.schema[field].label;
                if(typeof labelValue === 'object') {
                    label[i].innerHTML = labelValue[M.getLocale()];
                } else {
                    label[i].innerHTML = labelValue;
                }
            }
            
            domRefs[field].label = label;
        }

        // get the value field
        if (value = getAll(selectors.value, form)) {
            for (var i = 0, l = value.length, tagName; i < l; ++i) {
                // check if value is an input
                if (['INPUT', 'SELECT', 'TEXTAREA'].indexOf(value[i].tagName) === -1) {
                    // set html to true to use innerHTML
                    value[i].html = true;
                    value[i].attr = selectors.attr;
                }
            }
            
            domRefs[field].value = value;

            // add event listeners
            for (var i = 0; i < value.length; ++i) {
                // do not add event listeners if this is not an input
                if (['INPUT', 'SELECT', 'TEXTAREA'].indexOf(value[i].tagName) === -1) {
                    continue;
                }

                // data change event
                var dcEvents = [self.config.options.dataChanged];

                // always listen to change
                if (dcEvents[0] === 'input') {
                    dcEvents.push('change');
                }

                // listen each event in dcEvents array
                for (var j = 0; j < dcEvents.length; ++j) {
                    (function (field) {
                        value[i].addEventListener(dcEvents[j], function () {

                            var fieldValue;

                            // checkboxes need a special treatment
                            // TODO add radio button support
                            switch (this.getAttribute('type')) {
                                case 'checkbox':
                                    fieldValue = this.checked;
                                    break;
                                default:
                                    fieldValue = this.value;
                            }

                            self.emit("dataChanged", self.template.id, field, fieldValue, this);
                        }, false);
                    })(field);
                }
            }
        }
    }
    
    return domRefs;
}

function getTemplateHtml () {
    var self = this;
    
    // return if template has no html
    if (!(self.template.options || {}).html) {
        return;
    }
    
    // get the html
    if (!self.formCache[self.template.id]) {
        self.link(self.template.options.html, function (err, html) {
            if (err || html === '') {
                return;
            }
            
            // append form to the dom
            self.target.innerHTML = html;
            
            // cache form
            self.formCache[self.template.id] = {
                dom: self.target,
                html: html,
                refs: getDomRefs.call(self, self.target)
            };
            
            self.emit('formRendered');
        });
    } else {
        
        // append form to the dom
        self.target.innerHTML = self.formCache[self.template.id].html;
        self.formCache[self.template.id].dom = self.target;
        self.formCache[self.template.id].refs = getDomRefs.call(self, self.target);
        
        self.emit('formRendered');
    }
}

function init () {
    var self = this;
    
    // get form target
    if (!self.config.ui.target || !(self.target = get(self.config.ui.target, self.dom))) {
        return;
    }
    
    // only 'change' and 'input' are valid options
    var dce = ['change', 'input'];
    if (dce.indexOf(self.config.options.dataChanged) === -1) {
        alert('The dataChange option value must be one of: ' + dce.join(', '));
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
