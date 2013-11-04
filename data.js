function flattenObject (obj) {
    var result = {};

    for (var key in obj) {
        if (!obj.hasOwnProperty(key)) {
             continue;
        }

        if (typeof obj[key] === 'object' && !(obj[key] instanceof Array)) {
            var flat = flattenObject(obj[key]);
            for (var x in flat) {
                if (!flat.hasOwnProperty(x)) {
                     continue;
                }

                result[key + '.' + x] = flat[x];
            }
        } else {
            result[key] = obj[key];
        }
    }
    return result;
};

function unflattenObject (flat) {
    var result = {};
    var parentObj = result;

    Object.keys(flat).forEach(function(key) {
        var subkeys = key.split('.');
        var last = subkeys.pop();

        subkeys.forEach(function(subkey) {
            parentObj[subkey] = typeof parentObj[subkey] === 'undefined' ? {} : parentObj[subkey];
            parentObj = parentObj[subkey];
        });

        parentObj[last] = flat[key];
        parentObj = result;
    });

    return result;
}

function prepareData (data) {
    var self = this;
    
    // wait for html
    if (self.template.options && self.template.options.html && !self.formCache[self.template._id]) {
        self.once('formRendered', function () {
            self.data = flattenObject(data);
            self.emit('dataSet', self.data);
        });
        
        return;
    }
    
    self.data = flattenObject(data);
    self.emit('dataSet', self.data);
}

function setData (data, query) {
    var self = this;

    if (!self.template) {
        return;
    }

    // check if data has template
    if (typeof data !== 'object' || self.findBusy) {
        return;
    }
    
    // don't fetch data from server when query is false
    if (query === false) {
        prepareData.call(self, data);
        return;
    }
    
    self.findBusy = true;

    var crud = {
        t: self.template._id,
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
        
        prepareData.call(self, resultData[0] || data);
    });
}

function setField (field, value) {
    var self = this;

    if (!self.data || !self.template) {
        return;
    }

    // check if field in tempalte exitst
    if (self.template.schema[field]) {
        self.data[field] = value;
        self.emit('dataChanged');
    }

    self.emit('fieldSet');
}

// TODO hack for CCTool only
function getUpdater (field, value) {
    var self = this;

    if (!self.data || !self.template) {
        return;
    }

    if (self.template.schema[field]) {
        self.data[field] = value;
    }
}

function save (callback) {
    var self = this;
    callback = callback || function () {};

    // if no data is set, no data can be saved
    if (!self.data || !self.template) {
        return;
    }

    // TODO this is custom code!!
    if (self.data['cc.last_update.by']) {
        self.send['cc.last_update.by'] = self.data['cc.last_update.by'];
        self.emit('fieldSet');
    }

    // create crud request
    var crud = {
        t: self.template._id,
        d: self.send
    };


    // upsert if item already exists
    if (self.data._id) {
        crud.q = {_id: self.data._id};
        delete crud.d._id;
        crud.d = { $set: crud.d };
    }

    // do an insert if no query
    var isInsert = !crud.q;
    if (isInsert) {
        crud.d = unflattenObject(crud.d);
    }

    // do request with the crud module
    self.emit(isInsert ? 'insert' : 'update', crud, function (err, data) {

        // for insert queries

        if (isInsert) {

            if (err || !data || !data.length) {
                callback("No self.data or self.template set.");
                self.emit('saved', err || 'Missing insert result');
                return;
            }

            self.data = data[0];
            callback(null, self.data);
            self.emit('saved', null, self.data);
            return;
        }

        // for update queries

        self.once('dataSet', function () {

            if (!self.config.options.callGetItem) {
                callback(null, self.data);
                self.emit('saved', null, self.data);
                return;
            }

            self.emit('getItem', self.data, function (err, dataItem) {
                callback(err, dataItem);
                self.emit('saved', err, dataItem);
            });
        });

        // update queries require a form refresh
        self.emit('setData', {_id: self.data._id});
    });
}

function remove () {
    var self = this;

    // if not data is set, no data can be removed
    if (!self.data || !self.data._id || self.template) {
        return;
    }

    // create crud object
    var crud = {
        t: self.template._id,
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

