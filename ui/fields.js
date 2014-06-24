function findValue (parent, dotNot) {

    if (!dotNot) return undefined;

    var splits = dotNot.split('.');
    var value;

    for (var i = 0; i < splits.length; i++) {
        value = parent[splits[i]];
        if (value === undefined) return undefined;
        if (typeof value === 'object') parent = value;
    }

    return value;
}

function findFunction (parent, dotNot) {

    var func = findValue(parent, dotNot);

    if (typeof func !== 'function') {
        return undefined;
    }

    return func;
}

function fillForm () {
    var self = this;
    
    // check if template form exists
    if (!self.formCache[self.template._id]) {
        return;
    }

    // reset only form UI data
    self.emit('reset', true);

    var fields = self.formCache[self.template._id].refs;
    var data = JSON.parse(JSON.stringify(self.data));

    for (var field in fields) {
        if (!fields.hasOwnProperty(field)) continue;

        for (var i = 0, l = fields[field].value.length; i < l; ++i) {

            // change value using filters
            var value = data[field];

            var filterValue = fields[field].value[i].getAttribute('data-filter');
            var filterFunction = findFunction(window, filterValue);

            if (typeof filterFunction === 'function') {
                value = filterFunction(self, data, field, value, fields[field].value[i]);
            }

            // consider the undefined values as empty string
            if (typeof value === 'undefined') {
                var schemaField = self.template.schema[field];
                switch (schemaField.type) {
                    case 'boolean':
                        value = schemaField.default || false;
                        break;
                    case 'number':
                        value = schemaField.default || 0;
                        break;
                    case 'date':
                        value = schemaField.default === 'now' || !schemaField.default ? '' : schemaField.default;
                        break;
                    default:
                        value = schemaField.default || '';
                }

                // disable field
                if (!fields[field].disabled) {
                    disableField.call(self, field, true);
                }
            }

            // fill data
            if (fields[field].value[i].html) {
                fields[field].value[i].innerHTML = value;
            } else {
                if (fields[field].value[i].getAttribute('type') === 'checkbox') {
                   fields[field].value[i].checked = toBoolean(value);
                } else if (fields[field].value[i].getAttribute('type') === 'radio') {
                    var valAttr = fields[field].value[i].getAttribute('value');
                    if (typeof value == 'boolean') {
                        valAttr = toBoolean(valAttr);
                    }
                   fields[field].value[i].checked = value == valAttr;
                } else {
                    fields[field].value[i].value = value;
                }
            }
        }
    }
    
    self.emit('formFilled');
}
function enableField (field) {
    var self = this;
    var fields = self.formCache[self.template._id].refs;

    if (!fields[field]) return;
    if (!fields[field].disabled) return;

    fields[field].disabled = false;

    for (var i = 0, l = fields[field].value.length; i < l; ++i) {

        fields[field].value[i].readOnly = false;
        self.emit('fieldEnabled', field, fields[field].value[i]);
    }
}

function disableField (field, stopChange) {
    var self = this;
    var fields = self.formCache[self.template._id].refs;

    if (!fields[field]) return;
    if (fields[field].disabled) return;

    for (var i = 0, l = fields[field].value.length; i < l; ++i) {

        if (fields[field].value[i].tagName === 'INPUT' || fields[field].value[i].tagName === 'TEXTAREA') {

            // disable inputs of type text or email
            if (fields[field].value[i].tagName === 'INPUT' && fields[field].value[i].getAttribute('type') !== 'text') {
                return;
            }

            // disable empty fields
            fields[field].value[i].readOnly = true;
            fields[field].disabled = true;

            // clear the value in the input
            if (fields[field].value[i].tagName === 'INPUT') {
                fields[field].value[i].value = '';
            } else {
                fields[field].value[i].innerHTML = '';
            }

            // add click handler
            (function (field, value) {
                function listener () {
                    enableField.call(self, field);
                    value.removeEventListener('click', listener, false);
                }
                value.addEventListener('click', listener, false);
            })(field, fields[field].value[i]);
        }
    }

    if (!stopChange) {
        self.emit('dataChanged');
    }
}

function toBoolean(value) {
    if (value === true || value === 'true' || value === 'on' || value === 'yes' || value == 1) {
        return true;
    }

    return false;
}

function updateData (callback) {
    var self = this;
    
    if (!self.data) {
        self.data = {};
    }
    
    self.send = {};
    
    var fields = self.formCache[self.template._id].refs;
    
    for (var field in fields) {
        if (!fields.hasOwnProperty(field)) continue;
        
        for (var i = 0, l = fields[field].value.length; i < l; ++i) {
            // update data
            if (fields[field].value[i] && !fields[field].value[i].html) {
                
                // the value is for some inputs the "checked" property
                var value = fields[field].value[i].value;
                if (['checkbox', 'radio'].indexOf(fields[field].value[i].getAttribute('type')) > -1) {
                    value = fields[field].value[i].checked;
                }
                
                if (self.template.schema[field].type === 'boolean') {
                    self.data[field] = self.send[field] = toBoolean(value);
                } else {
                    self.data[field] = value;
                    
                    // ingore empty and disabled fields
                    if (value !== '' || fields[field].disabled) {
                        self.send[field] = value;
                    }
                }
            }
        }
    }
    
    self.emit('dataUpdated', callback);
}

function reset (formOnly) {
    var self = this;
    
    // check if template form exists
    if (!self.formCache[self.template._id]) {
        return;
    }
    
    var fields = self.formCache[self.template._id].refs;
    
    if (!formOnly) {
        // reset internal data
        self.data = {};
    }

    // reset value fields
    for (var field in fields) {
        if (!fields.hasOwnProperty(field)) continue;

        // enable all fields
        enableField.call(self, field);

        for (var i = 0, l = fields[field].value.length; i < l; ++i) {
            // textarea inputs
            if (fields[field].value[i].html) {
                fields[field].value[i].innerHTML = '';
            }
            // radio and checkbox inputs
            else if (['checkbox', 'radio'].indexOf(fields[field].value[i].getAttribute('type')) > -1) {
                fields[field].value[i].checked = false;
            }
            // select inputs
            else if (fields[field].value[i].tagName === 'SELECT') {
                var select = fields[field].value[i];
                select.value = '';
                for (var j = 0; j < select.children.length; ++j) {
                    if (select.children[j].hasAttribute('selected')) {
                        if (select.children[j].hasAttribute('value')) {
                            select.value = select.children[j].getAttribute('value');
                        } else {
                            select.value = select.children[j].innerText;
                        }
                        break;
                    }
                }
            }
            // other inputs
            else {
                fields[field].value[i].value = '';
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
    self.on('fieldSet', fillForm);
    self.on('reset', reset);
    self.on('disableField', disableField);
}

module.exports = init;
