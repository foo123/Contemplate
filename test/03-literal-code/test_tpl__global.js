
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
    var tplvar;
    
    __p__ += '' + "\n" + '';
    tplvar = ("set in template");
    
    __p__ += '' + "\n" + '' + "\n" + '';
    /* js code start */
    __p__ += String(tplvar + ", accessed in js");
    /* js code end */
    __p__ += '' + "\n" + '' + "\n" + '' + "\n" + '' + "\n" + '';
    /* js code start */
    tplvar = "set in js"; 
    /* js code end */
    __p__ += '' + "\n" + '' + "\n" + '' + (String(tplvar)+String(", accessed in template")) + '' + "\n" + '' + "\n" + '' + "\n" + '';
    var v;
    
    __p__ += '' + "\n" + '';
    var _loc_9 = data.list, _loc_11 = !!_loc_9.forEach,
        _loc_10 = _loc_9 ? (_loc_11 ? _loc_9 : Object.keys(_loc_9)) : null,
        _loc_12, _loc_13, _loc_14 = _loc_10 ? _loc_10.length : 0;
    if (_loc_14)
    {
        for (_loc_12=0; _loc_12<_loc_14; ++_loc_12)
        {
            _loc_13 = _loc_10[_loc_12];
            v = _loc_11 ? _loc_13 : _loc_9[_loc_13];
            
            
            __p__ += '' + "\n" + '';        
            /* js code start */
            var foo = "js";
            var bar = "code";        
            /* js code end */
            __p__ += '' + "\n" + '' + (String("template: ")+String(v)) + '' + "\n" + '';        
            /* js code start */        
            __p__ += String("js: " + String(v));        
            /* js code end */
            __p__ += '' + "\n" + '';
        }
    }
    
    __p__ += '' + "\n" + '' + "\n" + '';
    /* js code start */
    for (var i=0; i<data['list'].length; ++i)
    {
        v = data['list'][i];    
        /* js code end */
        __p__ += '' + (v) + '' + "\n" + '';
    /* js code start */
    }
    /* js code end */
    __p__ += '' + "\n" + '';
    
    /* tpl main render code ends here */
    __ctx&&Contemplate._set_ctx(__ctx);
    return __p__;
};
// export it
return Contemplate_test__global;
};
});
