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
            fields[field].value.value = self.data[field];
        }
    }
    
    self.emit('formFilled');
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
            self.data[field] = fields[field].value.value;
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
        } else {
            fields[field].value.value = null;
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
