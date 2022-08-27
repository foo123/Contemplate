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

# global ctx
Contemplate.setCacheDir(os.path.dirname(__file__))
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE)
Contemplate.add({'test' : os.path.join(os.path.dirname(__file__), './test.html')})

print(Contemplate.tpl('test', {'list':[1,2,3]}))
