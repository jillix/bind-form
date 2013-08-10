M.wrap('github/jillix/bind-form/dev/ui/fields.js', function (require, module, exports) {
// TODO generate form fields from a configuration
/*function setFields () {
    var self = this;
    
    self.emit('fieldsSet');
}*/

function fillForm () {
    var self = this;
    
    self.emit('formFilled');
}

function reset () {
    var self = this;
    
    self.emit('formReseted');
}

function init () {
    var self = this;
    
    //self.on('setFields', setFields);
    self.on('dataSet', fillForm);
    self.on('reset', reset);
}

module.exports = init;

return module; });
