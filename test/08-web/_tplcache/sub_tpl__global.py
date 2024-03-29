# -*- coding: UTF-8 -*-

# Contemplate cached template 'sub'
def __getTplClass__(Contemplate):
    # extends the main Contemplate.Template class
    class Contemplate_sub__global(Contemplate.Template):
        'Contemplate cached template sub'
        # constructor
        def __init__(self, id = None):
            self_ = self
            super(Contemplate_sub__global, self).__init__(id)
            # extend tpl assign code starts here
            
            self_._usesTpl = []
            # extend tpl assign code ends here
        # tpl-defined blocks render code starts here

        # tpl-defined blocks render code ends here
        # render a tpl block method
        def block(self, block, data, __i__ = None):
            self_ = self
            __ctx = False
            r = ''
            if not __i__:
                __i__ = self_
                if not self_._autonomus: __ctx = Contemplate._set_ctx(self_._ctx)
            method = '_blockfn_' + block
            if (hasattr(self_, method) and callable(getattr(self_, method))):
                r = getattr(self_, method)(data, self_, __i__)
            elif self_._extends:
                r = self_._extends.block(block, data, __i__)
            if __ctx:  Contemplate._set_ctx(__ctx)
            return r
        # render method
        def render(self, data, __i__ = None):
            self_ = self
            __ctx = False
            __p__ = ''
            if not __i__:
                __i__ = self_
                if not self._autonomus: __ctx = Contemplate._set_ctx(self_._ctx)
            if self_._extends:
                __p__ = self_._extends.render(data, __i__)

            else:
                # tpl main render code starts here
                
                __p__ += '<div>' + "\n" + '    <br />' + "\n" + '    <strong>Number of Items:' + str(Contemplate.count(data['users'][data['i']])) + '</strong>' + "\n" + '    <br />' + "\n" + '    '
                _loc_7 = data['users'][data['i']]
                _loc_8 = (enumerate(_loc_7) if isinstance(_loc_7,(list,tuple)) else _loc_7.items()) if _loc_7 else None
                if (_loc_8):
                    for _loc_j,_loc_user in _loc_8:
                         
                        __p__ += '' + "\n" + '        <div id=\'' + str(_loc_user["id"]) + '\' class="'        
                        if (0 == (_loc_j % 2)):
                                     
                            __p__ += 'even'        
                        elif (1 == (_loc_j % 2)):
                                     
                            __p__ += 'odd'        
                                 
                        __p__ += '">' + "\n" + '            <a href="/' + str(_loc_user["name"]) + '">' + str(_loc_user['name']) + '' + str(_loc_user['text']) + ' ' + str(int(data['i']) + int(_loc_j)) + '</a>: <strong>' + str(_loc_user["text"]) + '</strong>' + "\n" + '        </div>' + "\n" + '        '        
                        if (Contemplate.haskey(_loc_user, "key1")):
                                     
                            __p__ += '' + "\n" + '            <div> User has key &quot;key1&quot; </div>' + "\n" + '        '        
                        elif (Contemplate.haskey(_loc_user, "key", "key1")):
                                     
                            __p__ += '' + "\n" + '            <div> User has key [&quot;key&quot;][&quot;key1&quot;] </div>' + "\n" + '        '        
                                 
                        __p__ += '' + "\n" + '    '
                else:
                     
                    __p__ += '' + "\n" + '        <div class="none">' + str(locale("No Users")) + '</div>' + "\n" + '    '
                 
                __p__ += '' + "\n" + '</div>' + "\n" + ''
                
                # tpl main render code ends here

            if __ctx:  Contemplate._set_ctx(__ctx)
            return __p__
    return Contemplate_sub__global
# allow to 'import *'  from this file as a module
__all__ = ['__getTplClass__']
