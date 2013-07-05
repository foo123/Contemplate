<?php
if (!class_exists('Tpl'))
{
class Tpl
{
    /*
    *  Simple light-weight php templating engine (part of javascript templating engine)
    *  @author: Nikos M.  http://nikos-web-development.netai.net/
    *
    *  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed
    *  http://ejohn.org/blog/javascript-micro-templating/
    *
    */
    
    private static $escaper=null;
    
    private static $__templates__=array();
    private static $cache=array();
    private static $tpls=array();
    
    protected static $loops=0;
    protected static $ifs=0;
    protected static $loopifs=0;
    
    protected static $controlConstructs=array(
        'if', 'elseif', 'else', 'endif', 
        'for', 'elsefor', 'endfor'
    );
    
    protected static $funcs=array( 'l', 's', 'n', 'f', 'htmlselect', 'htmltable' );
    
    protected static $regExps=array(
        'functions'=>'',
        'controlConstructs'=>'',
        'forExpr'=>'',
        'quotes'=>'',
        'specials'=>'',
        'replacements'=>''
    );
    
    public static function init($escaper=null)
    {
        self::$escaper=$escaper;
        
        self::$regExps['controlConstructs']='/\t\s*\%(' . implode('|', self::$controlConstructs) . ')\b\s*\((.*)\)/';
        self::$regExps['forExpr']='/^\s*\$([a-z0-9_]+?)\s* as \s*\$([a-z0-9_]+?)\s*=>\s*\$([a-z0-9_]+)\s*$/i';
        self::$regExps['quotes']="/'/";
        self::$regExps['specials']="/[\r\t\n]/";
        self::$regExps['replacements']="/\t\s*(.*?)\s*%>/";
        if (!empty(self::$funcs))  
            self::$regExps['functions']='/\%(' . implode('|', self::$funcs) . ')\b/';
    }
    
    //
    // Main methods
    //
    public static function load($id, $tpl, $force=false)
    {
        if (!isset(self::$tpls[$id]) || $force)
            self::$tpls[$id]=$tpl;
    }
    
    public static function tmpl($id, $data=null)
    {
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        if (isset(self::$tpls[$id]))
        {
            $tpl=self::$tpls[$id];
            if (!isset(self::$cache[$id]))
            {
                $func=
                    // Introduce the data as local variables using extract()
                    "extract(Tpl::o2a((array)\$__o__)); "
                    ."\$__p__ = ''; "
                    // Convert the template into pure PHP
                    ."\$__p__ .= '" .  self::parse($tpl) .  "'; "
                    ."return \$__p__;"
                    ;
                self::$cache[$id]=create_function('$__o__', $func);
            }
            $fn=self::$cache[$id];
            //return self::log($func);
            // Provide some basic currying to the user
            if ($data)
                return $fn( $data );
            else
                return $fn;
        }
        return null;
    }
    
    //
    // Control structures
    //
    
    // if
    public static function t_if($cond='false') 
    {
        self::$ifs++;
        return "'; if ($cond) { ";
    }
    
    // elseif    
    public static function t_elseif($cond='false') 
    {
        return "'; } elseif ($cond) { ";
    }
    
    // else
    public static function t_else() 
    {
        /*if (self::$loopifs>0 && 0==self::$ifs)
        {
            self::$loopifs--;
            // else attached to  for loop
            return "'; } } else { ";
        }*/
        // regular else
        return "'; } else { ";
    }
    
    // elsefor
    public static function t_elsefor() 
    {
        // else attached to  for loop
        self::$loopifs--;
        return "'; } } else { ";
    }
    
    // endif
    public static function t_endif() 
    {
        self::$ifs--;
        return "'; } ";
    }
    
    // for, foreach
    public static function t_for($for_expr) 
    {
        self::$loops++;
        self::$loopifs++;
        preg_match(self::$regExps['forExpr'], $for_expr, $m);
        $o="\$${m[1]}"; $k="\$${m[2]}"; $v="\$${m[3]}";
        return "'; if (!empty($o)) { foreach ($o as $k=>$v) { ";
    }
    
    // endfor
    public static function t_endfor() 
    {
        self::$loops--;
        if (self::$loopifs>0)
        {
            self::$loopifs--;
            return "'; } } ";
        }
        return "'; } ";
    }
    
    //
    // Basic template functions
    //
    public static function e($e)
    {
        return ($e);
    }
    
    public static function s($e)
    {
        return strval($e);
    }
    
    public static function n($e)
    {
        return intval($e);
    }
    
    public static function f($e)
    {
        return floatval($e);
    }
    
    //
    //  Localization functions
    //
    public static function locale($e)
    {
        // bypass for now
        return ($e);
    }
    
    public static function l($e)
    {
        return self::locale($e);
    }
    
    //
    //  HTMl elements
    //
    
    // table
    public static function htmltable($data, $options=array())
    {
        $data=(array)$data;
        $options=(array)$options;
        
        $o="<table";
        
        if (isset($options['id']))
        $o.=" id='{$options['id']}'";
        if (isset($options['class']))
        $o.=" class='{$options['class']}'";
        if (isset($options['style']))
        $o.=" style='{$options['style']}'";
        if (isset($options['data']))
        {
            foreach ((array)$options['data'] as $k=>$v)
                $o.=" data-{$k}='{$v}'";
        }
        $o.=">";
            
        $tk='';
        if (
            (isset($options['header']) && $options['header']) || 
            (isset($options['footer']) && $options['footer'])
        )
            $tk="<td>".implode('</td><td>', @array_keys($data))."</td>";
            
        $header='';
        if (isset($options['header']) && $options['header'])
            $header="<thead><tr>{$tk}</tr></thead>";
            
        $footer='';
        if (isset($options['footer']) && $options['footer'])
            $footer="<tfoot><tr>{$tk}</tr></tfoot>";
        
        $o.=$header;
        
        // get data rows
        $rows=array();
        foreach (@array_values($data) as $i=>$col)
        {
            foreach (@array_values((array)$col) as $j=>$d)
            {
                if (!isset($rows[$j])) $rows[$j]=array_fill(0, count($col), '');
                $rows[$j][$i]=$d;
            }
        }
        
        if (isset($options['odd']))
            $class_odd=$options['odd'];
        else
            $class_odd='odd';
        if (isset($options['even']))
            $class_even=$options['even'];
        else
            $class_even='even';
            
        // render rows
        $odd=false;
        foreach (@$rows as $row)
        {
            if ($odd)
                $o.="<tr class='{$class_odd}'><td>".implode('</td><td>', $row)."</td></tr>";
            else
                $o.="<tr class='{$class_even}'><td>".implode('</td><td>', $row)."</td></tr>";
            
            $odd=!$odd;
        }
        unset($rows);
        
        $o.=$footer;
        
        $o.="</table>";
        
        if ($echo)  echo $o;
        
        return $o;
    }
    
    // select
    public static function htmlselect($data, $options=array())
    {
        $data=(array)$data;
        $options=(array)$options;
        
        $o="<select";
        
        if (isset($options['multiple']) && $options['multiple'])
        $o.=" multiple";
        if (isset($options['disabled']) && $options['disabled'])
        $o.=" disabled='disabled'";
        if (isset($options['name']))
        $o.=" name='{$options['name']}'";
        if (isset($options['id']))
        $o.=" id='{$options['id']}'";
        if (isset($options['class']))
        $o.=" class='{$options['class']}'";
        if (isset($options['style']))
        $o.=" style='{$options['style']}'";
        if (isset($options['data']))
        {
            foreach ((array)$options['data'] as $k=>$v)
                $o.=" data-{$k}='{$v}'";
        }
        $o.=">";
        
        if (isset($options['selected']))
            $options['selected']=array_flip((array)$options['selected']);
        else
            $options['selected']=array();
            
        if (isset($options['optgroups']))
            $options['optgroups']=array_flip((array)$options['optgroups']);
    
        foreach ($data as $k=>$v)
        {
            if (isset($options['optgroups']) && isset($options['optgroups'][$k]))
            {
                $o.="<optgroup label='{$k}'>";
                foreach ((array)$v as $k2=>$v2)
                {
                    if (isset($options['use_key']))
                        $v2=$k2;
                    elseif (isset($options['use_value']))
                        $k2=$v2;
                        
                    if (isset($options['selected'][$k2]))
                        $o.="<option value='{$k2}' selected='selected'>{$v2}</option>";
                    else
                        $o.="<option value='{$k2}'>{$v2}</option>";
                }
                $o.="</optgroup>";
            }
            else
            {
                if (isset($options['use_key']))
                    $v=$k;
                elseif (isset($options['use_value']))
                    $k=$v;
                    
                if (isset($options['selected'][$k]))
                    $o.="<option value='{$k}' selected='selected'>{$v}</option>";
                else
                    $o.="<option value='{$k}'>{$v}</option>";
            }
        }
        
        $o.="</select>";
        
        if ($echo)  echo $o;
        
        return $o;
    }
    
    //
    // utility methods
    //
    public static function doControlConstruct($m)
    {
        if (isset($m[1]))
        {
            switch($m[1])
            {
                case 'if':
                    return /*"\t" .*/ self::t_if($m[2]);
                    break;
                case 'elseif':
                    return /*"\t" .*/ self::t_elseif($m[2]);
                    break;
                case 'else':
                    return /*"\t" .*/ self::t_else($m[2]);
                    break;
                case 'endif':
                    return /*"\t" .*/ self::t_endif($m[2]);
                    break;
                case 'for':
                    return /*"\t" .*/ self::t_for($m[2]);
                    break;
                case 'elsefor':
                    return /*"\t" .*/ self::t_elsefor($m[2]);
                    break;
                case 'endfor':
                    return /*"\t" .*/ self::t_endfor($m[2]);
                    break;
            }
        }
        return $m[0];
    }
    
    protected static function parseControlConstructs($s) 
    {
        $s = implode("\n", explode("%>", $s));
        $s =  preg_replace_callback(self::$regExps['controlConstructs'], array(__CLASS__, 'doControlConstruct'), $s);
        $s = implode("%>", explode("\n", $s));
        return $s;
    }
    
    protected static function parse($s) 
    {
        $s = preg_replace(self::$regExps['quotes'], "\\'", $s);
        $s = preg_replace(self::$regExps['specials'], " ", $s);
        $s = implode("\t", explode("<%", $s));
        $s = self::parseControlConstructs($s);
        if (!empty(self::$funcs))  $s = preg_replace(self::$regExps['functions'], 'Tpl::${1}', $s);
        $s = preg_replace(self::$regExps['replacements'], "' . ( $1 ) . '", $s);
        $s = implode("'; ", explode("\t", $s));
        $s = implode(" \$__p__ .= '", explode("%>", $s));
        return $s;
    }
    
    /*public static function tpl($template, array $args=array())
    {
        if ( isset(self::$__templates__[$template]) )
            $template_path = self::$__templates__[$template];
        else return '';
        
        if (!$template_path || !is_file($template_path))
        {
            printf('File "%s" doesn\'t exist!', $template_path);
            return '';
        }
        return self::getTpl($template_path, $args);
    }
    
    private static function getTpl($______templatepath________, array $______args______=array())
    {
        if (!empty($______args______)) extract($______args______);
        ob_start();
            include($______templatepath________);
        return ob_get_clean();
    }*/
    
    public static function merge()
    {
        if (func_num_args() < 1) return;
        
        $arrays = func_get_args();
        $merged = array_shift($arrays);
        
        $isTargetObject=false;
        if (is_object($merged))
        {
            $isTargetObject=true;
            $merged=(array)$merged;
        }
        
        foreach ($arrays as $arr)
        {
            $isObject=false;
            if (is_object($arr))
            {
                $isObject=true;
                $arr=(array)$arr;
            }
                
            foreach($arr as $key => $val)
            {
                if(array_key_exists($key, $merged) && (is_array($val) || is_object($val)))
                {
                    $merged[$key] = self::merge($merged[$key], $arr[$key]);
                    if (is_object($val))
                        $merged[$key]=(object)$merged[$key];
                }
                else
                    $merged[$key] = $val;
            }
        }
        if ($isTargetObject)
        {
            $isTargetObject=false;
            $merged=(object)$merged;
        }
        return $merged;
    }
    
    // add templates manually
    public static function add($tpls=array())
    {
        self::$__templates__=self::merge(self::$__templates__, $tpls);
    }
    
    public static function o2a($d)
    {
        if (is_object($d))  $d=array_merge(array(), (array)$d);
        if (is_array($d))
        {
            foreach ($d as $k=>$v)
            {
                if (is_object($v) || is_array($v))
                    $d[$k]=self::o2a($v);
            }
        }
        return $d;
    }
    
    public static function log($m)
    {
        return '<pre>' . print_r($m, true) . '</pre>';
    }
    
    /*public static function test($s) 
    {
        /*preg_match('/^([a-z0-9_]+?)\s* as \s*([a-z0-9_]+?)\s*=>\s*([a-z0-9_]+)$/i', $s, $m);
        echo self::log(array($s, $m));* /
        echo self::log(self::parse ($s));
    }*/
}

// init the engine
//require dirname(__FILE__) .'/Escaper.php';
Tpl::init(/*new Escaper('utf-8')*/);

}
