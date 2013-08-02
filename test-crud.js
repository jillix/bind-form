M.wrap('github/jillix/bind-form/dev/test-crud.js', function (require, module, exports) {

var templateName = 'crudTest';
var data = {
    template: {
        t: '_template',
        d: {
            db: 'dms',
            collection: templateName,
            name: 'Crud Test',
            schema: {
                field1: {type: 'string'},
                field2: {type: 'string', required: true}
            }
        }
    },
    update: {
        t: '51fa9386532c16152b000001',
        q: {},
        d: {
            $set: {
                field1: 'trucken1',
                field2: 'trucken2'
            }
        },
        o: {upsert: true}
    },
    remove: {}
};
function crud (method, data) {
    this.emit(method, data, function (err, data) {
        console.log(method + ' result');
        console.log('--------------------------------------');
        console.log(err || data);
        console.log('\n');
    });
}

function init () {
    var self = this;
    
    //crud.call(self, 'insert', data.template);
    crud.call(self, 'update', data.update);
    //crud.call(self, 'remove', data.remove);
}

module.exports = init;

return module; });