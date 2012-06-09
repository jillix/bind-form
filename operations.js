var send = require(CONFIG.root + "/core/send.js").send;

exports.saveItem = function(link) {
    
    console.log(link.data);
    
    send.ok(link.res);
};

exports.removeItem = function(link) {
    
    console.log(link.data);
    
    send.ok(link.res);
};