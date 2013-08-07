M.wrap('github/jillix/bind-form/dev/test-crud.js', function (require, module, exports) {
    
var templateName = '52010deb420b75ca2f000001';
var crud = {
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
        d: {
            $set: {
                _tp: templateName,
                field1: 'heinz',
                field2: 'trucken'
            }
        },
        o: {upsert: true}
    },
    remove: {
        t: templateName,
        q: {
        }
    }
};

var data = {
    _id: '52023242903538a8394d1278',
    _tp: templateName,
    field1: 'trucken doch',
    field2: 'trucken feschter'
}

function request (method, data) {
    this.emit(method, data, function (err, data) {
        console.log(method + ' result');
        console.log('--------------------------------------');
        console.log(err || data);
        console.log('\n');
    });
}

function init () {
    var self = this;
    
    self.emit('setData', data);
    //self.emit('save');
    //self.emit('remove', data);
    
    //request.call(self, 'insert', data.template);
    //request.call(self, 'update', crud.update);
    //request.call(self, 'remove', data.remove);
}

module.exports = init;

return module; });