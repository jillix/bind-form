/*
    config = {
        
        // form element
        form: "#selector",
        emtpy: "#selector",
        
        // observer events
        fill: "eventName",
        set: "eventName",
        save: "eventName",
        reset: "eventName",
        
        // operations (source object)
        save: {},
        remove: {},
        
        // form field configs
        fields: [
            {
                type: "input",
                //...
            },
            {
                type: "itemselect",
                //...
            }
        ]
    }
*/
    
define(function() {
    
    var Form = {
        
        fill: function(data) {
            
            this.reset();
            
            for (var i = 0, l = this.fields.length; i < l; ++i) {
                
                if (data[this.fields[i].name]) {
                    
                    //exec handler
                    this.handlers[this.fields[i].type](this.fields[i], data[this.fields[i].name]);
                }
            }
            
            if (this.empty) {
                
                this.empty.style.display = "none";
                this.form.style.display = "block";
            }
        },
        
        set: function(itemName, value) {
            
            // set a value in a field
        },
        
        reset: function() {
            
            this.form.reset();
        },
        
        save: function(validate) {
            
            if (validate) {
                
                // TODO validate form
            }
            
            this.link("saveItem", {data: new FormData(this.form)});
        },
        
        remove: function() {
            
            this.link("removeItem", {data: new FormData(this.form)});
        }
    };
    
    function init(config) {
        
        config.fields = [
            {
                type: "input",
                name: "name"
            },
            {
                type: "itemselect",
                name: "application"
            },
            {
                type: "dataselect"
            },
            {
                type: "input"
            },
            {
                type: "input"
            },
            {
                type: "input"
            },
            {
                type: "input"
            },
            {
                type: "dataselect"
            }
        ];
        
        var form = N.clone(Form, this);
        
        form.fields = [];
        form.handlers = {};
        form.form = form.dom.querySelector("form");
        form.empty = form.dom.querySelector(".noVertexSelected");
        
        if (!form.form || !config.fields) {
            
            return null;
        }
        
        // form fields
        for (var i = 0, l = config.fields.length, elms = [], n = 0, field; i < l; ++i) {
            
            // save dom reference
            if (!(config.fields[i].ref = form.form.querySelector("*[name='" + config.fields[i].name + "']"))) {
                
                // continue if field is not found in the dom
                continue;
            }
            
            form.fields.push(config.fields[i]);
            
            //prepare module loading
            if (typeof form.handlers[config.fields[i].type] === "undefined") {
                
                form.handlers[config.fields[i].type] = n;
                
                elms.push("adioo/form/elements/" + config.fields[i].type);
                
                ++n;
            }
        }
        
        //load demanded element handlers
        require(elms, function() {
            
            // init module and save form field handler
            for (var type in form.handlers) {
                
                if (arguments[form.handlers[type]]) {
                    
                    form.handlers[type] = arguments[form.handlers[type]](form);
                }
            }
            
            // events
            form.obs.l(config.fill || "fill", function(data) {
                
                form.fill(data);
            });
            
            form.obs.l(config.set || "set", function(itemName, value) {
                
                form.set(itemName, value);
            });
            
            form.obs.l(config.reset || "reset", function() {
                    
                form.reset();
            });
            
            form.obs.l(config.save || "save", function() {
                
                form.save();
            });
        
        });
        
        return form;
    };
    
    return init;
});