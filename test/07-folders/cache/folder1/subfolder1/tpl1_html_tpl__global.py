# -*- coding: UTF-8 -*-

# Contemplate cached template 'folder1/subfolder1/tpl1.html'
def __getTplClass__(Contemplate):
    # extends the main Contemplate.Template class
    class Contemplate_tpl1_html__global(Contemplate.Template):
        'Contemplate cached template folder1/subfolder1/tpl1.html'
        # constructor
        def __init__(self, id=None):
            self_ = self
            super(Contemplate_tpl1_html__global, self_).__init__( id )
            # extend tpl assign code starts here

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
                if not self._autonomus: __ctx = Contemplate._set_ctx( self._ctx )
            method = '_blockfn_' + block
            if (hasattr(self_, method) and callable(getattr(self_, method))):
                r = getattr(self_, method)(data, self_, __i__)
            elif self_._extends:
                r = self_._extends.block(block, data, __i__)
            if __ctx:  Contemplate._set_ctx( __ctx )
            return r
        # render method
        def render(self, data, __i__=None):
            self_ = self
            __ctx = False
            __p__ = ''
            if not __i__:
                __i__ = self_
                if not self._autonomus: __ctx = Contemplate._set_ctx( self._ctx )
            if self_._extends:
                __p__ = self_._extends.render(data, __i__)

            else:
                # tpl main render code starts here
                
                __p__ += '' + "\n" + 'Template in subfolder1 of folder1' + "\n" + ''
                
                # tpl main render code ends here

            if __ctx:  Contemplate._set_ctx( __ctx )
            return __p__
    return Contemplate_tpl1_html__global
# allow to 'import *'  from this file as a module
__all__ = ['__getTplClass__']
