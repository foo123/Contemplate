# -*- coding: UTF-8 -*-
# Contemplate cached template 'base'



# imports start here, if any

# imports end here

def __getTplClass__(Contemplate):

    # extends the main Contemplate class
    class Contemplate_base_Cached(Contemplate):
        'Contemplate cached template base'

        # constructor
        def __init__(self, id=None, __=None):
            # initialize internal vars
            self.id = None 
            self.data = None
            self._renderFunction = None
            self._parent = None
            self._blocks = None

            self.id = id
            
            # parent tpl assign code starts here
            
            # parent tpl assign code ends here



        # tpl-defined blocks render code starts here
        
        
        # tpl block render method for block 'Block3'
        def _blockfn_Block3(self, __instance__):
            
            __p__ = ''
             
            __p__ += 'Base template Block3'
            return __p__
            
        
        
        # tpl block render method for block 'Block2'
        def _blockfn_Block2(self, __instance__):
            
            __p__ = ''
             
            __p__ += 'Base template Block2'
            return __p__
            
        
        
        # tpl block render method for block 'Block1'
        def _blockfn_Block1(self, __instance__):
            
            __p__ = ''
             
            __p__ += 'Base template Block1'
            return __p__
            
        
        # tpl-defined blocks render code ends here

        # render a tpl block method
        def renderBlock(self, block, __instance__=None):
            if ( not __instance__ ): __instance__ = self

            method = '_blockfn_' + block

            if (hasattr(self, method) and callable(getattr(self, method))):
                return getattr(self, method)(__instance__)

            elif self._parent is not None:
                return self._parent.renderBlock(block, __instance__)

            return ''
            
        
        # tpl render method
        def render(self, data, __instance__=None):
            __p__ = ''
            if ( not __instance__ ): __instance__ = self

            if self._parent is not None:
                __p__ = self._parent.render(data, __instance__)

            else:
                # tpl main render code starts here
                
                __instance__.data = Contemplate.data( data )
                __p__ += '<!-- this is the base template -->' + "\n" + '' + "\n" + '<strong>This is the base template</strong>' + "\n" + '' + "\n" + '' + "\n" + '<br /><br /><br /><br />' + "\n" + '<strong>This is Block1</strong><br />' + "\n" + '' +  __instance__.renderBlock( 'Block1' )  
                __p__ += '' + "\n" + '' + "\n" + '<br /><br /><br /><br />' + "\n" + '<strong>This is Block2</strong><br />' + "\n" + '' +  __instance__.renderBlock( 'Block2' )  
                __p__ += '' + "\n" + '' + "\n" + '<br /><br /><br /><br />' + "\n" + '<strong>This is Block3</strong><br />' + "\n" + '' +  __instance__.renderBlock( 'Block3' )  
                __p__ += '' + "\n" + '' + "\n" + '' + "\n" + '<br /><br /><br /><br />' + "\n" + '<strong>This is Block2 Again</strong><br />' + "\n" + '' +  __instance__.renderBlock( 'Block2' )  
                __p__ += '' + "\n" + ''
                
                # tpl main render code ends here

            self.data = None
            return __p__
    
    return Contemplate_base_Cached

# allow to 'import *'  from this file as a module
__all__ = ['__getTplClass__']
