define(["adioo/bind/bind"], function(Bind) {
    
    var Form = {
        
        fill: function(data) {
            
        },
        
        reset: function() {
        
        }
    };
    
    function init(config) {
        
        var form = N.clone(Form, this);
        
        if (config.fillForm) {
            
            form.obs.l(config.fillForm, function(data) {
                
                form.fill(data);
            });
        }
        
        if (config.reset) {
            
            form.resetElm = form.dom.querySelector(config.reset);
        }
        
        return form;
    };
    
    return init;
});