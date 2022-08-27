<?php
define('ABSPATH', dirname(__FILE__));
function echo_($s)
{
    echo $s . PHP_EOL;
}
include dirname(dirname(ABSPATH)).'/src/php/Contemplate.php';

// global ctx
Contemplate::setCacheDir(ABSPATH);
Contemplate::setCacheMode(Contemplate::CACHE_TO_DISK_AUTOUPDATE);
Contemplate::add(array('test' => ABSPATH . '/test.html'));

echo_(Contemplate::tpl('test', array('list'=>[1,2,3])));
