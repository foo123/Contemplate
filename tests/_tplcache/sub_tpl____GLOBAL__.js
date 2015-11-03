
!function (root, moduleName, moduleDefinition) {
var m;
// node, CommonJS, etc..
if ( 'object' === typeof(module) && module.exports ) module.exports = moduleDefinition();
// browser and AMD, etc..
else (root[ moduleName ] = m = moduleDefinition()) && ('function' === typeof(define) && define.amd && define(moduleName,[],function(){return m;}));
}(this, 'Contemplate_sub_Cached____GLOBAL__', function( ){
"use strict";
return function( Contemplate ) {
/* Contemplate cached template 'sub', constructor */
function Contemplate_sub_Cached____GLOBAL__( id )
{
    var self = this;
    Contemplate.Template.call( self, id );
    /* tpl-defined blocks render code starts here */
    
    /* tpl-defined blocks render code ends here */
    /* extend tpl assign code starts here */
    
    /* extend tpl assign code ends here */
}
/* extends main Contemplate.Template class */
Contemplate_sub_Cached____GLOBAL__.prototype = Object.create(Contemplate.Template.prototype);
/* render method */
Contemplate_sub_Cached____GLOBAL__.prototype.render = function( data, __i__ ) {
    "use strict";
    var self = this, __p__ = '', __ctx = null;
    if ( !__i__ )
    {
        __i__ = self;
        __ctx = Contemplate._set_ctx( self._ctx );
    }
    /* tpl main render code starts here */
    
    __p__ += '<div>' + "\n" + '    <br />' + "\n" + '    <strong>Number of Items:' + (Contemplate.count(data.users[data.i])) + '</strong>' + "\n" + '    <br />' + "\n" + '    ';
    var _loc_7 = data.users[data.i], _loc_8 = _loc_7 ? Object.keys(_loc_7) : null,
        _loc_9, _loc_j, _loc_user, _loc_10 = _loc_8 ? _loc_8.length : 0;
    if (_loc_10)
    {
        for (_loc_9=0; _loc_9<_loc_10; _loc_9++)
        {
            _loc_j = _loc_8[_loc_9]; _loc_user = _loc_7[_loc_j];
            
            
            __p__ += '' + "\n" + '        <div id=\'' + ( _loc_user["id"]) + '\' class="';        
            if (0 == (_loc_j % 2))
            {
                        
                __p__ += 'even';        
            }
            else if (1 == (_loc_j % 2))
            {
                        
                __p__ += 'odd';        
            }
                    
            __p__ += '">' + "\n" + '            <a href="/' + ( _loc_user["name"]) + '">' + ( _loc_user.name) + '' + ( _loc_user.text) + ' ' + (parseInt(data.i) + parseInt(_loc_j)) + '</a>: <strong>' + ( _loc_user["text"]) + '</strong>' + "\n" + '        </div>' + "\n" + '        ';        
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
        
        __p__ += '' + "\n" + '        <div class="none">' + (Contemplate.locale("No Users")) + '</div>' + "\n" + '    ';
    }
    
    __p__ += '' + "\n" + '</div>' + "\n" + '';
    
    /* tpl main render code ends here */
    if ( __ctx )  Contemplate._set_ctx( __ctx );
    return __p__;
};
// export it
return Contemplate_sub_Cached____GLOBAL__;
};
});
