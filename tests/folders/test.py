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

Contemplate.setCacheDir('./cache')
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE)
Contemplate.add({'tpl.html' : './tpl.html'})
Contemplate.add({'folder1/subfolder1/tpl1.html' : './folder1/subfolder1/tpl1.html'})
Contemplate.add({'folder2/tpl2.html' : './folder2/tpl2.html'})

print("--tpl--")
print(Contemplate.tpl("tpl.html", {}))
print("--tpl1--")
print(Contemplate.tpl("folder1/subfolder1/tpl1.html", {}))
print("--tpl2--")
print(Contemplate.tpl("folder2/tpl2.html", {}))