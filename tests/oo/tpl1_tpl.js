
!function (root, moduleName, moduleDefinition) {
    // export the module
    var m;
    // node, CommonJS, etc..
    if ( 'object' === typeof(module) && module.exports ) module.exports = moduleDefinition();
    // browser and AMD, etc..
    else (root[ moduleName ] = m = moduleDefinition()) && ('function' === typeof(define) && define.amd && define(moduleName,[],function(){return m;}));
}(this, 'Contemplate_tpl1_Cached', function( ){
    "use strict";
    return function( Contemplate ) {
    /* Contemplate cached template 'tpl1' */
    
    /* constructor */
    function Contemplate_tpl1_Cached(id)
    {
        var self = this;
        /* initialize internal vars */
        
        self._renderer = null;
        self._blocks = null;
        self._extends = null;
        self.id = id || null;
        
        /* tpl-defined blocks render code starts here */
        
        self._blocks = { 
            
            
            /* tpl block render method for block '3' */
            '3': function( Contemplate, data, self, __i__ ) {
                "use strict";
                var __p__ = '';
                
                __p__ += '(1 3)';
                return __p__;
                
            }
            ,
            
            
            /* tpl block render method for block '2' */
            '2': function( Contemplate, data, self, __i__ ) {
                "use strict";
                var __p__ = '';
                
                __p__ += '(1 2)' + "\n" + '        ' +  __i__.renderBlock('3', data);
                __p__ += '' + "\n" + '    ';
                return __p__;
                
            }
            ,
            
            
            /* tpl block render method for block '1' */
            '1': function( Contemplate, data, self, __i__ ) {
                "use strict";
                var __p__ = '';
                
                __p__ += '(1 1)' + "\n" + '    ' +  __i__.renderBlock('2', data);
                __p__ += '' + "\n" + '';
                return __p__;
                
            }
            
        };
        
        /* tpl-defined blocks render code ends here */
        
        /* extend tpl assign code starts here */
        
        /* extend tpl assign code ends here */
    };
    
    /* extends main Contemplate.Template class */
    Contemplate_tpl1_Cached.prototype = Object.create(Contemplate.Template.prototype);
    /* tpl render method */
    Contemplate_tpl1_Cached.prototype.render = function( data, __i__ ) {
        "use strict";
        var self = this, __p__ = '';
        __i__ = __i__ || self;
        /* tpl main render code starts here */
        
        __p__ += '' +  __i__.renderBlock('1', data);
        __p__ += '';
        
        /* tpl main render code ends here */
        return __p__;
    };
    
    // export it
    return Contemplate_tpl1_Cached;
    };
});
