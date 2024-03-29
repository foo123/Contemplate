# -*- coding: UTF-8 -*-

# Contemplate cached template 'test'
def __getTplClass__(Contemplate):
    # extends the main Contemplate.Template class
    class Contemplate_test__global(Contemplate.Template):
        'Contemplate cached template test'
        # constructor
        def __init__(self, id=None):
            self_ = self
            super(Contemplate_test__global, self).__init__(id)
            # extend tpl assign code starts here
            
            self_._usesTpl = []
            # extend tpl assign code ends here
        # tpl-defined blocks render code starts here

        # tpl-defined blocks render code ends here
        # render a tpl block method
        def block(self, block, data, __i__=None):
            self_ = self
            __ctx = False
            r = ''
            if not __i__:
                __i__ = self_
                if not self._autonomus: __ctx = Contemplate._set_ctx(self._ctx)
            method = '_blockfn_' + block
            if (hasattr(self_, method) and callable(getattr(self_, method))):
                r = getattr(self_, method)(data, self_, __i__)
            elif self_._extends:
                r = self_._extends.block(block, data, __i__)
            if __ctx:  Contemplate._set_ctx(__ctx)
            return r
        # render method
        def render(self, data, __i__=None):
            self_ = self
            __ctx = False
            __p__ = ''
            if not __i__:
                __i__ = self_
                if not self._autonomus: __ctx = Contemplate._set_ctx(self._ctx)
            if self_._extends:
                __p__ = self_._extends.render(data, __i__)

            else:
                # tpl main render code starts here
                
                __p__ += '' + "\n" + ''
                 
                __p__ += '' + "\n" + ''
                tplvar = ("set in template")
                 
                __p__ += '' + "\n" + '' + "\n" + '' + "\n" + ''
                # py code start
                __p__ += str(tplvar + ", accessed in py")
                # py code end
                __p__ += '' + "\n" + '' + "\n" + '' + "\n" + '' + "\n" + '' 
                # py code start
                tplvar = "set in py" 
                # py code end
                __p__ += '' + "\n" + '' + str(str(tplvar)+str(", accessed in template")) + '' + "\n" + '' + "\n" + '' + "\n" + ''
                 
                __p__ += '' + "\n" + ''
                _loc_9 = data['list']
                _loc_10 = (_loc_9 if isinstance(_loc_9,(list,tuple)) else _loc_9.values()) if _loc_9 else None
                if (_loc_10):
                    for v in _loc_10:
                         
                        __p__ += '' + "\n" + ''         
                        # py code start
                        foo = "py"
                        bar = "code"        
                        # py code end
                        __p__ += '' + "\n" + '' + str(str("template: ")+str(v)) + '' + "\n" + ''        
                        # py code start        
                        __p__ += str("py: " + str(v))        
                        # py code end
                        __p__ += '' + "\n" + ''
                 
                __p__ += '' + "\n" + '' + "\n" + '' 
                # py code start
                for v in data['list']:
                    #tabbed comment    
                    # py code end
                    __p__ += '' + str(v) + '' + "\n" + '' 
                # py code start
                # py code end
                __p__ += '' + "\n" + ''
                
                # tpl main render code ends here

            if __ctx:  Contemplate._set_ctx(__ctx)
            return __p__
    return Contemplate_test__global
# allow to 'import *'  from this file as a module
__all__ = ['__getTplClass__']
