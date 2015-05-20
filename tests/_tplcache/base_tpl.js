
!function (root, moduleName, moduleDefinition) {
    // export the module
    var m;
    // node, CommonJS, etc..
    if ( 'object' === typeof(module) && module.exports ) module.exports = moduleDefinition();
    // browser and AMD, etc..
    else (root[ moduleName ] = m = moduleDefinition()) && ('function' === typeof(define) && define.amd && define(moduleName,[],function(){return m;}));
}(this, 'Contemplate_base_Cached', function( ){
    "use strict";
    return function( Contemplate ) {
    /* Contemplate cached template 'base' */
    
    /* constructor */
    function Contemplate_base_Cached(id)
    {
        var self = this;
        /* initialize internal vars */
        
        self._renderer = null;
        self._blocks = null;
        self._extends = null;
        self.id = id || null;
        
        /* tpl-defined blocks render code starts here */
        
        self._blocks = { 
            
            
            /* tpl block render method for block 'Block3' */
            'Block3': function( Contemplate, data, self, __i__ ) {
                "use strict";
                var __p__ = '';
                
                __p__ += 'Base template Block3';
                return __p__;
                
            }
            ,
            
            
            /* tpl block render method for block 'Block2' */
            'Block2': function( Contemplate, data, self, __i__ ) {
                "use strict";
                var __p__ = '';
                
                __p__ += 'Base template Block2' + "\n" + '<!-- call the super block here in OO manner, if any -->' + "\n" + '' + (self.renderSuperBlock("Block2", data)) + '' + "\n" + '';
                return __p__;
                
            }
            ,
            
            
            /* tpl block render method for block 'Block12' */
            'Block12': function( Contemplate, data, self, __i__ ) {
                "use strict";
                var __p__ = '';
                
                __p__ += 'Base template nested Block12';
                return __p__;
                
            }
            ,
            
            
            /* tpl block render method for block 'Block11' */
            'Block11': function( Contemplate, data, self, __i__ ) {
                "use strict";
                var __p__ = '';
                
                __p__ += 'Base template nested Block11';
                return __p__;
                
            }
            ,
            
            
            /* tpl block render method for block 'Block1' */
            'Block1': function( Contemplate, data, self, __i__ ) {
                "use strict";
                var __p__ = '';
                
                __p__ += '' + "\n" + 'Base template Block1' + "\n" + '<br /><br />' + "\n" + '' +  __i__.renderBlock('Block11', data);
                __p__ += '' + "\n" + '<br /><br />' + "\n" + '' +  __i__.renderBlock('Block12', data);
                __p__ += '' + "\n" + '<br /><br />' + "\n" + '';
                return __p__;
                
            }
            
        };
        
        /* tpl-defined blocks render code ends here */
        
        /* extend tpl assign code starts here */
        
        /* extend tpl assign code ends here */
    };
    
    /* extends main Contemplate.Template class */
    Contemplate_base_Cached.prototype = Object.create(Contemplate.Template.prototype);
    /* tpl render method */
    Contemplate_base_Cached.prototype.render = function( data, __i__ ) {
        "use strict";
        var self = this, __p__ = '';
        __i__ = __i__ || self;
        /* tpl main render code starts here */
        
        __p__ += '<!-- this is the base template -->' + "\n" + '' + "\n" + '<strong>This is the base template</strong>' + "\n" + '' + "\n" + '' + "\n" + '<br /><br /><br /><br />' + "\n" + '<strong>This is Block1</strong><br />' + "\n" + '' +  __i__.renderBlock('Block1', data);
        __p__ += '' + "\n" + '' + "\n" + '<br /><br /><br /><br />' + "\n" + '<strong>This is Block2</strong><br />' + "\n" + '' +  __i__.renderBlock('Block2', data);
        __p__ += '' + "\n" + '' + "\n" + '<br /><br /><br /><br />' + "\n" + '<strong>This is Block3</strong><br />' + "\n" + '' +  __i__.renderBlock('Block3', data);
        __p__ += '' + "\n" + '' + "\n" + '' + "\n" + '<br /><br /><br /><br />' + "\n" + '<strong>This is Block2 Again</strong><br />' + "\n" + '' +  __i__.renderBlock('Block2', data);
        __p__ += '' + "\n" + '';
        
        /* tpl main render code ends here */
        return __p__;
    };
    
    // export it
    return Contemplate_base_Cached;
    };
});
