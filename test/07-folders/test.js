var path = require('path'), echo = console.log,
    Contemplate = require(path.join(__dirname, '../../src/js/Contemplate.js'))
;

Contemplate.setCacheDir(path.join(__dirname, '/cache'));
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE);
Contemplate.add({'tpl.html' : path.join(__dirname, '/tpl.html')});
Contemplate.add({'folder1/subfolder1/tpl1.html' : path.join(__dirname, '/folder1/subfolder1/tpl1.html')});
Contemplate.add({'folder2/tpl2.html' : path.join(__dirname, '/folder2/tpl2.html')});

echo("--tpl--");
echo(Contemplate.tpl("tpl.html", {}));
echo("--tpl1--");
echo(Contemplate.tpl("folder1/subfolder1/tpl1.html", {}));
echo("--tpl2--");
echo(Contemplate.tpl("folder2/tpl2.html", {}));