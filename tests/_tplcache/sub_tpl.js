
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
   "use strict";
   return function( Contemplate ) {
   /* Contemplate cached template 'sub' */
   /* quasi extends main Contemplate class */
   
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
       this.renderBlock = function(block, __i__) {
           if ( !__i__ ) __i__ = this;
           if ( _blocks && _blocks[block] ) return _blocks[block](__i__);
           else if ( _parent ) return _parent.renderBlock(block, __i__);
           return '';
       };
       
       /* tpl render method */
       this.render = function(data, __i__) {
           if ( !__i__ ) __i__ = this;
           var __p__ = '';
           if ( _parent )
           {
               __p__ = _parent.render(data, __i__);
           }
           else
           {
               /* tpl main render code starts here */
                
                __i__.data = Contemplate.data( data );
                __p__ += '<div>' + "\n" + '    <br />' + "\n" + '    <strong>Number of Items:' + ( Contemplate.count(__i__.data['users'][__i__.data['i']]) ) + '</strong>' + "\n" + '    <br />' + "\n" + '    ';
                var _O7 = __i__.data['users'][__i__.data['i']];
                if ( _O7 && Object.keys(_O7).length )
                {
                   var _K8;
                   for ( _K8 in _O7 )
                   {
                       if ( Contemplate.hasOwn(_O7, _K8) )
                       {
                          var _V9 = _O7[_K8];
                          __i__.data['j'] = _K8; __i__.data['user'] = _V9;
                       
                             
                            __p__ += '' + "\n" + '        <div id=\'' + ( __i__.data['user']["id"] ) + '\' class="';            
                            if ( 0 == (__i__.data['j'] % 2) )
                            {
                                             
                                __p__ += 'even';            
                            }
                            else if ( 1 == (__i__.data['j'] % 2) )
                            {
                                             
                                __p__ += 'odd';            
                            }
                                         
                            __p__ += '">' + "\n" + '            <a href="/' + ( __i__.data['user']["name"] ) + '">' + ( __i__.data['user']['name'] ) + '' + ( __i__.data['user']['text'] ) + ' ' + ( Contemplate.n(__i__.data['i']) + Contemplate.n(__i__.data['j']) ) + '</a>: <strong>' + ( __i__.data['user']["text"] ) + '</strong>' + "\n" + '        </div>' + "\n" + '        ';            
                            if (  Contemplate.haskey(__i__.data['user'], "key1")  )
                            {
                                             
                                __p__ += '' + "\n" + '            <div> User has key &quot;key1&quot; </div>' + "\n" + '        ';            
                            }
                            else if (  Contemplate.haskey(__i__.data['user'], "key", "key1")  )
                            {
                                             
                                __p__ += '' + "\n" + '            <div> User has key [&quot;key&quot;][&quot;key1&quot;] </div>' + "\n" + '        ';            
                            }
                                         
                            __p__ += '' + "\n" + '    ';
                       }
                   }
                }
                else
                {  
                     
                    __p__ += '' + "\n" + '        <div class="none">' + ( Contemplate.l("No Users") ) + '</div>' + "\n" + '    ';
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
    };
});
