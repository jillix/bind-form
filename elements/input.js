"use strict";

define(function() {
    
    //..
    function handler(field, value) {
        
        if (typeof value === "object") {
            
            value = JSON.stringify(value);
        }
        
        field.ref.value = value;
    }
    
    function init(form) {
        
        //..
        return handler;
    }
    
    return init;
});