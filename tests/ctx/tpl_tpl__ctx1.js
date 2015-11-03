
!function (root, moduleName, moduleDefinition) {
var m;
// node, CommonJS, etc..
if ( 'object' === typeof(module) && module.exports ) module.exports = moduleDefinition();
// browser and AMD, etc..
else (root[ moduleName ] = m = moduleDefinition()) && ('function' === typeof(define) && define.amd && define(moduleName,[],function(){return m;}));
}(this, 'Contemplate_tpl_Cached__ctx1', function( ){
"use strict";
return function( Contemplate ) {
/* Contemplate cached template 'tpl', constructor */
function Contemplate_tpl_Cached__ctx1( id )
{
    var self = this;
    Contemplate.Template.call( self, id );
    /* tpl-defined blocks render code starts here */
    
    /* tpl-defined blocks render code ends here */
    /* extend tpl assign code starts here */
    self.extend('global');
    /* extend tpl assign code ends here */
}
/* extends main Contemplate.Template class */
Contemplate_tpl_Cached__ctx1.prototype = Object.create(Contemplate.Template.prototype);
/* render method */
Contemplate_tpl_Cached__ctx1.prototype.render = function( data, __i__ ) {
    "use strict";
    var self = this, __p__ = '', __ctx = null;
    if ( !__i__ )
    {
        __i__ = self;
        __ctx = Contemplate._set_ctx( self._ctx );
    }
    /* tpl main render code starts here */
    
    __p__ = '';
    
    /* tpl main render code ends here */
    if ( __ctx )  Contemplate._set_ctx( __ctx );
    return __p__;
};
// export it
return Contemplate_tpl_Cached__ctx1;
};
});
