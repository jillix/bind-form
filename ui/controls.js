function save () {
    var self = this;
}

function remove () {
    var self = this;
}

function cancel () {
    var self = this;
}

function init () {
    var self = this;
    
    self.on('uiSave', save);
    self.on('uiRm', remove);
    self.on('uiCancel', cancel);
}

module.exports = init;
