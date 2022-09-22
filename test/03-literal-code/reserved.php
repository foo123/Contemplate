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
Contemplate::add(array('reserved' => ABSPATH . '/reserved.html'));

echo_(Contemplate::tpl('reserved', array()));
