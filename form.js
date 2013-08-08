M.wrap('github/jillix/bind-form/dev/form.js', function (require, module, exports) {

var data = require('./data');
var ui = require('./ui');

// TODO only for dev
var devConfig = {
    crud: 'crud', // crud miid
    ui: {
        progress: {}
    }
};

function init (config) {
    var self = this;
    
    // TODO only for dev
    config = devConfig;
    
    self.config = config;
    
    if (!config.crud) {
        return console.error('No crud miid defined.');
    }

    // wait for the crud module
    self.onready(config.crud, function () {
        
        // init data events
        data.call(self);
        
        // init ui
        if (config.ui) {
            ui.call(self);
        }
    });
}

module.exports = init;

return module; });
