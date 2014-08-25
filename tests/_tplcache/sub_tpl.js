
!function (root, moduleName, moduleDefinition) {

    //
    // export the module

    // node, CommonJS, etc..
    if ( 'object' === typeof(module) && module.exports ) module.exports = moduleDefinition();

    // AMD, etc..
    else if ( 'function' === typeof(define) && define.amd ) define( moduleDefinition );

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
        var _extends = null, _blocks = null;
        
        this.id = id;
        this.d = null;
        
        
        /* tpl-defined blocks render code starts here */
        
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
                __p__ += '<div>' + "\n" + '    <br />' + "\n" + '    <strong>Number of Items:' + ( Contemplate.count(__i__.d['users'][__i__.d['i']]) ) + '</strong>' + "\n" + '    <br />' + "\n" + '    ';
                var _O18 = __i__.d['users'][__i__.d['i']];
                if (_O18 && Object.keys(_O18).length)
                {
                    var _K19, _V20;
                    for (_K19 in _O18)
                    {
                        if (Contemplate.hasOwn(_O18, _K19))
                        {
                            __i__.d['j'] = _K19; __i__.d['user'] = _V20 = _O18[_K19];
                            
                             
                            __p__ += '' + "\n" + '        <div id=\'' + ( __i__.d['user']["id"] ) + '\' class="';            
                            if ( 0 == (__i__.d['j'] % 2) )
                            {
                                             
                                __p__ += 'even';            
                            }
                            else if ( 1 == (__i__.d['j'] % 2) )
                            {
                                             
                                __p__ += 'odd';            
                            }
                                         
                            __p__ += '">' + "\n" + '            <a href="/' + ( __i__.d['user']["name"] ) + '">' + ( __i__.d['user']['name'] ) + '' + ( __i__.d['user']['text'] ) + ' ' + ( Contemplate.n(__i__.d['i']) + Contemplate.n(__i__.d['j']) ) + '</a>: <strong>' + ( __i__.d['user']["text"] ) + '</strong>' + "\n" + '        </div>' + "\n" + '        ';            
                            if (  Contemplate.haskey(__i__.d['user'], "key1")  )
                            {
                                             
                                __p__ += '' + "\n" + '            <div> User has key &quot;key1&quot; </div>' + "\n" + '        ';            
                            }
                            else if (  Contemplate.haskey(__i__.d['user'], "key", "key1")  )
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
            this.d = null;
            return __p__;
        };
        
        /* extend tpl assign code starts here */
        
        /* extend tpl assign code ends here */
    };
    
    
    // export it
    return Contemplate_sub_Cached;
    };
});
