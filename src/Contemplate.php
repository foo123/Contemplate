<?php
if (!class_exists('Contemplate'))
{
class Contemplate
{
    /*
    *  Simple light-weight php templating engine (part of javascript templating engine)
    *  @author: Nikos M.  http://nikos-web-development.netai.net/
    *  https://github.com/foo123/Contemplate
    *
    *  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed
    *  http://ejohn.org/blog/javascript-micro-templating/
    *
    */
    
    const CACHE_TO_DISK_NONE = 0;
    const CACHE_TO_DISK_AUTOUPDATE = 2;
    const CACHE_TO_DISK_NOUPDATE = 4;
    
    private static $escaper=null;
    
    private static $__cacheDir='./';
    private static $__cacheMode=0;
    private static $__cache=array();
    private static $__templates=array();
    private static $__partials=array();
    private static $__locale=array();
    private static $__leftTplSep="<%";
    private static $__rightTplSep="%>";
    
    protected static $loops=0;
    protected static $ifs=0;
    protected static $loopifs=0;
    
    protected static $__class='';
    
    protected static $controlConstructs=array(
        'if', 'elseif', 'else', 'endif', 
        'for', 'elsefor', 'endfor',
        'embed', 'include'
    );
    protected static $funcs=array( 'l', 's', 'n', 'f', 'concat'/*, 'htmlselect', 'htmltable'*/ );
    protected static $regExps=array(
        'functions'=>'',
        'controlConstructs'=>'',
        'forExpr'=>'',
        'quotes'=>'',
        'specials'=>'',
        'replacements'=>''
    );
    
    // instance dynamic render function (when no caching is used)
    private $renderFunction=null;
    private $id=null;
    
    
    //
    //  Instance template methods
    //
    public function __construct($id=null, $renderFunc=null)
    {
        if ($id)
        {
            $this->id=$id;
            $this->renderFunction=$renderFunc;
        }
    }
    
    public function setId($id=null)
    {
        if ($id) $this->id=$id;
        return $this;
    }
	
    public function setRenderFunction($renderFunc=null)
    {
        if ($renderFunc)  $this->renderFunction=$renderFunc;
        return $this;
    }
	
    public function render($data) 
    {
        /* dynamic function */
        if ($this->renderFunction)
        {
            $renderFunction=$this->renderFunction;
            return $renderFunction( $data );
        }
        return '';
	}
    
    public static function init($escaper=null)
    {
        self::$escaper=$escaper;
        
        self::$__class='Contemplate'; // __CLASS__;
        
        self::$regExps['controlConstructs']='/\t\s*\%(' . implode('|', self::$controlConstructs) . ')\b\s*\((.*)\)/';
        self::$regExps['forExpr']='/^\s*\$([a-z0-9_]+?)\s* as \s*\$([a-z0-9_]+?)\s*=>\s*\$([a-z0-9_]+)\s*$/i';
        self::$regExps['quotes']="/'/";
        self::$regExps['specials']="/[\r\t]/";//"/[\r\t\n]/";
        self::$regExps['replacements']="/\t\s*(.*?)\s*".self::$__rightTplSep."/";
        if (!empty(self::$funcs))  
            self::$regExps['functions']='/\%(' . implode('|', self::$funcs) . ')\b/';
    }
    
    //
    // Main methods
    //
    public static function setLocaleStrings($l)
    {
        self::$__locale=self::merge(self::$__locale, $l);
    }
    
    public static function setTemplateSeparators($left=false, $right=false)
    {
        if ($left)
            self::$__leftTplSep=$left;
        if ($right)
            self::$__rightTplSep=$right;
            
        if ($right)
            // recompute it
            self::$regExps['replacements']="/\t\s*(.*?)\s*".self::$__rightTplSep."/";
    }
    
    public static function setCacheDir($dir)
    {
        self::$__cacheDir=rtrim($dir,'/').'/';
    }
    
    public static function setCacheMode($mode)
    {
        self::$__cacheMode=$mode;
    }
    
    // add templates manually
    public static function add($tpls=array())
    {
        self::$__templates=self::merge(self::$__templates, $tpls);
    }
    
    public static function tpl($id, $data=null)
    {
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        if (!isset(self::$__cache[$id]))
            self::$__cache[$id]=self::getCachedTemplate($id);
        
        $tpl=self::$__cache[$id];
        
        // Provide some basic currying to the user
        if ($data)
            return $tpl->render( $data );
        else
            return $tpl;
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
        if (self::$loopifs==self::$loops)
        {
            self::$loops--;
            self::$loopifs--;
            return "'; } } ";
        }
        self::$loops--;
        return "'; } ";
    }
    
    // include, same as embed right now
    public static function t_include($id/*, $data*/)
    {
        return self::t_embed($id);
    }
    
    // embed
    public static function t_embed($id/*, $data*/)
    {
        // cache it
        if (!isset(self::$__partials[$id]))
            self::$__partials[$id]=" " . self::parse(self::getTemplateContents($id)) . "'; ";
        return self::$__partials[$id];
    }
    
    //
    // Basic template functions
    //
    
    // echo
    public static function e($e)
    {
        return ($e);
    }
    
    // to String
    public static function s($e)
    {
        return strval($e);
    }
    
    // to Integer
    public static function n($e)
    {
        return intval($e);
    }
    
    // to Float
    public static function f($e)
    {
        return floatval($e);
    }
    
    // Concatenate strings/vars
    public static function concat()
    {
        $args=func_get_args();
        return implode('', $args);
    }
    
    //
    //  Localization functions
    //
    public static function locale($e)
    {
        if (isset(self::$__locale[$e]))
            return self::$__locale[$e];
        return $e;
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
                case 'embed':
                case 'include':
                    return /*"\t" .*/ self::t_embed($m[2]);
                    break;
            }
        }
        return $m[0];
    }
    
    protected static function parseControlConstructs($s) 
    {
        $s = str_replace(self::$__rightTplSep, "\n", $s); /*implode("\n", explode(self::$__rightTplSep, $s));*/
        $s = preg_replace_callback(self::$regExps['controlConstructs'], array(__CLASS__, 'doControlConstruct'), $s);
        $s = str_replace("\n", self::$__rightTplSep, $s); /*implode(self::$__rightTplSep, explode("\n", $s));*/
        return $s;
    }
    
    protected static function parse($s) 
    {
        $s = preg_replace(self::$regExps['specials'], " ", $s);
        $s = str_replace(self::$__leftTplSep, "\t", $s); /*implode("\t", explode(self::$__leftTplSep, $s));*/
        $s = preg_replace(self::$regExps['quotes'], "\\'", $s);
        // preserve lines
        $s = str_replace("\n", "' . PHP_EOL . '", $s); /*implode("' . PHP_EOL . '", explode("\n", $s));*/
        $s = self::parseControlConstructs($s);
        if (!empty(self::$funcs))  $s = preg_replace(self::$regExps['functions'], self::$__class.'::${1}', $s);
        $s = preg_replace(self::$regExps['replacements'], "' . ( $1 ) . '", $s);
        $s = str_replace("\t", "'; ", $s); /*implode("'; ", explode("\t", $s));*/
        $s = str_replace(self::$__rightTplSep, " \$__p__ .= '", $s); /*implode(" \$__p__ .= '", explode(self::$__rightTplSep, $s));*/
        // remove unnecessary concats
        //$s = str_replace(array("'' .", ". ''"),  "", $s); /*implode("' . PHP_EOL . '", explode("\n", $s));*/
        
        return $s;
    }
    
    public static function getTemplateContents($id)
    {
        if (isset(self::$__templates[$id]) && is_file(self::$__templates[$id]))
        {
            return file_get_contents(self::$__templates[$id]);
        }
        return '';
    }
    
    protected static function getCachedTemplateName($id)
    {
        return self::$__cacheDir . str_replace(array('-', ' '), '_', $id) . '.tpl.php';
    }
    
    protected static function getCachedTemplateClass($id)
    {
        return 'Contemplate_' . str_replace(array('-', ' '), '_', $id) . '_Cached';
    }
    
    protected static function createTemplateRenderFunction($id)
    {
        self::reset();
        
        $func=
            // Introduce the data as local variables using extract()
            "extract(".self::$__class."::o2a((array)\$__o__)); "
            ."\$__p__ = ''; "
            // Convert the template into pure PHP
            ."\$__p__ .= '" .  self::parse(self::getTemplateContents($id)) .  "'; "
            ."return \$__p__;"
            ;
        //echo self::log($func);
        $fn = create_function('$__o__', $func);
        return $fn;
    }
    
    protected static function createCachedTemplate($id, $filename, $classname)
    {
        self::reset();
        
        $class=
            // Introduce the data as local variables using extract()
            '<?php ' .PHP_EOL
            ."/* ".self::$__class." cached template '$id' */ " . PHP_EOL
            ."if (!class_exists('" . $classname . "')) { "
            ."final class " . $classname . " extends ".self::$__class." { "
            ."public function __construct(\$id=null) { \$this->id=\$id; } "
            ."public function render(\$__o__) { "
            ."extract(".self::$__class."::o2a((array)\$__o__)); "
            ."\$__p__ = ''; "
            // Convert the template into pure PHP
            ."\$__p__ .= '" .  self::parse(self::getTemplateContents($id)) .  "'; "
            ."return \$__p__;"
            ."} } }"
            ;
        return self::setCachedTemplate($filename, $class);
    }
    
    protected static function getCachedTemplate($id)
    {
        switch(self::$__cacheMode)
        {
            case self::CACHE_TO_DISK_NOUPDATE:
                $cachedTplFile=self::getCachedTemplateName($id);
                $cachedTplClass=self::getCachedTemplateClass($id);
                if (!is_file($cachedTplFile))
                {
                    self::createCachedTemplate($id, $cachedTplFile, $cachedTplClass);
                }
                if (is_file($cachedTplFile))
                {
                    include($cachedTplFile);
                    $tpl = new $cachedTplClass();
                    $tpl->setId($id);
                    return $tpl;
                }
                return null;
                break;
            
            case self::CACHE_TO_DISK_AUTOUPDATE:
                $cachedTplFile=self::getCachedTemplateName($id);
                $cachedTplClass=self::getCachedTemplateClass($id);
                if (!is_file($cachedTplFile) || (filemtime($cachedTplFile) <= filemtime(self::$__templates[$id])))
                {
                    // if tpl not exist or is out-of-sync re-create it
                    self::createCachedTemplate($id, $cachedTplFile, $cachedTplClass);
                }
                if (is_file($cachedTplFile))
                {
                    include($cachedTplFile);
                    $tpl = new $cachedTplClass();
                    $tpl->setId($id);
                    return $tpl;
                }
                return null;
                break;
            
            case self::CACHE_TO_DISK_NONE:
            default:
                // dynamic in-memory caching during page-request
                //return new Contemplate($id, self::createTemplateRenderFunction($id));
                $thisclass=self::$__class;
                $tpl = new $thisclass();
                $tpl->setId($id);
                $tpl->setRenderFunction(self::createTemplateRenderFunction($id));
                return $tpl;
                break;
        }
        return null;
    }
    
    protected static function setCachedTemplate($filename, $tplContents)
    {
        return file_put_contents($filename, $tplContents);
    }
    
    protected static function reset()
    {
        // reset parse counters
        self::$loops=0;
        self::$ifs=0;
        self::$loopifs=0;
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
    
    protected static function merge()
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
    
    public static function log($m)
    {
        return '<pre>' . print_r($m, true) . '</pre>';
    }
}

// init the engine
//require dirname(__FILE__) .'/Escaper.php';
Contemplate::init(/*new Escaper('utf-8')*/);

}
