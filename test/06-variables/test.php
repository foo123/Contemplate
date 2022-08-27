<?php
define('ABSPATH', dirname(__FILE__));
function echo_($s)
{
    echo $s . PHP_EOL;
}
include dirname(dirname(ABSPATH)).'/src/php/Contemplate.php';

$tpl = '<% $v->prop %><% $v->func() %>';
Contemplate::add(array(
    //'inline' => array($tpl),
    'test' => ABSPATH.'/test.tpl.html'
));
// set the cache directory (make sure to exist)
Contemplate::setCacheDir(ABSPATH);

// dynamically update the cached template if original template has changed
Contemplate::setCacheMode(Contemplate::CACHE_TO_DISK_AUTOUPDATE);

class test
{
    public $prop = 'prop';
    public $prop2 = null;
    public function __construct(){ $this->prop2 = $this; }
    public function func(){ return 'func'; }
    public function getPropGetter(){ return 'propGetter'; }
    public function method(){ return $this; }
}

$arr = array('foo',array('prop'=>'prop'));
echo_(Contemplate::tpl('test', array('v'=>new test(),'a'=>$arr)));
