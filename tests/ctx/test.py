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


def plg1(msg):
    return msg + ' ' + 'ctx1'

def plg2(msg):
    return msg + ' ' + 'ctx2'

def plg3(msg):
    return msg + ' ' + 'ctx3'


# global ctx
Contemplate.setCacheDir('./')
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE)
Contemplate.add({'global' : os.path.join('./global.html')})
Contemplate.setLocales({
 'ctx' : 'ctxglobal',
 'global': 'locale global'
})

# ctx 1
Contemplate.createCtx("ctx1")
Contemplate.setCacheDir('./',"ctx1")
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE,"ctx1")
Contemplate.add({'tpl' : os.path.join('./tpl1.html')},"ctx1")
Contemplate.setLocales({'ctx' : 'ctx1'},"ctx1")
Contemplate.addPlugin('my_plugin',plg1,"ctx1")

# ctx 2
Contemplate.createCtx("ctx2")
Contemplate.setCacheDir('./',"ctx2")
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE,"ctx2")
Contemplate.add({'tpl' : os.path.join('./tpl2.html')},"ctx2")
Contemplate.setLocales({'ctx' : 'ctx2'},"ctx2")
Contemplate.addPlugin('my_plugin',plg2,"ctx2")

# ctx 3
Contemplate.createCtx("ctx3")
Contemplate.setCacheDir('./',"ctx3")
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE,"ctx3")
Contemplate.add({'tpl' : os.path.join('./tpl3.html')},"ctx3")
Contemplate.setLocales({'ctx' : 'ctx3'},"ctx3")
Contemplate.addPlugin('my_plugin',plg3,"ctx3")

print('--tpl1--')
print(Contemplate.tpl('tpl',{},"ctx1"))

print('--tpl2--')
print(Contemplate.tpl('tpl',{},"ctx2"))

print('--tpl3--')
print(Contemplate.tpl('tpl',{},"ctx3"))
