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
        
        // fill data
        if (fields[field].html) {
            fields[field].value.innerHTML = self.data[field];
        } else {
            if (['checkbox', 'radio'].indexOf(fields[field].value.getAttribute('type')) > -1) {
                fields[field].value.checked = toBoolean(self.data[field]);
            } else {
                fields[field].value.value = self.data[field];
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
        
        // update data
        if (!fields[field].html && fields[field].value) {
            var value = fields[field].value.value;
            // the value is for some inputs the "checked" property
            if (['checkbox', 'radio'].indexOf(fields[field].value.getAttribute('type')) > -1) {
                value = fields[field].value.checked;
            }
            if (self.template.schema[field].type === 'boolean') {
                self.data[field] = toBoolean(value);
            } else {
                self.data[field] = fields[field].value.value;
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

    // reset fields
    for (var field in fields) {
        if (fields[field].html) {
            fields[field].value.innerHTML = '';
        } else if (['checkbox', 'radio'].indexOf(fields[field].value.getAttribute('type')) > -1) {
            fields[field].value.checked = toBoolean(self.data[field]);
        } else {
            fields[field].value.value = self.data[field];
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
