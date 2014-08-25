
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
    /* quasi extends main Contemplate class */
    
    /* constructor */
    function Contemplate_base_Cached(id)
    {
        /* initialize internal vars */
        var _extends = null, _blocks = null;
        
        this.id = id;
        this.d = null;
        
        
        /* tpl-defined blocks render code starts here */
        
        _blocks = { 
            
            
            /* tpl block render method for block 'Block3' */
            'Block3': function(__i__) {
                
                var __p__ = '';
                 
                __p__ += 'Base template Block3';
                return __p__;
                
            }
            ,
            
            
            /* tpl block render method for block 'Block2' */
            'Block2': function(__i__) {
                
                var __p__ = '';
                 
                __p__ += 'Base template Block2';
                return __p__;
                
            }
            ,
            
            
            /* tpl block render method for block 'Block12' */
            'Block12': function(__i__) {
                
                var __p__ = '';
                 
                __p__ += 'Base template nested Block12';
                return __p__;
                
            }
            ,
            
            
            /* tpl block render method for block 'Block11' */
            'Block11': function(__i__) {
                
                var __p__ = '';
                 
                __p__ += 'Base template nested Block11';
                return __p__;
                
            }
            ,
            
            
            /* tpl block render method for block 'Block1' */
            'Block1': function(__i__) {
                
                var __p__ = '';
                 
                __p__ += '' + "\n" + 'Base template Block1' + "\n" + '<br /><br />' + "\n" + '' +  __i__.renderBlock( 'Block11' ); 
                __p__ += '' + "\n" + '<br /><br />' + "\n" + '' +  __i__.renderBlock( 'Block12' ); 
                __p__ += '' + "\n" + '<br /><br />' + "\n" + '';
                return __p__;
                
            }
            
        };
        
        /* tpl-defined blocks render code ends here */
        
        /* template methods */
        
        this.setId = function(id) {
            if ( id ) this.id = id;
            return this;
        };
        
        this.extend = function(tpl) {
            if ( tpl && tpl.substr )
                _extends = Contemplate.tpl( tpl );
            else
                _extends = tpl;
            return this;
        };
        
        /* render a tpl block method */
        this.renderBlock = function(block, __i__) {
            if ( !__i__ ) __i__ = this;
            if ( _blocks && _blocks[block] ) return _blocks[block](__i__);
            else if ( _extends ) return _extends.renderBlock(block, __i__);
            return '';
        };
        
        /* tpl render method */
        this.render = function(data, __i__) {
            if ( !__i__ ) __i__ = this;
            var __p__ = '';
            if ( _extends )
            {
                __p__ = _extends.render(data, __i__);
            }
            else
            {
                /* tpl main render code starts here */
                
                __i__.d = Contemplate.data( data );
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
        
        /* extend tpl assign code starts here */
        
        /* extend tpl assign code ends here */
    };
    
    
    // export it
    return Contemplate_base_Cached;
    };
});
