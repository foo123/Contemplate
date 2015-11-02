var path = require('path'), echo = console.log,
    Contemplate = require(path.join(__dirname, '../../src/js/Contemplate.js'))
;

Contemplate.setCacheDir(__dirname);
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE);
if ( !Contemplate.hasTpl('tpl1') ) Contemplate.add({'tpl1' : path.join(__dirname, '/tpl1.html')});
if ( !Contemplate.hasTpl('tpl2') ) Contemplate.add({'tpl2' : path.join(__dirname, '/tpl2.html')});
if ( !Contemplate.hasTpl('tpl3') ) Contemplate.add({'tpl3' : path.join(__dirname, '/tpl3.html')});

echo("--tpl1--");
echo(Contemplate.tpl("tpl1", {}));
echo("--tpl2--");
echo(Contemplate.tpl("tpl2", {}));
echo("--tpl3--");
echo(Contemplate.tpl("tpl3", {}));