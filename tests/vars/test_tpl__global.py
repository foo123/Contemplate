# -*- coding: UTF-8 -*-

# Contemplate cached template 'test'
def __getTplClass__(Contemplate):
    # extends the main Contemplate.Template class
    class Contemplate_test__global(Contemplate.Template):
        'Contemplate cached template test'
        # constructor
        def __init__(self, id=None):
            self_ = self
            super(Contemplate_test__global, self_).__init__( id )
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
                
                __p__ += '' + "\n" + '' + str(data['v'].prop) + '' + "\n" + '' + "\n" + '' + str(data['v'].func(Contemplate.url(data['v'].prop))) + '' + "\n" + '' + "\n" + '' + str(data['a'][0]) + '' + "\n" + '' + "\n" + '' + str(data['a'][1]['prop']) + '' + "\n" + '' + "\n" + '' + str(Contemplate.get(data['a'], [0+1, "prop"])) + '' + "\n" + '' + "\n" + '' + str(Contemplate.get(data['a'], [int("0")+1,"prop"])) + '' + "\n" + '' + "\n" + '' + str(Contemplate.get(data['v'], "prop")) + '' + "\n" + ''
                
                # tpl main render code ends here

            if __ctx:  Contemplate._set_ctx( __ctx )
            return __p__
    return Contemplate_test__global
# allow to 'import *'  from this file as a module
__all__ = ['__getTplClass__']
