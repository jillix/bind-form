M.wrap('github/jillix/bind-form/dev/ui/fields.js', function (require, module, exports) {
// TODO generate form fields from a configuration
/*function setFields () {
    var self = this;
    
    self.emit('fieldsSet');
}*/

function fillForm () {
    var self = this;

    // reset only form UI data
    self.emit('reset', true);

    var fields = self.formCache[self.template.id].refs;
    
    for (var field in fields) {
        
        // ignore data if no dom ref is available
        if (typeof self.data[field] === 'undefined') {
            continue;
        }
        
        for (var i = 0, l = fields[field].value.length; i < l; ++i) {
            // fill data
            if (fields[field].value[i].html) {
                fields[field].value[i].innerHTML = self.data[field];
            } else {
                if (['checkbox', 'radio'].indexOf(fields[field].value[i].getAttribute('type')) > -1) {
                    fields[field].value[i].checked = toBoolean(self.data[field]);
                } else {
                    fields[field].value[i].value = self.data[field];
                }
            }
        }
    }
    
    self.emit('formFilled');
}

function toBoolean(value) {
    if (value === true || value === 'true' || value === 'on' || value === 'yes' || value == 1) {
        return true;
    }

    return false;
}

function updateData () {
    var self = this;
    
    if (!self.data) {
        self.data = {};
    }
    
    var fields = self.formCache[self.template.id].refs;
    
    for (var field in fields) {
        for (var i = 0, l = fields[field].value.length; i < l; ++i) {
            // update data
            if (fields[field].value[i] && !fields[field].value[i].html) {
                var value = fields[field].value[i].value;
                // the value is for some inputs the "checked" property
                if (['checkbox', 'radio'].indexOf(fields[field].value[i].getAttribute('type')) > -1) {
                    value = fields[field].value[i].checked;
                }
                if (self.template.schema[field].type === 'boolean') {
                    self.data[field] = toBoolean(value);
                } else {
                    self.data[field] = fields[field].value[i].value;
                }
            }
        }
    }
    
    self.emit('dataUpdated');
}

function reset (formOnly) {
    var self = this;
    var fields = self.formCache[self.template.id].refs;
    
    if (!formOnly) {
        // reset internal data
        self.data = {};
    }

    // reset value fields
    for (var field in fields) {
        for (var i = 0, l = fields[field].value.length; i < l; ++i) {
            if (fields[field].value[i].html) {
                fields[field].value[i].innerHTML = '';
            } else if (['checkbox', 'radio'].indexOf(fields[field].value[i].getAttribute('type')) > -1) {
                fields[field].value[i].checked = toBoolean(self.data[field]);
            } else {
                fields[field].value[i].value = self.data[field];
            }
        }
    }
    
    self.emit('formReseted');
}

function init () {
    var self = this;
    
    //self.on('setFields', setFields);
    self.on('updateData', updateData);
    self.on('dataSet', fillForm);
    self.on('reset', reset);
}

module.exports = init;

return module; });
