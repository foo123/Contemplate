def import_module(name, path):
    import imp
    try:
        mod_fp, mod_path, mod_desc  = imp.find_module(name, [path])
        mod = getattr( imp.load_module(name, mod_fp, mod_path, mod_desc), name )
    except ImportError as exc:
        mod = None
    finally:
        if mod_fp: mod_fp.close()
    return mod

import os
# import the Contemplate.py engine (as a) module, probably you will want to place this in another dir/package
Contemplate = import_module('Contemplate', os.path.join(os.path.dirname(__file__), '../../src/python/'))

tpl = '<% $v->prop %><% $v->func() %>'
Contemplate.add({
    #'inline' : [tpl],
    'test' : os.path.dirname(__file__)+'test.tpl.html'
})
# make sure it exists
Contemplate.setCacheDir(os.path.dirname(__file__))

# dynamically update the cached template if original template has changed
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE)

class test:
    def __init__(self):
        self.prop = 'prop'
    
    def func(self, *args):
        return 'func'
    
    def getPropGetter(self, *args):
        return 'propGetter'


arr = ['foo',{'prop':'prop'}]
print(Contemplate.tpl('test', {'v':test(),'a':arr}))
