<?php
class test
{
    public function foo()
    {
        echo 'foo: '.implode(',', func_get_args());
    }
}

function get($o, $p)
{
    return function() use($o, $p) {
        return call_user_func_array(array($o, $p), func_get_args());
    };
}

// needs PHP >= 7
get(new test(), 'foo')(1,2,3);