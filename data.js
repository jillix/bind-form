M.wrap('github/jillix/bind-form/dev/data.js', function (require, module, exports) {

function flattenObject (obj) {
    var toReturn = {};

    for (var key in obj) {
        if (!obj.hasOwnProperty(key)) {
             continue;
        }

        var type = obj[key].constructor.name;
        if (type === 'Object') {
            var flatObject = flattenObject(obj[key]);
            for (var x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) {
                     continue;
                }

                toReturn[key + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[key] = obj[key];
        }
    }
    return toReturn;
};

function setData (data) {
    var self = this;
    
    // check if data has template
    if (typeof data !== 'object' || !data._id) {
        return;
    }
    
    var crud = {
        t: self.template.id,
        q: {_id: data._id},
        o: {limit: 1}
    };

    self.emit('find', crud, function (err, data) {

        // TODO handle error
        if (err || !data[0]) {
            return;
        }

        self.data = flattenObject(data[0]);
        self.emit('dataSet', self.data);
    });
}

function save () {
    var self = this;
    
    // if no data is set, no data can be saved
    if (!self.data) {
        return;
    }
    
    // create crud request
    var crud = {
        t: self.template.id,
        d: self.send
    };
    
    // upsert if item already exists
    if (self.data._id) {
        crud.q = {_id: self.data._id};
        delete crud.d._id;
        crud.d = { $set: crud.d };
    }
    
    // do request with the crud module
    self.emit(crud.q ? 'update' : 'insert', crud, function (err, data) {
        
        // update current data
        if (data._id) {
            self.data = data;
        }
        
        self.emit('setData', {_id: self.data._id});
        self.once('dataSet', function () {

            if (err || !self.config.options.callGetItem) {
                self.emit('saved', err, self.data);
                return;
            }

            self.emit('getItem', self.data, function (err, dataItem) {
                self.emit('saved', err, dataItem);
            });
        });
    });
}

function remove () {
    var self = this;
    
    // if not data is set, no data can be removed
    if (!self.data || !self.data._id) {
        return;
    }
    
    // create crud object
    var crud = {
        t: self.template.id,
        q: {_id: self.data._id}
    };
    
    // do request with the crud module
    self.emit('remove', crud, function (err, result) {
        
        // reset form data
        if (!err && result) {
            self.data = {};
        }
        
        // emit remove operation complete
        self.emit('removed', err, result);
    });
}

function init () {
    var self = this;
    
    // init data events when a template is set
    self.once('templateSet', function () {
        self.on('setData', setData);
        self.on('saveCrud', save);
        self.on('rm', remove);
    });
}

module.exports = init;

return module; });
