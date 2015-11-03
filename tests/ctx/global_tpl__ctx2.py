# -*- coding: UTF-8 -*-

# Contemplate cached template 'global'
def __getTplClass__(Contemplate):
    # extends the main Contemplate.Template class
    class Contemplate_global_Cached__ctx2(Contemplate.Template):
        'Contemplate cached template global'
        # constructor
        def __init__(self, id=None):
            self_ = self
            super(Contemplate_global_Cached__ctx2, self_).__init__( id )
            # extend tpl assign code starts here
            
            # extend tpl assign code ends here
        # tpl-defined blocks render code starts here
        
        # tpl-defined blocks render code ends here
        # render a tpl block method
        def renderBlock(self, block, data, __i__=None):
            self_ = self
            __ctx = None
            if not __i__:
                __i__ = self_
                __ctx = Contemplate._set_ctx( self_._ctx )
            r = ''
            method = '_blockfn_' + block
            if (hasattr(self_, method) and callable(getattr(self_, method))):
                r = getattr(self_, method)(data, self_, __i__)
            elif self_._extends:
                r = self_._extends.renderBlock(block, data, __i__)
            if __ctx:  Contemplate._set_ctx( __ctx )
            return r
        # render method
        def render(self, data, __i__=None):
            self_ = self
            __ctx = None
            __p__ = ''
            if not __i__:
                __i__ = self_
                __ctx = Contemplate._set_ctx( self_._ctx )
            if self_._extends:
                __p__ = self_._extends.render(data, __i__)

            else:
                # tpl main render code starts here
                
                __p__ += '' + "\n" + '' + str(Contemplate.locale("global") ) + '' + "\n" + '' + "\n" + '' + str(Contemplate.plg_("my_plugin", Contemplate.locale("ctx") ) ) + '' + "\n" + ''
                
                # tpl main render code ends here

            if __ctx:  Contemplate._set_ctx( __ctx )
            return __p__
    return Contemplate_global_Cached__ctx2
# allow to 'import *'  from this file as a module
__all__ = ['__getTplClass__']
