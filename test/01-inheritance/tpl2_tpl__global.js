
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
}('undefined' !== typeof self ? self : this,'Contemplate_tpl2__global',function() {
"use strict";
return function(Contemplate) {
/* Contemplate cached template 'tpl2', constructor */
function Contemplate_tpl2__global(id)
{
    var self = this;
    Contemplate.Template.call(self, id);
    /* tpl-defined blocks render code starts here */
    
    self._blocks = {
    
    
    /* tpl block render method for block '3' */
    '3': function(Contemplate, data, self, __i__) {
        "use strict";
        var __p__ = '';
        
        __p__ += '(2 3)' + "\n" + '        ' + (self.sprblock("3", data)) + '' + "\n" + '        ';
        return __p__;
        
    }
    ,
    
    
    /* tpl block render method for block '2' */
    '2': function(Contemplate, data, self, __i__) {
        "use strict";
        var __p__ = '';
        
        __p__ += '(2 2)' + "\n" + '        ' +  __i__.block('3', data);__p__ += '' + "\n" + '    ' + (self.sprblock("2", data)) + '' + "\n" + '    ';
        return __p__;
        
    }
    ,
    
    
    /* tpl block render method for block '1' */
    '1': function(Contemplate, data, self, __i__) {
        "use strict";
        var __p__ = '';
        
        __p__ += '(2 1)' + "\n" + '    ' +  __i__.block('2', data);__p__ += '' + "\n" + '' + (self.sprblock("1", data)) + '' + "\n" + '';
        return __p__;
        
    }
    
    };
    
    /* tpl-defined blocks render code ends here */
    /* extend tpl assign code starts here */
    self._extendsTpl = 'tpl1';
    self._usesTpl = [];
    /* extend tpl assign code ends here */
}
/* extends main Contemplate.Template class */
Contemplate_tpl2__global.prototype = Object.create(Contemplate.Template.prototype);
/* render method */
Contemplate_tpl2__global.prototype.render = function(data, __i__) {
    "use strict";
    var self = this, __p__ = '', __ctx = false;
    !__i__&&(__i__=self)&&(self._autonomus||(__ctx=Contemplate._set_ctx(self._ctx)));
    /* tpl main render code starts here */
    
    __p__ = '';
    
    /* tpl main render code ends here */
    __ctx&&Contemplate._set_ctx(__ctx);
    return __p__;
};
// export it
return Contemplate_tpl2__global;
};
});
