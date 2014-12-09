
!function (root, moduleName, moduleDefinition) {

    //
    // export the module
    // node, CommonJS, etc..
    if ( 'object' === typeof(module) && module.exports ) module.exports = moduleDefinition();
    // AMD, etc..
    else if ( 'function' === typeof(define) && define.amd ) define( moduleDefinition );
    // browser, etc..
    else root[ moduleName ] = moduleDefinition();

}(this, 'Contemplate_base_Cached', function( ) {
    "use strict";
    return function( Contemplate ) {
    /* Contemplate cached template 'base' */
    
    
    /* constructor */
    function Contemplate_base_Cached(id)
    {
        /* initialize internal vars */
        
        this._renderer = id;
        this._blocks = null;
        this._extends = null;
        this.d = null;
        this.id = id;
        
        
        /* tpl-defined blocks render code starts here */
        
        this._blocks = { 
            
            
            /* tpl block render method for block 'Block3' */
            'Block3': function(Contemplate,__i__) {
                
                var __p__ = '', data = __i__.d;
                 
                __p__ += 'Base template Block3';
                return __p__;
                
            }
            ,
            
            
            /* tpl block render method for block 'Block2' */
            'Block2': function(Contemplate,__i__) {
                
                var __p__ = '', data = __i__.d;
                 
                __p__ += 'Base template Block2';
                return __p__;
                
            }
            ,
            
            
            /* tpl block render method for block 'Block12' */
            'Block12': function(Contemplate,__i__) {
                
                var __p__ = '', data = __i__.d;
                 
                __p__ += 'Base template nested Block12';
                return __p__;
                
            }
            ,
            
            
            /* tpl block render method for block 'Block11' */
            'Block11': function(Contemplate,__i__) {
                
                var __p__ = '', data = __i__.d;
                 
                __p__ += 'Base template nested Block11';
                return __p__;
                
            }
            ,
            
            
            /* tpl block render method for block 'Block1' */
            'Block1': function(Contemplate,__i__) {
                
                var __p__ = '', data = __i__.d;
                 
                __p__ += '' + "\n" + 'Base template Block1' + "\n" + '<br /><br />' + "\n" + '' +  __i__.renderBlock( 'Block11' ); 
                __p__ += '' + "\n" + '<br /><br />' + "\n" + '' +  __i__.renderBlock( 'Block12' ); 
                __p__ += '' + "\n" + '<br /><br />' + "\n" + '';
                return __p__;
                
            }
            
        };
        
        /* tpl-defined blocks render code ends here */
        
        
        /* extend tpl assign code starts here */
        
        /* extend tpl assign code ends here */
    };
    
    
    /* extends main Contemplate.Tpl class */
    Contemplate_base_Cached.prototype = Object.create(Contemplate.Tpl.prototype);
    /* tpl render method */
    Contemplate_base_Cached.prototype.render = function( data, __i__ ) {
        if ( !__i__ ) __i__ = this;
        var __p__ = '';
        if ( this._extends )
        {
            __p__ = this._extends.render(data, __i__);
        }
        else
        {
            /* tpl main render code starts here */
            
            __i__.d = data;
            __p__ += '<!-- this is the base template -->' + "\n" + '' + "\n" + '<strong>This is the base template</strong>' + "\n" + '' + "\n" + '' + "\n" + '<br /><br /><br /><br />' + "\n" + '<strong>This is Block1</strong><br />' + "\n" + '' +  __i__.renderBlock( 'Block1' ); 
            __p__ += '' + "\n" + '' + "\n" + '<br /><br /><br /><br />' + "\n" + '<strong>This is Block2</strong><br />' + "\n" + '' +  __i__.renderBlock( 'Block2' ); 
            __p__ += '' + "\n" + '' + "\n" + '<br /><br /><br /><br />' + "\n" + '<strong>This is Block3</strong><br />' + "\n" + '' +  __i__.renderBlock( 'Block3' ); 
            __p__ += '' + "\n" + '' + "\n" + '' + "\n" + '<br /><br /><br /><br />' + "\n" + '<strong>This is Block2 Again</strong><br />' + "\n" + '' +  __i__.renderBlock( 'Block2' ); 
            __p__ += '' + "\n" + '';
            
            /* tpl main render code ends here */
        }
        this.d = null;
        return __p__;
    };
    
    // export it
    return Contemplate_base_Cached;
    };
});
