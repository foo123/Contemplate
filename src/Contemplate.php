<?php
if (!class_exists('Contemplate'))
{
    /*
    *  Simple light-weight php templating engine (part of javascript templating engine)
    *  @author: Nikos M.  http://nikos-web-development.netai.net/
    *  https://github.com/foo123/Contemplate
    *  version 0.4
    *
    *  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed
    *  http://ejohn.org/blog/javascript-micro-templating/
    *
    */
    
class Contemplate
{
    const CACHE_TO_DISK_NONE = 0;
    const CACHE_TO_DISK_AUTOUPDATE = 2;
    const CACHE_TO_DISK_NOUPDATE = 4;
    
    protected static $__cacheDir='./';
    protected static $__cacheMode=0;
    protected static $__cache=array();
    protected static $__templates=array();
    protected static $__partials=array();
    protected static $__locale=array();
    protected static $__leftTplSep="<%";
    protected static $__rightTplSep="%>";
    protected static $__preserveLines="' . PHP_EOL . '";
    
    protected static $__stack=array();
    protected static $loops=0;
    protected static $ifs=0;
    protected static $loopifs=0;
    protected static $blocks=array();
    protected static $allblocks=array();
    protected static $blockcnt=0;
    protected static $__extends=null;
    
    protected static $regExps=array(
        'functions'=>'',
        'controlConstructs'=>'',
        'forExpr'=>'',
        'quotes'=>'',
        'specials'=>'',
        'replacements'=>''
    );
    
    protected static $__class='';
    
    protected static $controlConstructs=array(
        'if', 'elseif', 'else', 'endif', 
        'for', 'elsefor', 'endfor',
        'include', 'template', 'extends', 'block', 'endblock',
        'htmlselect', 'htmltable'
    );
    protected static $funcs=array( 'html', 'url', 'count', 'concat', 'ltrim', 'rtrim', 'trim', 'sprintf', 'now', 'date', 'ldate', 'q', 'dq', 'l', 's', 'n', 'f' );
    
    // instance properties (when no caching is used)
    public $id=null;
    public $data=null;
    protected $_renderFunction=null;
    protected $_parent=null;
    protected $_blocks=null;
    
    
    //
    //  Instance template methods
    //
    public function __construct($id=null, $renderFunc=null)
    {
        $this->id=null; $this->data=null; $this->_renderFunction=null; $this->_parent=null; $this->_blocks=null;
        if ($id) { $this->id=$id; $this->_renderFunction=$renderFunc; }
    }
    
    public function setId($id=null) { if ($id) $this->id=$id; return $this; }
	
    public function setParent($parent) { $this->_parent=$parent; return $this; }
    
    public function setBlocks($blocks) { if (!$this->_blocks) $this->_blocks=array(); $this->_blocks=self::merge($this->_blocks, $blocks); return $this; }
    
    public function setRenderFunction($renderFunc=null) { if ($renderFunc) $this->_renderFunction=$renderFunc; return $this; }
	
    public function renderBlock($block, $__instance__=null)
    {
        if (!$__instance__) $__instance__=$this;
        if ($this->_blocks && isset($this->_blocks[$block])) {$blockfunc=$this->_blocks[$block]; return $blockfunc( $__instance__ );}
        elseif ($this->_parent) {return $this->_parent->renderBlock($block, $__instance__);}
        return '';
    }
    
    public function render($data, $__instance__=null) 
    {
        $out=''; if (!$__instance__) $__instance__=$this;
        if ($this->_parent) 
        { 
            $out=$this->_parent->render($data, $__instance__); 
        }
        elseif ($this->_renderFunction)
        {
            /* dynamic function */
            $__instance__->data=self::o2a($data); $renderFunction=$this->_renderFunction;  $out=$renderFunction( $__instance__ );
        }
        $this->data=null;
        return $out;
	}
    
    public static function init()
    {
        self::$__class='Contemplate'; // __CLASS__;
        self::$regExps['controlConstructs']='/\t\s*\%(' . implode('|', self::$controlConstructs) . ')\b\s*\((.*)\)/';
        self::$regExps['forExpr']='/^\s*\$([a-z0-9_]+?)\s* as \s*\$([a-z0-9_]+?)\s*=>\s*\$([a-z0-9_]+)\s*$/i';
        self::$regExps['quotes']="/'/";
        self::$regExps['specials']="/[\r\t]/";
        self::$regExps['replacements']="/\t\s*(.*?)\s*".self::$__rightTplSep."/";
        if (!empty(self::$funcs)) self::$regExps['functions']='/\%(' . implode('|', self::$funcs) . ')\b/';
    }
    
    //
    // Main methods
    //
    public static function setLocaleStrings($l) { self::$__locale=self::merge(self::$__locale, $l); }
    
    public static function setTemplateSeparators($left=false, $right=false)
    {
        if ($left) self::$__leftTplSep=$left;
        if ($right) self::$__rightTplSep=$right;
        // recompute it
        if ($right) self::$regExps['replacements']="/\t\s*(.*?)\s*".self::$__rightTplSep."/";
    }
    
    public static function setPreserveLines($bool=true) { if ($bool)  self::$__preserveLines="' . PHP_EOL . '";  else self::$__preserveLines=""; }
    
    public static function setCacheDir($dir) {  self::$__cacheDir=rtrim($dir,'/').'/'; }
    
    public static function setCacheMode($mode) { self::$__cacheMode=$mode; }
    
    // add templates manually
    public static function add($tpls=array()) { self::$__templates=self::merge(self::$__templates, $tpls); }
    
    public static function tpl($id, $data=null)
    {
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        if (!isset(self::$__cache[$id]))   self::$__cache[$id]=self::getCachedTemplate($id);
        
        $tpl=self::$__cache[$id];
        
        // Provide some basic currying to the user
        if ($data)  return $tpl->render( $data );
        else  return $tpl;
    }
    
    //
    // Control structures
    //
    
    // if
    public static function t_if($cond='false') {  self::$ifs++;  return "'; if ($cond) { "; }
    // elseif    
    public static function t_elseif($cond='false') { return "'; } elseif ($cond) { "; }
    // else
    public static function t_else() { return "'; } else { ";  }
    // endif
    public static function t_endif() { self::$ifs--;  return "'; } ";  }
    // for, foreach
    public static function t_for($for_expr) 
    {
        self::$loops++;  self::$loopifs++;
        preg_match(self::$regExps['forExpr'], $for_expr, $m);
        $o="\$${m[1]}"; $k="\$${m[2]}"; $v="\$${m[3]}";
        return "'; if (!empty($o)) { foreach ($o as $k=>$v) { \$__instance->data['".$m[2]."']=$k; \$__instance->data['".$m[3]."']=$v; ";
    }
    // elsefor
    public static function t_elsefor() { /* else attached to  for loop */ self::$loopifs--;  return "'; } } else { "; }
    // endfor
    public static function t_endfor() 
    {
        if (self::$loopifs==self::$loops) { self::$loops--; self::$loopifs--;  return "'; } } ";  }
        self::$loops--;  return "'; } ";
    }
    // include file
    public static function t_include($id) 
    { 
        /* cache it */ 
        if (!isset(self::$__partials[$id]))
        {
            //self::pushState();
            self::$__partials[$id]=" " . self::parse(self::getTemplateContents($id), false) . "'; ";
            //self::popState();
        }
        return self::$__partials[$id];
    }
    // include template
    public static function t_template($args)
    {
        $args=explode(',', $args); $id=trim(array_shift($args));
        $obj=str_replace(array(self::$__preserveLines, '{', '}', '[', ']'), array('', 'array(', ')','array(', ')'), implode(',', $args));
        return '\' . '.self::$__class.'::tpl("'.$id.'", '.$obj.'); ';
    }
    // extend another template
    public static function t_extends($tpl) { self::$__extends=$tpl; return "'; "; }
    // define (overridable) block
    public static function t_block($block) { self::$allblocks[]=$block; self::$blockcnt++; array_push(self::$blocks,$block); return "' .  __{{".$block."}}__ ";  }
    // end define (overridable) block
    public static function t_endblock() { if (self::$blockcnt) {self::$blockcnt--; return " __{{/".array_pop(self::$blocks)."}}__ ";}  return '';  }
    // render html table
    public static function t_table($args)
    {
        $obj=str_replace(array(self::$__preserveLines, '{', '}', '[', ']'), array('', 'array(', ')','array(', ')'), $args);
        return '\' . '.self::$__class.'::htmltable('.$obj.'); ';
    }
    // render html select
    public static function t_select($args)
    {
        $obj=str_replace(array(self::$__preserveLines, '{', '}', '[', ']'), array('', 'array(', ')','array(', ')'), $args);
        return '\' . '.self::$__class.'::htmlselect('.$obj.'); ';
    }
    
    //
    // Basic template functions
    //
    
    // basic html escaping
    public static function html($s) { return htmlentities($s, ENT_COMPAT, 'UTF-8'); }
    // basic url escaping
    public static function url($s) { return urlencode($s); }
    // count items in array
    public static function count($a) { return count($a); }
    // quote
    public static function q($e) { return "'".$e."'"; }
    // double quote
    public static function dq($e) { return '"'.$e.'"'; }
    // to String
    public static function s($e) { return strval($e); }
    // to Integer
    public static function n($e) { return intval($e); }
    // to Float
    public static function f($e) { return floatval($e); }
    // Concatenate strings/vars
    public static function concat() { $args=func_get_args(); return implode('', $args); }
    // Trim strings in templates
    public static function trim() { $args=func_get_args(); if (isset($args[1])) return trim($args[0], $args[1]); else return trim($args[0]); }
    public static function ltrim() { $args=func_get_args();  if (isset($args[1])) return ltrim($args[0], $args[1]); else return ltrim($args[0]); }
    public static function rtrim() { $args=func_get_args();  if (isset($args[1])) return rtrim($args[0], $args[1]); else return rtrim($args[0]); }
    // Sprintf in templates
    public static function sprintf() { $args=func_get_args(); $format=array_shift($args); return vsprintf($format, $args); }
    
    //
    //  Localization functions
    //
    
    // current time in seconds
    public static function now() { return time(); }
    // formatted date
    public static function date($format, $time=false) { if (!$time) $time=time(); return date($format, $time); }
    // localized formatted date
    public static function ldate($format, $time=false) { if (!$time) $time=time(); return self::localized_date(self::$__locale, $format, $time);  }
    public static function locale($e) { return (isset(self::$__locale[$e])) ? self::$__locale[$e] : $e; }
    public static function l($e) { return self::locale($e); }
    
    //
    //  HTML elements
    //
    
    // html table
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
        return $o;
    }
    
    // html select
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
                        
                    if (/*isset($options['selected'][$k2])*/ array_key_exists($k2, $options['selected']))
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
                case 'if': return self::t_if($m[2]);  break;
                case 'elseif': return self::t_elseif($m[2]); break;
                case 'else': return self::t_else($m[2]);  break;
                case 'endif': return self::t_endif($m[2]);  break;
                case 'for': return self::t_for($m[2]);  break;
                case 'elsefor': return self::t_elsefor($m[2]); break;
                case 'endfor': return self::t_endfor($m[2]); break;
                case 'template': return self::t_template($m[2]); break;
                case 'extends': return self::t_extends($m[2]); break;
                case 'block': return self::t_block($m[2]); break;
                case 'endblock': return self::t_endblock($m[2]); break;
                case 'include': return self::t_include($m[2]); break;
                case 'htmltable': return self::t_table($m[2]); break;
                case 'htmlselect': return self::t_select($m[2]); break;
            }
        }
        return $m[0];
    }
    
    protected static function doBlocks($s) 
    {
        $blocks=array(); $bl=count(self::$allblocks);
        while ($bl--)
        {
            $block=array_pop(self::$allblocks);
            $delim1='__{{'.$block.'}}__'; $delim2='__{{/'.$block.'}}__'; 
            $len1=strlen($delim1); $len2=$len1+1; 
            $pos1=strpos($s, $delim1); $pos2=strpos($s, $delim2)-$pos1+$len2;
            $code=substr($s, $pos1, $pos2);
            if (!empty($code))
            {
                $s=str_replace($code, " \$__instance__->renderBlock('".$block."'); ", $s);
                $code=str_replace(array(". '' .", ". '';"), array('.', ';'), substr($code, $len1, -$len2)); // remove redundant code
                $blocks[$block]="\$__p__ = ''; extract(\$__instance__->data); " .  $code .  "'; return \$__p__;";
            }
        }
        return array(str_replace(array(". '' .", ". '';"), array('.', ';'), $s), $blocks);
    }
    
    protected static function parseControlConstructs($s) 
    {
        $s = str_replace(self::$__rightTplSep, "\n", $s);
        $s = preg_replace_callback(self::$regExps['controlConstructs'], array(__CLASS__, 'doControlConstruct'), $s);
        $s = str_replace("\n", self::$__rightTplSep, $s);
        return $s;
    }
    
    protected static function parse($s, $withblocks=true) 
    {
        $s = preg_replace(self::$regExps['specials'], " ", $s);
        $s = str_replace(self::$__leftTplSep, "\t", $s);
        $s = preg_replace(self::$regExps['quotes'], "\\'", $s);
        $s = str_replace("\n", self::$__preserveLines, $s); // preserve lines
        $s = self::parseControlConstructs($s);
        if (!empty(self::$funcs))  $s = preg_replace(self::$regExps['functions'], self::$__class.'::${1}', $s);
        $s = preg_replace(self::$regExps['replacements'], "' . ( $1 ) . '", $s);
        $s = str_replace("\t", "'; ", $s);
        $s = str_replace(self::$__rightTplSep, " \$__p__ .= '", $s);
        if ($withblocks)  return self::doBlocks($s);
        return str_replace(array(". '' .", ". '';"), array('.', ';'), $s); // remove redundant code
    }
    
    public static function getTemplateContents($id)
    {
        if (isset(self::$__templates[$id]) && is_file(self::$__templates[$id]))   return file_get_contents(self::$__templates[$id]);
        return '';
    }
    
    protected static function getCachedTemplateName($id) { return self::$__cacheDir . str_replace(array('-', ' '), '_', $id) . '.tpl.php'; }
    
    protected static function getCachedTemplateClass($id) { return 'Contemplate_' . str_replace(array('-', ' '), '_', $id) . '_Cached';  }
    
    protected static function createTemplateRenderFunction($id)
    {
        self::resetState();
        $blocks=self::parse(self::getTemplateContents($id));
        $func=
            // Introduce the data as local variables using extract()
            "\$__p__ = '';  extract(\$__instance__->data); \$__p__ .= '" .  $blocks[0] .  "'; return \$__p__;"
            ;
        $fn = create_function('$__instance__', $func);
        $blockfns=array();  foreach ($blocks[1] as $b=>$bc) {$blockfns[$b] = create_function('$__instance__', $bc);}
        return array($fn, $blockfns);
    }
    
    protected static function createCachedTemplate($id, $filename, $classname)
    {
        self::resetState();
        $blocks=self::parse(self::getTemplateContents($id));
        // defined blocks
        $sblocks=array();
        foreach ($blocks[1] as $b=>$bc)  $sblocks[]="private function _blockfn_".$b."(\$__instance__) { " . $bc . "}";
        $sblocks=implode(' ', $sblocks);
        $parentCode='';
        if (self::$__extends) $parentCode="\$this->setParent(".self::$__class."::tpl('".self::$__extends."'));";
        $class=
            '<?php ' .PHP_EOL
            ."/* ".self::$__class." cached template '$id' */ " . PHP_EOL
            ."if (!class_exists('" . $classname . "')) { "
            ."final class " . $classname . " extends ".self::$__class." { "
            ."public function __construct(\$id=null, \$_r=null) { \$this->id=null; \$this->data=null; \$this->_renderFunction=null; \$this->_parent=null;  \$this->_blocks=null; \$this->id=\$id; ".$parentCode." } "
            .$sblocks." " // defined blocks
            ."public function renderBlock(\$block, \$__instance__=null) { "
            ."if(!\$__instance__) \$__instance__=\$this; \$method='_blockfn_'.\$block; "
            ."if (method_exists(\$this, \$method)) { return \$this->{\$method}(\$__instance__); } "
            ."elseif (\$this->_parent) { return \$this->_parent->renderBlock(\$block, \$__instance__); } "
            ."return ''; } "
            ."public function render(\$__data__, \$__instance__=null) { "
            ."\$__p__ = ''; if(!\$__instance__) \$__instance__=\$this; "
            ."if (\$this->_parent) {\$__p__=\$this->_parent->render(\$__data__, \$__instance__);} "
            ."else { \$__instance__->data=".self::$__class."::o2a((array)\$__data__); "
            // Introduce the data as local variables using extract()
            ."extract(\$__instance__->data); \$__p__ .= '" .  $blocks[0] .  "';} "
            ."\$this->data=null; return \$__p__;} } }"
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
                    include($cachedTplFile);  $tpl = new $cachedTplClass();
                    $tpl->setId($id); return $tpl;
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
                    include($cachedTplFile);  $tpl = new $cachedTplClass();
                    $tpl->setId($id);  return $tpl;
                }
                return null;
                break;
            
            case self::CACHE_TO_DISK_NONE:
            default:
                // dynamic in-memory caching during page-request
                //return new Contemplate($id, self::createTemplateRenderFunction($id));
                $thisclass=self::$__class; $tpl = new $thisclass(); $tpl->setId($id);
                $fns=self::createTemplateRenderFunction($id);
                $tpl->setRenderFunction($fns[0]); $tpl->setBlocks($fns[1]);
                if (self::$__extends) $tpl->setParent(self::tpl(self::$__extends));
                return $tpl;
                break;
        }
        return null;
    }
    
    protected static function setCachedTemplate($filename, $tplContents) { return file_put_contents($filename, $tplContents); }
    
    protected static function pushState() 
    {
        array_push(self::$__stack, array('loops'=>self::$loops, 'loopifs'=>self::$loopifs, 'ifs'=>self::$ifs, 'blockcnt'=>self::$blockcnt, 'blocks'=>self::$blocks, 'allblocks'=>$allblocks, 'extends'=>self::$__extends));
        // reset state
        self::$loops=0;  self::$ifs=0;  self::$loopifs=0;
        self::$blockcnt=0; self::$blocks=array();  self::$allblocks=array();  self::$__extends=null;
    }
    
    protected static function popState() 
    {
        $state=array_pop(self::$__stack);
        self::$loops=$state['loops']; self::$ifs=$state['ifs'];  self::$loopifs=$state['loopifs'];
        self::$blockcnt=$state['blockcnt']; self::$blocks=$state['blocks'];  self::$allblocks=$state['allblocks'];  self::$__extends=$state['extends'];
    }
    
    protected static function resetState() 
    {
        // reset state
        self::$loops=0; self::$ifs=0; self::$loopifs=0;
        self::$blockcnt=0; self::$blocks=array();  self::$allblocks=array();  self::$__extends=null;
    }
    
    protected static function localized_date($locale, $format, $timestamp) 
    {
        $txt_words = array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
        $am_pm=array('AM', 'PM', 'am', 'PM');
        $date=date($format, $timestamp);
        
        // localize days/months
        $replace=array();
        foreach ($txt_words as $word) { if (isset($locale[$word])) $replace[$word]=$locale[$word]; }
        if (!empty($replace))  $date=str_replace(array_keys($replace), array_values($replace), $date);
            
        // localize am/pm
        $replace=array();
        foreach ($am_pm as $word) { if (isset($locale[$word]))  $replace[$word]=$locale[$word];  }
        if (!empty($replace))  $date=str_replace(array_keys($replace), array_values($replace), $date);
            
        // return localized date
        return $date;
    }
    
    public static function o2a($d)
    {
        if (is_object($d)) { $d=array_merge(array(), (array)$d); }
        if (is_array($d)) { foreach ($d as $k=>$v) { if (is_object($v) || is_array($v)) $d[$k]=self::o2a($v); } }
        return $d;
    }
    
    public static function merge()
    {
        if (func_num_args() < 1) return;
        $arrays = func_get_args(); $merged = array_shift($arrays); $isTargetObject=false;
        if (is_object($merged)) { $isTargetObject=true; $merged=(array)$merged; }
        
        foreach ($arrays as $arr)
        {
            $isObject=false;
            if (is_object($arr)) { $isObject=true; $arr=(array)$arr; }
                
            foreach($arr as $key => $val)
            {
                if(array_key_exists($key, $merged) && (is_array($val) || is_object($val)))
                {
                    $merged[$key] = self::merge($merged[$key], $arr[$key]);
                    if (is_object($val))  $merged[$key]=(object)$merged[$key];
                }
                else  $merged[$key] = $val;
            }
        }
        if ($isTargetObject) { $isTargetObject=false; $merged=(object)$merged; }
        return $merged;
    }
    
    /*public static function tpl($template, array $args=array())
    {
        if ( isset(self::$__templates__[$template]) )  $template_path = self::$__templates__[$template];
        else return '';
        
        if (!$template_path || !is_file($template_path)) { printf('File "%s" doesn\'t exist!', $template_path);  return ''; }
        return self::getTpl($template_path, $args);
    }
    
    private static function getTpl($______templatepath________, array $______args______=array())
    {
        if (!empty($______args______)) extract($______args______);
        ob_start(); include($______templatepath________); return ob_get_clean();
    }*/
    
    public static function log($m) {  return '<pre>' . print_r($m, true) . '</pre>'; }
    public static function debug($m) {  return file_put_contents(dirname(__FILE__).'/debug.log', print_r($m, true).PHP_EOL, FILE_APPEND); }
}

// init the engine
Contemplate::init();

}
