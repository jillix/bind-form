define(["adioo/bind/bind", "adioo/list/main"], function(Bind, List) {
    
    var Form = {
        
        fill: function(data) {
            
            this.reset();
            
            for (var i = 0, l = this.form.elements.length; i < l; ++i) {
                
                if (data[this.form.elements[i].name]) {
                    
                    if (typeof data[this.form.elements[i].name] === "object") {
                        
                        data[this.form.elements[i].name] = JSON.stringify(data[this.form.elements[i].name]);
                    }
                    
                    //fill data
                    this.form.elements[i].value = data[this.form.elements[i].name];
                }
            }
            
            if (this.noSelection) {
                
                this.noSelection.style.display = "none";
            }
            
            this.form.style.display = "block";
        },
        
        reset: function() {
            
            this.form.reset();
        },
        
        save: function() {
            
            this.link("saveData", {data: new FormData(this.form)});
        }
    };
    
    function init(config) {
        
        var form = N.clone(Form, this);
        
        form.form = form.dom.querySelector("form");
        form.noSelection = form.dom.querySelector(".noVertexSelected");
        
        if (!form.form) {
            
            return null;
        }
        
        form.obs.l(config.fill || "fill", function(data) {
            
            form.fill(data);
        });
        
        form.obs.l(config.reset || "reset", function() {
                
            form.reset();
        });
        
        form.obs.l(config.save || "save", function() {
            
            form.save();
        });
        
        return form;
    };
    
    return init;
});