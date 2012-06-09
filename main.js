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
            
            for (var i = 0, l = this.form.elements.length, elm; i < l; ++i) {
                
                elm = this.form.elements[i];
                
                if (data[elm.name]) {
                    
                    if (typeof data[this.form.elements[i].name] === "object") {
                        
                        data[this.form.elements[i].name] = JSON.stringify(data[this.form.elements[i].name]);
                    }
                    
                    //fill data
                    this.form.elements[i].value = data[this.form.elements[i].name];
                }
            }
            
            if (this.empty) {
                
                this.empty.style.display = "none";
            }
            
            this.form.style.display = "block";
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
        
        var form = N.clone(Form, this);
        
        form.fields = [];
        form.form = form.dom.querySelector("form");
        form.empty = form.dom.querySelector(".noVertexSelected");
        
        config.fields = [
            {
                type: "input"
            },
            {
                type: "itemselect"
            },
            {
                type: "dataselect"
            }
        ];
        
        if (!form.form || !config.fields) {
            
            return null;
        }
        
        // form fields
        // TODO load element handlers on demand
        for (var i = 0, l = config.fields.length, elms = []; i < l; ++i) {
            
            elms.push("adioo/form/elements/" + config.fields[i].type);
            
            // init element and save element handler
            /*if (Elements[config.fields[i].type]) {
                
                form.fields.push(
                
                    Elements[config.fields[i].type](config.fields[i])
                );
            }*/
        }
        
        //load demanded element handlers
        require(elms, function() {
        
            console.log(arguments);
        
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