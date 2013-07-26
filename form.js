M.wrap('github/jillix/bind-form/dev/form.js', function (require, module, exports) {
var devConfig = {
    crud: 'crud', // crud miid
    
    // where to put the form
    target: '',
    
    // main field config
    fields: {},
    
    // set predefined fields and values
    setFields: {},
    
    // progress settings
    progress: {}
};

function init (config) {
    var self = this;
    
    // TODO only for dev
    config = devConfig;
    
    self.config = config;
    
    controls.call(self);
}

return module; });
