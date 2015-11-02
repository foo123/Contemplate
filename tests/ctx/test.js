var path = require('path'), echo = console.log,
    Contemplate = require(path.join(__dirname, '../../src/js/Contemplate.js'))
;

function plg1(msg)
{
    return msg + ' ' + 'ctx1';
}
function plg2(msg)
{
    return msg + ' ' + 'ctx2';
}
function plg3(msg)
{
    return msg + ' ' + 'ctx3';
}

// global ctx
Contemplate.setCacheDir(__dirname);
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE);
Contemplate.add({'global' : path.join(__dirname, '/global.html')});
Contemplate.setLocales({
 'ctx' : 'ctxglobal',
 'global': 'locale global'
});

// ctx 1
Contemplate.createCtx("ctx1");
Contemplate.setCacheDir(__dirname,"ctx1");
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE,"ctx1");
Contemplate.add({'tpl' : path.join(__dirname, '/tpl1.html')},"ctx1");
Contemplate.setLocales({'ctx':'ctx1'},"ctx1");
Contemplate.addPlugin('my_plugin',plg1,"ctx1");

// ctx 2
Contemplate.createCtx("ctx2");
Contemplate.setCacheDir(__dirname,"ctx2");
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE,"ctx2");
Contemplate.add({'tpl' : path.join(__dirname, '/tpl2.html')},"ctx2");
Contemplate.setLocales({'ctx':'ctx2'},"ctx2");
Contemplate.addPlugin('my_plugin',plg2,"ctx2");

// ctx 3
Contemplate.createCtx("ctx3");
Contemplate.setCacheDir(__dirname,"ctx3");
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE,"ctx3");
Contemplate.add({'tpl' : path.join(__dirname, '/tpl3.html')},"ctx3");
Contemplate.setLocales({'ctx':'ctx3'},"ctx3");
Contemplate.addPlugin('my_plugin',plg3,"ctx3");

echo('--tpl1--');
echo(Contemplate.tpl('tpl',{},"ctx1"));

echo('--tpl2--');
echo(Contemplate.tpl('tpl',{},"ctx2"));

echo('--tpl3--');
echo(Contemplate.tpl('tpl',{},"ctx3"));
