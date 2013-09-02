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

function setData (data, query) {
    var self = this;
    
    // check if data has template
    if (typeof data !== 'object' || self.findBusy) {
        return;
    }
    
    self.findBusy = true;
    
    var crud = {
        t: self.template.id,
        q: query || {_id: data._id},
        o: {limit: 1},
        // TODO remove this when updates on linked fields are possible
        noJoins: true
    };
    
    self.emit('find', crud, function (err, resultData) {
        
        self.findBusy = false;
        
        // TODO handle error
        if (err) {
            return;
        }
        
        self.data = flattenObject(resultData[0] || data);
        self.emit('dataSet', self.data);
    });
}

function setField (field, value) {
    var self = this;
    
    // check if field in tempalte exitst
    if (self.template.schema[field]) {
        self.data[field] = value;
        self.emit('dataChanged');
    }
    
    self.emit('fieldSet');
}

function getUpdater (field, value) {
    var self = this;

    if (self.template.schema[field]) {
        self.data[field] = value;
    }
}

function save () {
    var self = this;
    
    // if no data is set, no data can be saved
    if (!self.data) {
        return;
    }
    
    // TODO this is custom code!!
    if (self.data['cc.last_update.by']) {
        self.send['cc.last_update.by'] = self.data['cc.last_update.by'];
        self.emit('fieldSet');
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
        if (data && data._id) {
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
        self.on('setField', setField);
        self.on('saveCrud', save);
        self.on('rm', remove);
        self.on('getUpdater', getUpdater);
    });
}

module.exports = init;

return module; });
