# -*- coding: UTF-8 -*-
# Contemplate cached template 'sub'



# imports start here, if any

# imports end here

def __getTplClass__(Contemplate):

    # extends the main Contemplate class
    class Contemplate_sub_Cached(Contemplate.Template):
        'Contemplate cached template sub'

        # constructor
        def __init__(self, id=None, __=None):
            # initialize internal vars
            self.id = None 
            self.d = None
            self._renderer = None
            self._extends = None
            self._blocks = None

            self.id = id
            
            # extend tpl assign code starts here
            
            # extend tpl assign code ends here



        # tpl-defined blocks render code starts here
        
        # tpl-defined blocks render code ends here

        # render a tpl block method
        def renderBlock(self, block, __i__=None):
            if ( not __i__ ): __i__ = self

            method = '_blockfn_' + block

            if (hasattr(self, method) and callable(getattr(self, method))):
                return getattr(self, method)(__i__)

            elif self._extends:
                return self._extends.renderBlock(block, __i__)

            return ''
            
        
        # tpl render method
        def render(self, data, __i__=None):
            __p__ = ''
            if ( not __i__ ): __i__ = self

            if self._extends:
                __p__ = self._extends.render(data, __i__)

            else:
                # tpl main render code starts here
                
                __i__.d = data
                __p__ += '<div>' + "\n" + '    <br />' + "\n" + '    <strong>Number of Items:' + str( Contemplate.count(data['users'][data['i']]) ) + '</strong>' + "\n" + '    <br />' + "\n" + '    ' 
                _loc_7 = Contemplate.items(data['users'][data['i']])
                if (_loc_7):
                    for _loc_j,_loc_user in _loc_7:
                         
                        __p__ += '' + "\n" + '        <div id=\'' + str( _loc_user["id"] ) + '\' class="'         
                        if (0 == (_loc_j % 2)):
                                     
                            __p__ += 'even'         
                        elif (1 == (_loc_j % 2)):
                                     
                            __p__ += 'odd'         
                                 
                        __p__ += '">' + "\n" + '            <a href="/' + str( _loc_user["name"] ) + '">' + str( _loc_user['name'] ) + '' + str( _loc_user['text'] ) + ' ' + str( Contemplate.n(data['i']) + Contemplate.n(_loc_j) ) + '</a>: <strong>' + str( _loc_user["text"] ) + '</strong>' + "\n" + '        </div>' + "\n" + '        '         
                        if ( Contemplate.haskey(_loc_user, "key1") ):
                                     
                            __p__ += '' + "\n" + '            <div> User has key &quot;key1&quot; </div>' + "\n" + '        '         
                        elif ( Contemplate.haskey(_loc_user, "key", "key1") ):
                                     
                            __p__ += '' + "\n" + '            <div> User has key [&quot;key&quot;][&quot;key1&quot;] </div>' + "\n" + '        '         
                                 
                        __p__ += '' + "\n" + '    ' 
                else:
                     
                    __p__ += '' + "\n" + '        <div class="none">' + str( Contemplate.l("No Users") ) + '</div>' + "\n" + '    ' 
                 
                __p__ += '' + "\n" + '</div>' + "\n" + ''
                
                # tpl main render code ends here

            self.d = None
            return __p__
    
    return Contemplate_sub_Cached

# allow to 'import *'  from this file as a module
__all__ = ['__getTplClass__']
