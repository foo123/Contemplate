!function (root, moduleName, moduleDefinition) {

    //
    // export the module

    // node, CommonJS, etc..
    if ( 'object' == typeof(module) && module.exports ) module.exports = moduleDefinition();

    // AMD, etc..
    else if ( 'function' == typeof(define) && define.amd ) define( moduleDefinition );

    // browser, etc..
    else root[ moduleName ] = moduleDefinition();


}(this, 'Contemplate_sub_Cached', function( ) {
   /* Contemplate cached template 'sub' */
   /* quasi extends main Contemplate class */
   
   /* This is NOT used, Contemplate is accessible globally */
   /* var self = require('Contemplate'); */
   
   /* constructor */
   function Contemplate_sub_Cached(id)
   {
       /* initialize internal vars */
       var _parent = null, _blocks = null;
       
       this.id = id;
       this.data = null;
       
       
       /* tpl-defined blocks render code starts here */
        
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
                __p__ += '<div>' + "\n" + '    <br />' + "\n" + '    <strong>Number of Items:' + ( Contemplate.count(__instance__.data['users'][__instance__.data['i']]) ) + '</strong>' + "\n" + '    <br />' + "\n" + '    ';
                if ( __instance__.data['users'][__instance__.data['i']] && Object.keys(__instance__.data['users'][__instance__.data['i']]).length )
                {
                   var j;
                   for ( j in __instance__.data['users'][__instance__.data['i']] )
                   {
                       if ( Contemplate.hasOwn(__instance__.data['users'][__instance__.data['i']], j) )
                       {
                          var user = __instance__.data['users'][__instance__.data['i']][j];
                          __instance__.data['j'] = j; __instance__.data['user'] = user;
                       
                             
                            __p__ += '' + "\n" + '        <div id=\'' + ( __instance__.data['user']["id"] ) + '\' class="';            
                            if ( 0 == (__instance__.data['j'] % 2) )
                            {
                            
                                             
                                __p__ += 'even';            
                            }
                            else if ( 1 == (__instance__.data['j'] % 2) )
                            {
                            
                                             
                                __p__ += 'odd';            
                            }
                            
                                         
                            __p__ += '">' + "\n" + '            <a href="/' + ( __instance__.data['user']["name"] ) + '">' + ( __instance__.data['user']["name"] ) + ( __instance__.data['user']["text"] ) + ' ' + ( Contemplate.n(__instance__.data['i']) + Contemplate.n(__instance__.data['j']) ) + '</a>: <strong>' + ( __instance__.data['user']["text"] ) + '</strong>' + "\n" + '        </div>' + "\n" + '        ';            
                            if (  Contemplate.has_key(__instance__.data['user'], "key1")  )
                            {
                            
                                             
                                __p__ += '' + "\n" + '            <div> User has key &quot;key1&quot; </div>' + "\n" + '        ';            
                            }
                            else if (  Contemplate.has_key(__instance__.data['user'], "key", "key1")  )
                            {
                            
                                             
                                __p__ += '' + "\n" + '            <div> User has key [&quot;key&quot;][&quot;key1&quot;] </div>' + "\n" + '        ';            
                            }
                            
                                         
                            __p__ += '' + "\n" + '    ';
                       }
                   }
                }
                else
                {  
                    
                     
                    __p__ += '' + "\n" + '        <div class="none">No Users</div>' + "\n" + '    ';
                }
                
                 
                __p__ += '' + "\n" + '</div>' + "\n" + '';
                
               /* tpl main render code ends here */
           }
           this.data = null;
           return __p__;
       };
       
       /* parent tpl assign code starts here */
        
       /* parent tpl assign code ends here */
   };
   
   
    // export it
    return Contemplate_sub_Cached;
});
