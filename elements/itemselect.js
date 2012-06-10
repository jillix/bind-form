"use strict";

define(function() {
    
    //..
    function handler(field, value) {
        
        field.ref.value = value;
    }
    
    function init(form) {
        
        //..
        return handler;
    }
    
    return init;
});