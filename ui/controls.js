// TODO use bind for dom interaction/manipulation
function get(s,c){
    try{return (c||document).querySelector(s);}
    catch (err) {
        return null;
    }
}

function init () {
    var self = this;
    
    // save dom refs
    self.ui = {};
    
    // TOOD define config for ui controls events
    
    // save
    if (self.ui.save = get(self.config.ui.controls.save, self.dom)) {
        self.ui.save.addEventListener('click', function () {
            self.emit('save');
        });
    }
    
    // remove
    if (self.ui.remove = get(self.config.ui.controls.remove, self.dom)) {
        self.ui.remove.addEventListener('click', function () {
            self.emit('rm');
            self.emit('reset');
        });
    }
    
    // cancel
    if (self.ui.cancel = get(self.config.ui.controls.cancel, self.dom)) {
        self.ui.cancel.addEventListener('click', function () {
            self.emit('reset');
            self.emit('cancel');
        });
    }
}

module.exports = init;

