
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
    
    __p__ += '';
    var t;
    
    __p__ += '' + "\n" + '';
    t = ({"v":0});
    
    __p__ += '' + "\n" + '' + "\n" + '' + (data.v.prop) + '' + "\n" + '' + "\n" + '' + (data.v.func(Contemplate.urlencode(data.v.prop))) + '' + "\n" + '' + "\n" + '' + (data.a[0]) + '' + "\n" + '' + "\n" + '' + (data.a[1].prop) + '' + "\n" + '' + "\n" + '' + (data.v.method(Contemplate.urlencode(data.v.prop)).func("foo")) + '' + "\n" + '' + "\n" + '' + (Contemplate.urlencode(data.v.method("foo").func("bar"))) + '' + "\n" + '' + "\n" + '' + (Contemplate.urlencode(data.v.method("foo").prop)) + '' + "\n" + '' + "\n" + '' + (Contemplate.urlencode(data.v.method("foo").prop2.prop)) + '' + "\n" + '' + "\n" + '' + (Contemplate.get(data.a, [0+1, "prop"])) + '' + "\n" + '' + "\n" + '' + (Contemplate.get(data.a, [parseInt("0")+1,"prop"])) + '' + "\n" + '' + "\n" + '' + (Contemplate.get(data.v, "propGetter")) + '' + "\n" + '' + "\n" + '' + (data.a[0+1]["prop"]) + '' + "\n" + '' + "\n" + '' + (data.a[parseInt("0")+1]["prop"]) + '' + "\n" + '' + "\n" + '' + (data.a[t.v+1]["prop"]) + '' + "\n" + '' + "\n" + '' + (data.a[parseInt(t.v)+1]["prop"]) + '' + "\n" + '' + "\n" + '';
    t = ([[1,2,3]]);
    
    __p__ += '' + "\n" + '';
    var _loc_i;
    var _loc_v;
    var _loc_41 = t[0], _loc_42 = _loc_41 ? Object.keys(_loc_41) : null,
        _loc_43, _loc_44 = _loc_41 ? _loc_42.length : 0;
    if (_loc_44)
    {
        for (_loc_43=0; _loc_43<_loc_44; ++_loc_43)
        {
            _loc_i = _loc_42[_loc_43]; _loc_v = _loc_41[_loc_i];
            
            
            __p__ += '' + "\n" + '    ' + (_loc_i) + ',' + (_loc_v) + '' + "\n" + '';
        }
    }
    
    __p__ += '';
    
    /* tpl main render code ends here */
    __ctx&&Contemplate._set_ctx(__ctx);
    return __p__;
};
// export it
return Contemplate_test__global;
};
});
