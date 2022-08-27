<?php
define('ABSPATH', dirname(__FILE__));
function echo_($s)
{
    echo $s . PHP_EOL;
}
include dirname(dirname(ABSPATH)).'/src/php/Contemplate.php';
Contemplate::setCacheDir(ABSPATH.'/cache');
Contemplate::setCacheMode(Contemplate::CACHE_TO_DISK_AUTOUPDATE);
Contemplate::add(array('tpl.html' => ABSPATH. '/tpl.html'));
Contemplate::add(array('folder1/subfolder1/tpl1.html' => ABSPATH. '/folder1/subfolder1/tpl1.html'));
Contemplate::add(array('folder2/tpl2.html' => ABSPATH. '/folder2/tpl2.html'));

echo_("--tpl--");
echo_(Contemplate::tpl("tpl.html", array()));
echo_("--tpl1--");
echo_(Contemplate::tpl("folder1/subfolder1/tpl1.html", array()));
echo_("--tpl2--");
echo_(Contemplate::tpl("folder2/tpl2.html", array()));