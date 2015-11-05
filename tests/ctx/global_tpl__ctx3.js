
!function (root, moduleName, moduleDefinition) {
var m;
// node, CommonJS, etc..
if ( 'object' === typeof(module) && module.exports ) module.exports = moduleDefinition();
// browser and AMD, etc..
else (root[ moduleName ] = m = moduleDefinition()) && ('function' === typeof(define) && define.amd && define(moduleName,[],function(){return m;}));
}(this, 'Contemplate_global__ctx3', function( ){
"use strict";
return function( Contemplate ) {
/* Contemplate cached template 'global', constructor */
function Contemplate_global__ctx3( id )
{
    var self = this;
    Contemplate.Template.call( self, id );
    /* tpl-defined blocks render code starts here */
    
    /* tpl-defined blocks render code ends here */
    /* extend tpl assign code starts here */
    
    /* extend tpl assign code ends here */
}
/* extends main Contemplate.Template class */
Contemplate_global__ctx3.prototype = Object.create(Contemplate.Template.prototype);
/* render method */
Contemplate_global__ctx3.prototype.render = function( data, __i__ ) {
    "use strict";
    var self = this, __p__ = '', __ctx = false;
    !__i__&&(__i__=self)&&(self._autonomus||(__ctx=Contemplate._set_ctx( self._ctx )));
    /* tpl main render code starts here */
    
    __p__ += '' + "\n" + '' + (Contemplate.locale("global")) + '' + "\n" + '' + "\n" + '' + (Contemplate.plg_("my_plugin", Contemplate.locale("ctx") )) + '' + "\n" + '';
    
    /* tpl main render code ends here */
    __ctx&&Contemplate._set_ctx( __ctx );
    return __p__;
};
// export it
return Contemplate_global__ctx3;
};
});
