M.wrap('github/jillix/bind-form/dev/ui/fields.js', function (require, module, exports) {
function setFields () {
    var self = this;
    
    self.emit('fieldsSet');
}

function fillForm () {
    var self = this;

    self.emit('formFilled');
}

function init () {
    var self = this;
    
    self.on('formHtmlFetched');
    
    self.on('setFields', setFields);

    // listen to core events
    self.on('dataSet', fillForm);
}

module.exports = init;

return module; });
