
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
    
    
    /* constructor */
    function Contemplate_sub_Cached(id)
    {
        /* initialize internal vars */
        
        this._renderer = id;
        this._blocks = null;
        this._extends = null;
        this.d = null;
        this.id = id;
        
        
        /* tpl-defined blocks render code starts here */
        
        /* tpl-defined blocks render code ends here */
        
        
        /* extend tpl assign code starts here */
        
        /* extend tpl assign code ends here */
    };
    
    
    /* extends main Contemplate.Template class */
    Contemplate_sub_Cached.prototype = Object.create(Contemplate.Template.prototype);
    /* tpl render method */
    Contemplate_sub_Cached.prototype.render = function( data, __i__ ) {
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
            __p__ += '<div>' + "\n" + '    <br />' + "\n" + '    <strong>Number of Items:' + ( Contemplate.count(data['users'][data['i']]) ) + '</strong>' + "\n" + '    <br />' + "\n" + '    ';
            var _O42 = data['users'][data['i']], _OK43 = Contemplate.keys(_O42);
            if (_OK43 && _OK43.length)
            {
                var _K44, _V46, _L45 = _OK43.length;
                for (_K44=0; _K44<_L45; _K44++)
                {
                    data['j'] = _OK43[_K44]; data['user'] = _V46 = _O42[_OK43[_K44]];
                    
                     
                    __p__ += '' + "\n" + '        <div id=\'' + ( data['user']["id"] ) + '\' class="';        
                    if (0 == (data['j'] % 2))
                    {
                                 
                        __p__ += 'even';        
                    }
                    else if (1 == (data['j'] % 2))
                    {
                                 
                        __p__ += 'odd';        
                    }
                             
                    __p__ += '">' + "\n" + '            <a href="/' + ( data['user']["name"] ) + '">' + ( data['user']['name'] ) + '' + ( data['user']['text'] ) + ' ' + ( Contemplate.n(data['i']) + Contemplate.n(data['j']) ) + '</a>: <strong>' + ( data['user']["text"] ) + '</strong>' + "\n" + '        </div>' + "\n" + '        ';        
                    if ( Contemplate.haskey(data['user'], "key1") )
                    {
                                 
                        __p__ += '' + "\n" + '            <div> User has key &quot;key1&quot; </div>' + "\n" + '        ';        
                    }
                    else if ( Contemplate.haskey(data['user'], "key", "key1") )
                    {
                                 
                        __p__ += '' + "\n" + '            <div> User has key [&quot;key&quot;][&quot;key1&quot;] </div>' + "\n" + '        ';        
                    }
                             
                    __p__ += '' + "\n" + '    ';
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
    
    // export it
    return Contemplate_sub_Cached;
    };
});
