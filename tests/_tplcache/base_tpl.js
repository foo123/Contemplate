!function (root, moduleName, moduleDefinition) {

    //
    // export the module

    // node, CommonJS, etc..
    if ( 'object' == typeof(module) && module.exports ) module.exports = moduleDefinition();

    // AMD, etc..
    else if ( 'function' == typeof(define) && define.amd ) define( moduleDefinition );

    // browser, etc..
    else root[ moduleName ] = moduleDefinition();


}(this, 'Contemplate_base_Cached', function( ) {
   /* Contemplate cached template 'base' */
   /* quasi extends main Contemplate class */
   
   /* This is NOT used, Contemplate is accessible globally */
   /* var self = require('Contemplate'); */
   
   /* constructor */
   function Contemplate_base_Cached(id)
   {
       /* initialize internal vars */
       var _parent = null, _blocks = null;
       
       this.id = id;
       this.data = null;
       
       
       /* tpl-defined blocks render code starts here */
        
        _blocks = { 
            
            
            /* tpl block render method for block 'Block3' */
            'Block3': function(__instance__) {
                
                var __p__ = '';
                 
                __p__ += 'Base template Block3';
                return __p__;
                
            }
            ,
            
            
            /* tpl block render method for block 'Block2' */
            'Block2': function(__instance__) {
                
                var __p__ = '';
                 
                __p__ += 'Base template Block2';
                return __p__;
                
            }
            ,
            
            
            /* tpl block render method for block 'Block1' */
            'Block1': function(__instance__) {
                
                var __p__ = '';
                 
                __p__ += 'Base template Block1';
                return __p__;
                
            }
            
        };
        
       /* tpl-defined blocks render code ends here */
       
       /* template methods */
       
       this.setId = function(id) {
           if ( id ) this.id = id;
           return this;
       };
       
       this.setParent = function(parent) {
           if ( parent )
           {
               if ( parent.substr )
                   _parent = Contemplate.tpl( parent );
               else
                   _parent = parent;
           }
           return this;
       };
       
       /* render a tpl block method */
       this.renderBlock = function(block, __instance__) {
           if ( !__instance__ ) __instance__ = this;
           if ( _blocks && _blocks[block] ) return _blocks[block](__instance__);
           else if ( _parent ) return _parent.renderBlock(block, __instance__);
           return '';
       };
       
       /* tpl render method */
       this.render = function(data, __instance__) {
           if ( !__instance__ ) __instance__ = this;
           var __p__ = '';
           if ( _parent )
           {
               __p__ = _parent.render(data, __instance__);
           }
           else
           {
               /* tpl main render code starts here */
                
                __instance__.data = Contemplate.data( data );
                __p__ += '<!-- this is the base template -->' + "\n" + "\n" + '<strong>This is the base template</strong>' + "\n" + '' + "\n" + '' + "\n" + '<br /><br /><br /><br />' + "\n" + '<strong>This is Block1</strong><br />' + "\n" + '' +  __instance__.renderBlock( 'Block1' );  
                __p__ += '' + "\n" + '' + "\n" + '<br /><br /><br /><br />' + "\n" + '<strong>This is Block2</strong><br />' + "\n" + '' +  __instance__.renderBlock( 'Block2' );  
                __p__ += '' + "\n" + '' + "\n" + '<br /><br /><br /><br />' + "\n" + '<strong>This is Block3</strong><br />' + "\n" + '' +  __instance__.renderBlock( 'Block3' );  
                __p__ += '' + "\n" + '' + "\n" + '' + "\n" + '<br /><br /><br /><br />' + "\n" + '<strong>This is Block2 Again</strong><br />' + "\n" + '' +  __instance__.renderBlock( 'Block2' );  
                __p__ += '' + "\n" + '';
                
               /* tpl main render code ends here */
           }
           this.data = null;
           return __p__;
       };
       
       /* parent tpl assign code starts here */
        
       /* parent tpl assign code ends here */
   };
   
   
    // export it
    return Contemplate_base_Cached;
});
