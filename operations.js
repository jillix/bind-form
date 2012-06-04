var send = require(CONFIG.root + "/core/send.js").send;

exports.saveData = function(link) {
    
    console.log(link.data);
    
    send.ok(link.res);
};