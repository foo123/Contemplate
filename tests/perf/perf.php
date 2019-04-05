<?php

define('THISPATH', dirname(__FILE__));

require '../../src/php/Contemplate.php';
Contemplate::add(array(
    "test_uncached"     => THISPATH.'/contemplate.tpl.html',
    "test_cached"       => THISPATH.'/contemplate.tpl.html'
));
Contemplate::setCacheDir(THISPATH);
Contemplate::setCacheMode(Contemplate::CACHE_TO_DISK_AUTOUPDATE);

@unlink(THISPATH.'/test_uncached_tpl__global.php');
@unlink(THISPATH.'/test_cached_tpl__global.php');

// escape function for raw output
function escape ($val, $charset = 'UTF-8')
{
	return htmlspecialchars ($val, ENT_QUOTES, $charset);
}

// function to render the template
function template_raw( $data )
{
    extract( $data );
	require( THISPATH.'/php.tpl.php' );
}

function template_uncached( $data )
{
    $tpl = Contemplate::tpl("test_uncached", $data, array('refresh'=>true));
}

function template_cached( $data )
{
    Contemplate::tpl("test_cached", $data);
}

function avg_perf( $n, $func, $args=null )
{
    $avg_t = 0; $avg_m = 0;
    for($i=0; $i<$n; $i++)
    {
        ob_start();
        $start = microtime(true);
        $mem = memory_get_peak_usage();
        call_user_func( $func, $args );
        $t = microtime(true) - $start;
        $mem = memory_get_peak_usage() - $mem;
        ob_end_clean();
        $avg_t += $t; $avg_m += $mem;
    }
    return array(1000*$avg_t/$n, round($avg_m/1000/$n));
}

$data1 = array(
    'title'     => 'Test',
    'show_people' => true,
    'people'    => array('person 1','person 2','person 3','person 4','person 5')
);
$data2 = array(
    'title'     => 'Test',
    'show_people' => true,
    'people'    => array('person 1','person 2','person 3','person 4','person 5')
);
$perf1 = avg_perf(1000, 'template_raw',       $data1);
$perf2 = avg_perf(1000, 'template_uncached',  $data2);
$perf3 = avg_perf(1000, 'template_cached',    $data2);

echo "\n            PHP (raw) : Time = {$perf1[0]} ms, Mem = {$perf1[1]} KB";
echo "\nContemplate (nocache) : Time = {$perf2[0]} ms, Mem = {$perf2[1]} KB";
echo "\n  Contemplate (cache) : Time = {$perf3[0]} ms, Mem = {$perf3[1]} KB";