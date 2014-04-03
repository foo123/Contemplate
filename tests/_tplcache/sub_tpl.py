# -*- coding: UTF-8 -*-
# Contemplate cached template 'sub'



# imports start here, if any

# imports end here

def __getTplClass__(Contemplate):

    # extends the main Contemplate class
    class Contemplate_sub_Cached(Contemplate):
        'Contemplate cached template sub'

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
                __p__ += '<div>' + "\n" + '    <br />' + "\n" + '    <strong>Number of Items:' + str( Contemplate.count(__instance__.data['users'][__instance__.data['i']]) ) + '</strong>' + "\n" + '    <br />' + "\n" + '    ' 
                if ( len(__instance__.data['users'][__instance__.data['i']])>0 ):
                    # be able to use both key/value in loop
                    if isinstance(__instance__.data['users'][__instance__.data['i']], list): _loopObj1 = enumerate(__instance__.data['users'][__instance__.data['i']])
                    else: _loopObj1 = __instance__.data['users'][__instance__.data['i']].items()
                    for  j,user in _loopObj1 :
                        __instance__.data['j'] = j
                        __instance__.data['user'] = user
                         
                        __p__ += '' + "\n" + '        <div id=\'' + str( __instance__.data['user']["id"] ) + '\' class="'         
                        if ( 0 == (__instance__.data['j'] % 2) ):
                                     
                            __p__ += 'even'         
                        elif ( 1 == (__instance__.data['j'] % 2) ):
                                     
                            __p__ += 'odd'         
                                 
                        __p__ += '">' + "\n" + '            <a href="/' + str( __instance__.data['user']["name"] ) + '">' + str( __instance__.data['user']['name'] ) + str( __instance__.data['user']['text'] ) + ' ' + str( Contemplate.n(__instance__.data['i']) + Contemplate.n(__instance__.data['j']) ) + '</a>: <strong>' + str( __instance__.data['user']["text"] ) + '</strong>' + "\n" + '        </div>' + "\n" + '        '         
                        if (  Contemplate.has_key(__instance__.data['user'], "key1")  ):
                                     
                            __p__ += '' + "\n" + '            <div> User has key &quot;key1&quot; </div>' + "\n" + '        '         
                        elif (  Contemplate.has_key(__instance__.data['user'], "key", "key1")  ):
                                     
                            __p__ += '' + "\n" + '            <div> User has key [&quot;key&quot;][&quot;key1&quot;] </div>' + "\n" + '        '         
                                 
                        __p__ += '' + "\n" + '    ' 
                else:
                     
                    __p__ += '' + "\n" + '        <div class="none">' + str( Contemplate.l("No Users") ) + '</div>' + "\n" + '    ' 
                 
                __p__ += '' + "\n" + '</div>' + "\n" + ''
                
                # tpl main render code ends here

            self.data = None 
            return __p__
    
    return Contemplate_sub_Cached

# allow to 'import *'  from this file as a module
__all__ = ['__getTplClass__']        
