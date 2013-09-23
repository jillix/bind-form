M.wrap('github/jillix/bind-form/dev/ui.js', function (require, module, exports) {
// TODO use bind for dom interaction/manipulation
function elm(d,a){try{var b=document.createElement(d);if("object"===typeof a)for(var c in a)if (!a.hasOwnProperty(c)) return;b.setAttribute(c,a[c]);return b}catch(e){return null}}
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
        if (!self.template.schema.hasOwnProperty(field)) return;        
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
                tagName = value[i].tagName.toLowerCase();
                
                if (tagName !== 'input' && tagName !== 'select' && tagName !== 'textarea') {
                    
                    // set html to true to use innerHTML
                    value[i].html = true;
                    value[i].attr = selectors.attr;
                }
            }
            
            domRefs[field].value = value;

            // add event listeners
            for (var i = 0, l = value.length; i < l; ++i) {
                (function (key, j) {

                    // data change event
                    var dcEvents = self.config.options.dataChanged;

                    // only "change" and "input" are valid options
                    if (["change", "input"].indexOf(dcEvents) === -1) {
                        return console.error("Invalid dataChange option value.");
                    }

                    // convert it to array
                    dcEvents = [dcEvents];

                    // listen to change always
                    if (dcEvents[0] === "input") {
                        dcEvents.push("click");
                    }

                    // listen each event in dcEvents array
                    var ev, i = -1;
                    while (ev = dcEvents[++i]) {
                        value[j].addEventListener(ev, function () {
                            var type = this.getAttribute("type");
                            var fieldValue = this.value;

                            switch (type) {
	                            case "checkbox":
	                                fieldValue = this.checked;
	                                break;
	                        }

	                        self.emit("dataChanged", self.template.id, key, fieldValue, this);
	                    }, false);
                    }
                })(field, i);
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
