M.wrap('github/jillix/bind-form/dev/data.js', function (require, module, exports) {

function setData (data) {
    var self = this;
    
    // check if data has template
    if (typeof data !== 'object' && data._tp) {
        return;
    }
    
    self.data = data;
    self.emit('dataSet', data);
}

function save () {
    var self = this;
    
    // if no data is set, no data can be saved
    if (!self.data) {
        return;
    }
    
    // create crud query
    var crud = {
        t: self.data._tp,
        d: self.data,
        o: {upsert: true}
    };
    
    // upsert if item already exists
    if (self.data._id) {
        crud.q = {_id: self.data._id};
    }
    
    // do request with the crud module
    self.emit(crud.q ? 'update' : 'insert', crud, function (err, data) {
        
        // update current data
        if (data._id) {
            self.data = data;
        }
        
        self.emit('saved', err, data);
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
        t: self.data._tp,
        q: {_id: self.data._id}
    }
    
    // do request with the crud module
    self.emit('remove', crud, function (err, result) {
        
        // reset form data
        if (!err && result) {
            self.data = null;
        }
        
        // emit remove operation complete
        self.emit('removed', err, result);
    });
}

function init () {
    var self = this;
    
    self.on('setData', setData);
    self.on('save', save);
    self.on('rm', remove);
}

module.exports = init;

return module; });