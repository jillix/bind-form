M.wrap('github/jillix/bind-form/dev/form.js', function (require, module, exports) {

var data = require('./data');
var ui = require('./ui');

// TODO only for dev
var devConfig = {
    crud: 'crud', // crud miid
    setTemplate: [''], // listen to setTemplate event from this miids
    ui: {
        target: '.form-container',
        controls: {
            save: 'button[name=save]',
            remove: 'button[name=remove]',
            cancel: 'button[name=cancel]'
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
            label: 'Produkt', order: 5,
            selectors: {
                label: '.labelName',
                value: 'input[name=name]'
                // attr: 'attrName'
            }
        },
        nr: {
            type: 'string', required: true,
            label: 'Art.-Nr', order: 10,
            selectors: {
                label: '.labelArticleNr',
                value: '.articleNr'
            }
        },
        price: {
            type: 'number', required: true,
            label: 'Bruttopreis', order: 20,
            selectors: {
                label: '.labelPrice',
                value: 'input[name=price]'
            }
        },
        discount: {
            type: 'number',
            label: 'Aktionspreis', order: 15,
            selectors: {
                label: '.labelDiscount',
                value: 'input[name=discount]'
            }
        }
    }
};
var devData = {
    _tp: 'templateId',
    nr: 'trucken-nummer',
    name: 'Trucken Name',
    price: 3000,
    discount: 1000
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
                setTimeout(function () {
                self.emit('setData', devData);
            }, 100);
        }, 10);
    });
}

module.exports = init;

return module; });
