
!function(root, name, factory) {
"use strict";
if (('undefined'!==typeof Components)&&('object'===typeof Components.classes)&&('object'===typeof Components.classesByID)&&Components.utils&&('function'===typeof Components.utils['import'])) /* XPCOM */
    (root.$deps = root.$deps||{}) && (root.EXPORTED_SYMBOLS = [name]) && (root[name] = root.$deps[name] = factory.call(root));
else if (('object'===typeof module)&&module.exports) /* CommonJS */
    (module.$deps = module.$deps||{}) && (module.exports = module.$deps[name] = factory.call(root));
else if (('function'===typeof define)&&define.amd&&('function'===typeof require)&&('function'===typeof require.specified)&&require.specified(name) /*&& !require.defined(name)*/) /* AMD */
    define(name,['module'],function(module){factory.moduleUri = module.uri; return factory.call(root);});
else if (!(name in root)) /* Browser/WebWorker/.. */
    (root[name] = factory.call(root)||1)&&('function'===typeof(define))&&define.amd&&define(function(){return root[name];} );
}('undefined' !== typeof self ? self : this,'Contemplate_test__global',function() {
"use strict";
return function(Contemplate) {
/* Contemplate cached template 'test', constructor */
function Contemplate_test__global(id)
{
    var self = this;
    Contemplate.Template.call(self, id);
    /* tpl-defined blocks render code starts here */

    /* tpl-defined blocks render code ends here */
    /* extend tpl assign code starts here */
    
    self._usesTpl = [];
    /* extend tpl assign code ends here */
}
/* extends main Contemplate.Template class */
Contemplate_test__global.prototype = Object.create(Contemplate.Template.prototype);
/* render method */
Contemplate_test__global.prototype.render = function(data, __i__) {
    "use strict";
    var self = this, __p__ = '', __ctx = false;
    !__i__&&(__i__=self)&&(self._autonomus||(__ctx=Contemplate._set_ctx(self._ctx)));
    /* tpl main render code starts here */
    
    __p__ += '' + "\n" + '';
    var _loc_3 = data.list, _loc_5 = !!_loc_3.forEach,
        _loc_4 = _loc_3 ? (_loc_5 ? _loc_3 : Object.keys(_loc_3)) : null,
        _loc_6, _loc_7, _loc_v, _loc_8 = _loc_4 ? _loc_4.length : 0;
    if (_loc_8)
    {
        for (_loc_6=0; _loc_6<_loc_8; ++_loc_6)
        {
            _loc_7 = _loc_4[_loc_6];
            _loc_v = _loc_5 ? _loc_7 : _loc_3[_loc_7];
            
            
            __p__ += '' + "\n" + '';        
            /* js code start */
            var foo = "js";
            var bar = "code";        
            /* js code end */
            __p__ += '' + "\n" + '' + (_loc_v) + '' + "\n" + '';        
            /* js code start */        
            __p__ += String("js");        
            /* js code end */
            __p__ += '' + "\n" + '';
        }
    }
    
    __p__ += '' + "\n" + '' + "\n" + '';
    /* js code start */
    for (var i=0; i<data['list'].length; ++i)
    {
        var v = data['list'][i];    
        /* js code end */
        __p__ += '';    
        /* js code start */    
        __p__ += String(v);    
        /* js code end */
        __p__ += '' + "\n" + '';
    /* js code start */
    }
    /* js code end */
    __p__ += '' + "\n" + '' + "\n" + '';
    
    /* tpl main render code ends here */
    __ctx&&Contemplate._set_ctx(__ctx);
    return __p__;
};
// export it
return Contemplate_test__global;
};
});
