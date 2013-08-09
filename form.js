M.wrap('github/jillix/bind-form/dev/form.js', function (require, module, exports) {

var data = require('./data');
var ui = require('./ui');

// TODO only for dev
var devConfig = {
    crud: 'crud', // crud miid
    setTemplate: [''], // listen to setTemplate event from this miids
    ui: {
        controls: {
            save: '',
            remove: '',
            cancel: ''
        },
        progress: {}
    }
};
var devTemplate = {
    id: '000000000IDIDIDIDIDID',
    name: 'Dev Tempalte',
    html: '/html/crud/frmTmplArticle.html',
    schema: {
        name: {
            type: 'string', required: true,
            label: 'Produkt', order: 5
        },
        nr: {
            type: 'string', required: true,
            label: 'Art.-Nr', order: 10
        },
        price: {
            type: 'number', required: true,
            label: 'Bruttopreis', order: 20
        },
        discount: {
            type: 'number',
            label: 'Aktionspreis', order: 15
        }
    }
};

function setTemplate (template) {
    var self = this;
    
    // check tempalte
    if (typeof template !== 'object' || !template.id) {
        return;
    }
    
    //set current tempalte
    self.template = template;
    self.emit('templateSet');
}

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
        
        // set template
        self.on('setTemplate', setTemplate);
        
        // init ui
        if (config.ui) {
            ui.call(self);
        }
        
        self.emit('ready');
        
        // TODO only for dev
        setTimeout(function () {
            self.emit('setTemplate', devTemplate);
        }, 100);
    });
}

module.exports = init;

return module; });
