
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
            __p__ += '<div>' + "\n" + '    <br />' + "\n" + '    <strong>Number of Items:' + (Contemplate.count(data['users'][data['i']])) + '</strong>' + "\n" + '    <br />' + "\n" + '    ';
            var _loc_7 = data['users'][data['i']], _loc_8 = Contemplate.keys(_loc_7),
                _loc_9, _loc_j, _loc_user, _loc_10 = _loc_8 ? _loc_8.length : 0;
            if (_loc_10)
            {
                for (_loc_9=0; _loc_9<_loc_10; _loc_9++)
                {
                    _loc_j = _loc_8[_loc_9]; _loc_user = _loc_7[_loc_j];
                    
                     
                    __p__ += '' + "\n" + '        <div id=\'' + (_loc_user["id"]) + '\' class="';        
                    if (0 == (_loc_j % 2))
                    {
                                 
                        __p__ += 'even';        
                    }
                    else if (1 == (_loc_j % 2))
                    {
                                 
                        __p__ += 'odd';        
                    }
                             
                    __p__ += '">' + "\n" + '            <a href="/' + (_loc_user["name"]) + '">' + (_loc_user['name']) + '' + (_loc_user['text']) + ' ' + (Contemplate.n(data['i']) + Contemplate.n(_loc_j)) + '</a>: <strong>' + (_loc_user["text"]) + '</strong>' + "\n" + '        </div>' + "\n" + '        ';        
                    if ( Contemplate.haskey(_loc_user, "key1") )
                    {
                                 
                        __p__ += '' + "\n" + '            <div> User has key &quot;key1&quot; </div>' + "\n" + '        ';        
                    }
                    else if ( Contemplate.haskey(_loc_user, "key", "key1") )
                    {
                                 
                        __p__ += '' + "\n" + '            <div> User has key [&quot;key&quot;][&quot;key1&quot;] </div>' + "\n" + '        ';        
                    }
                             
                    __p__ += '' + "\n" + '    ';
                }
            }
            else
            {  
                 
                __p__ += '' + "\n" + '        <div class="none">' + (Contemplate.l("No Users")) + '</div>' + "\n" + '    ';
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
