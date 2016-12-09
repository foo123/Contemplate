
!function( root, name, factory ){
"use strict";
if ( ('undefined'!==typeof Components)&&('object'===typeof Components.classes)&&('object'===typeof Components.classesByID)&&Components.utils&&('function'===typeof Components.utils['import']) ) /* XPCOM */
    (root.$deps = root.$deps||{}) && (root.EXPORTED_SYMBOLS = [name]) && (root[name] = root.$deps[name] = factory.call(root));
else if ( ('object'===typeof module)&&module.exports ) /* CommonJS */
    (module.$deps = module.$deps||{}) && (module.exports = module.$deps[name] = factory.call(root));
else if ( ('undefined'!==typeof System)&&('function'===typeof System.register)&&('function'===typeof System['import']) ) /* ES6 module */
    System.register(name,[],function($__export){$__export(name, factory.call(root));});
else if ( ('function'===typeof define)&&define.amd&&('function'===typeof require)&&('function'===typeof require.specified)&&require.specified(name) /*&& !require.defined(name)*/ ) /* AMD */
    define(name,['module'],function(module){factory.moduleUri = module.uri; return factory.call(root);});
else if ( !(name in root) ) /* Browser/WebWorker/.. */
    (root[name] = factory.call(root)||1)&&('function'===typeof(define))&&define.amd&&define(function(){return root[name];} );
}(this,'Contemplate_sub__global',function( ){
"use strict";
return function( Contemplate ) {
/* Contemplate cached template 'sub', constructor */
function Contemplate_sub__global( id )
{
    var self = this;
    Contemplate.Template.call( self, id );
    /* tpl-defined blocks render code starts here */

    /* tpl-defined blocks render code ends here */
    /* extend tpl assign code starts here */

    /* extend tpl assign code ends here */
}
/* extends main Contemplate.Template class */
Contemplate_sub__global.prototype = Object.create(Contemplate.Template.prototype);
/* render method */
Contemplate_sub__global.prototype.render = function( data, __i__ ) {
    "use strict";
    var self = this, __p__ = '', __ctx = false;
    !__i__&&(__i__=self)&&(self._autonomus||(__ctx=Contemplate._set_ctx( self._ctx )));
    /* tpl main render code starts here */
    
    __p__ += '<div>' + "\n" + '    <br />' + "\n" + '    <strong>Number of Items:' + (Contemplate.count(data.users[data.i])) + '</strong>' + "\n" + '    <br />' + "\n" + '    ';
    var _loc_7 = data.users[data.i], _loc_8 = _loc_7 ? Object.keys(_loc_7) : null,
        _loc_9, _loc_j, _loc_user, _loc_10 = _loc_7 ? _loc_8.length : 0;
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
                    
            __p__ += '">' + "\n" + '            <a href="/' + (_loc_user["name"]) + '">' + (_loc_user.name) + '' + (_loc_user.text) + ' ' + (parseInt(data.i) + parseInt(_loc_j)) + '</a>: <strong>' + (_loc_user["text"]) + '</strong>' + "\n" + '        </div>' + "\n" + '        ';        
            if (Contemplate.haskey(_loc_user, "key1"))
            {
                        
                __p__ += '' + "\n" + '            <div> User has key &quot;key1&quot; </div>' + "\n" + '        ';        
            }
            else if (Contemplate.haskey(_loc_user, "key", "key1"))
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
    __ctx&&Contemplate._set_ctx( __ctx );
    return __p__;
};
// export it
return Contemplate_sub__global;
};
});
