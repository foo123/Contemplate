<?php
define('ABSPATH', dirname(__FILE__));
function echo_($s)
{
    echo $s . PHP_EOL;
}
include dirname(dirname(ABSPATH)).'/src/php/Contemplate.php';
Contemplate::setCacheDir(ABSPATH);
Contemplate::setCacheMode(Contemplate::CACHE_TO_DISK_AUTOUPDATE);
if ( !Contemplate::hasTpl('tpl1') ) Contemplate::add(array('tpl1' => ABSPATH. '/tpl1.html'));
if ( !Contemplate::hasTpl('tpl2') ) Contemplate::add(array('tpl2' => ABSPATH. '/tpl2.html'));
if ( !Contemplate::hasTpl('tpl3') ) Contemplate::add(array('tpl3' => ABSPATH. '/tpl3.html'));

echo_("--tpl1--");
echo_(Contemplate::tpl("tpl1", array()));
echo_("--tpl2--");
echo_(Contemplate::tpl("tpl2", array()));
echo_("--tpl3--");
echo_(Contemplate::tpl("tpl3", array()));