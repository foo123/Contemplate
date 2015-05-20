var path = require('path'),
    echo = console.log,
    Contemplate = require(path.join(__dirname, '../../src/js/Contemplate.js'))
;

Contemplate.setCacheDir(__dirname);
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE);
Contemplate.add({
    'tpl1' : path.join(__dirname, '/tpl1.html'),
    'tpl2' : path.join(__dirname, '/tpl2.html'),
    'tpl3' : path.join(__dirname, '/tpl3.html')
});

echo("--tpl1--");
echo(Contemplate.tpl("tpl1", {}));
echo("--tpl2--");
echo(Contemplate.tpl("tpl2", {}));
echo("--tpl3--");
echo(Contemplate.tpl("tpl3", {}));