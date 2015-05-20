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

Contemplate.setCacheDir('./')
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE)
if not Contemplate.hasTpl('tpl1'): Contemplate.add({'tpl1' : './tpl1.html'})
if not Contemplate.hasTpl('tpl2'): Contemplate.add({'tpl2' : './tpl2.html'})
if not Contemplate.hasTpl('tpl3'): Contemplate.add({'tpl3' : './tpl3.html'})

print("--tpl1--")
print(Contemplate.tpl("tpl1", {}))
print("--tpl2--")
print(Contemplate.tpl("tpl2", {}))
print("--tpl3--")
print(Contemplate.tpl("tpl3", {}))