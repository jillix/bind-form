M.wrap('github/jillix/bind-form/dev/test-crud.js', function (require, module, exports) {
    
var templateName = '52010deb420b75ca2f000001';
var data = {
    template: {
        t: '000000000000000000000000',
        d: {
            db: 'dms',
            collection: templateName,
            name: 'Crud Test',
            roles: {3: 1},
            schema: {
                field1: {type: 'string'},
                field2: {type: 'string', required: true}
            }
        }
    },
    update: {
        t: templateName,
        q: {},
        d: {
            $set: {
                field1: 'trucken1',
                field2: 'trucken2'
            }
        },
        o: {upsert: true}
    },
    remove: {
        t: templateName,
        q: {}
    }
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