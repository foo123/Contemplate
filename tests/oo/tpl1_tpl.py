# -*- coding: UTF-8 -*-
# Contemplate cached template 'tpl1'

# imports start here, if any

# imports end here
def __getTplClass__(Contemplate):
    # extends the main Contemplate.Template class
    class Contemplate_tpl1_Cached(Contemplate.Template):
        'Contemplate cached template tpl1'

        # constructor
        def __init__(self, id=None):
            # initialize internal vars
            self_ = self
            self_._renderer = None
            self_._extends = None
            self_._blocks = None
            self_.id = None
            self_.id = id
            
            # extend tpl assign code starts here
            
            # extend tpl assign code ends here

        # tpl-defined blocks render code starts here
        
        
        # tpl block render method for block '3'
        def _blockfn_3(self, data, self_, __i__):
            
            __p__ = ''
             
            __p__ += '(1 3)'
            return __p__
            
        
        
        # tpl block render method for block '2'
        def _blockfn_2(self, data, self_, __i__):
            
            __p__ = ''
             
            __p__ += '(1 2)' + "\n" + '        ' +  __i__.renderBlock('3', data) 
            __p__ += '' + "\n" + '    '
            return __p__
            
        
        
        # tpl block render method for block '1'
        def _blockfn_1(self, data, self_, __i__):
            
            __p__ = ''
             
            __p__ += '(1 1)' + "\n" + '    ' +  __i__.renderBlock('2', data) 
            __p__ += '' + "\n" + ''
            return __p__
            
        
        # tpl-defined blocks render code ends here

        # render a tpl block method
        def renderBlock(self, block, data, __i__=None):
            self_ = self
            if not __i__: __i__ = self_
            method = '_blockfn_' + block
            if (hasattr(self_, method) and callable(getattr(self_, method))):
                return getattr(self_, method)(data, self_, __i__)
            elif self_._extends:
                return self_._extends.renderBlock(block, data, __i__)
            return ''
            
        # tpl render method
        def render(self, data, __i__=None):
            self_ = self
            if  not __i__: __i__ = self_
            __p__ = ''
            if self_._extends:
                __p__ = self_._extends.render(data, __i__)

            else:
                # tpl main render code starts here
                
                __p__ += '' +  __i__.renderBlock('1', data) 
                __p__ += ''
                
                # tpl main render code ends here

            return __p__
    
    return Contemplate_tpl1_Cached

# allow to 'import *'  from this file as a module
__all__ = ['__getTplClass__']
