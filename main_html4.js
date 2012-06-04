define(["adioo/bind/bind"], function(Bind) {
    
    var Form = {
        
        fill: function(data) {
            
            for (var i = 0, l = this.form.elements.length; i < l; ++i) {
                
                if (data[this.form.elements[i].name]) {
                    
                    //fill data
                    this.form.elements[i].value = data[this.form.elements[i].name];
                }
            }
        },
        
        reset: function() {
            
            this.form.reset();
        },
        
        save: function() {
            
            
        }
    };
    
    function init(config) {
        
        var form = N.clone(Form, this);
        
        form.form = form.dom.querySelector("form");
        
        if (!form.dom) {
            
            return null;
        }
        
        if (config.fillForm) {
            
            form.obs.l(config.fillForm, function(data) {
                
                form.fill(data);
            });
        }
        
        if (config.resetForm) {
            
            form.obs.l(config.resetForm, function() {
                
                form.reset();
            });
        }
        
        return form;
    };
    
    return init;
});