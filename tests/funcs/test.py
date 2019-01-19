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

print(Contemplate.queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",None,["key1"]))
print(Contemplate.queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",None,["key2"]))
print(Contemplate.queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",{"key3":3,"key4":[41,42]}))
print(Contemplate.queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",{"key3":3,"key4":[41,42]},["key2"]))
print(Contemplate.queryvar("https://example.com",{"key1":{"foo":1,"bar":2},"key2":[21,22]}))
