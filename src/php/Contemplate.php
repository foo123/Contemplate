<?php
/**
*  Contemplate
*  Light-weight Template Engine for PHP, Python, Node and client-side JavaScript
*
*  @version: 0.5.4
*  https://github.com/foo123/Contemplate
*
*  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed
*  http://ejohn.org/blog/javascript-micro-templating/
*
**/
if (!class_exists('Contemplate'))
{

class Contemplate
{
    const VERSION = "0.5.4";
    
    const CACHE_TO_DISK_NONE = 0;
    const CACHE_TO_DISK_AUTOUPDATE = 2;
    const CACHE_TO_DISK_NOUPDATE = 4;
    
    private static $ALPHA = '/^[a-zA-Z_]/';
    private static $NUM = '/^[0-9]/';
    private static $ALPHANUM = '/^[a-zA-Z0-9_]/';
    private static $SPACE = '/^\\s/';
    
    private static $__isInited = false;
    private static $__cacheDir = './';
    private static $__cacheMode = 0;
    private static $__cache = array();
    private static $__templates = array();
    private static $__inlines = array();
    private static $__partials = array();
    private static $__locale = array();
    private static $__plurals = array();
    
    private static $__leftTplSep = "<%";
    private static $__rightTplSep = "%>";
    private static $__preserveLinesDefault = "' . \"\\n\" . '";
    private static $__preserveLines = '';
    private static $__EOL = "\n";
    private static $__TEOL = PHP_EOL;
    private static $__tplStart = '';
    private static $__tplEnd = '';
    private static $__tplPrefixCode = '';
    
    private static $__pad = "    ";
    private static $__level = 0;
    private static $__loops = 0;
    private static $__ifs = 0;
    private static $__loopifs = 0;
    private static $__blocks = array();
    private static $__allblocks = array();
    private static $__blockcnt = 0;
    private static $__extends = null;
    private static $__stack = null;
    private static $__uuid = 0;
    
    private static $__regExps = array(
        'specials' => null,
        'replacements' => null,
        'functions' => null,
        'controls' => null,
        'controls2' => null
    );
    
    private static $__controlConstructs = array(
        'include', 'template', 
        'extends', 'endblock', 'block',
        'elsefor', 'endfor', 'for',
        'set', 'unset', 'isset',
        'elseif', 'else', 'endif', 'if'
    );
    
    private static $__funcs = array( 
        'htmlselect', 'htmltable',
        'plugin_([a-zA-Z0-9_]+)', 'haskey', 
        'lowercase', 'uppercase', 'camelcase', 'snakecase', 'pluralise',
        'concat', 'ltrim', 'rtrim', 'trim', 'sprintf', 'addslashes', 'stripslashes',
        'tpl', 'uuid',
        'html', 'url', 'count', 
        'ldate', 'date', 'now', 'locale',
        'dq', 'q', 'l', 's', 'n', 'f' 
    );
    
    private static $__plugins = array();
    
    // generated tpl class code as a heredoc template
    private static $__tplClassCode = '';
    
    // generated tpl block method code as a heredoc template
    private static $__tplBlockCode = '';
    
    // generated IF code
    private static $__IF = '';
    
    // generated ELSEIF code
    private static $__ELSEIF = '';

    // generated ELSE code
    private static $__ELSE = '';
    
    // generated ENDIF code
    private static $__ENDIF = '';
    
    // generated FOR code
    private static $__FOR = '';
    
    // generated ELSEFOR code
    private static $__ELSEFOR = '';
    
    // generated ENDFOR code
    private static $__ENDFOR1 = '';
    
    // generated ENDFOR code
    private static $__ENDFOR2 = '';
    
    // generated block code snippet
    private static $__DOBLOCK = '';

    // generated dynamic render code
    private static $__TFUNC1 = '';

    // generated dynamic render code
    private static $__TFUNC2 = '';

    private static $__RCODE1 = '';
    
    private static $__RCODE2 = '';
    
    
    //
    //
    // instance properties (when no caching is used)
    public $id = null;
    public $data = null;
    protected $_renderFunction = null;
    protected $_parent = null;
    protected $_blocks = null;
    
    
    //
    //  Instance template methods
    //
    public function __construct($id=null, $renderFunc=null)
    {
        $this->id = null; 
        $this->data = null; 
        $this->_renderFunction = null; 
        $this->_parent = null; 
        $this->_blocks = null;
        if ( $id ) 
        { 
            $this->id = $id; 
            $this->_renderFunction = $renderFunc; 
        }
    }
    
    public function setId($id=null) 
    { 
        if ( $id ) $this->id = $id; 
        return $this; 
    }
    
    public function setParent($parent) 
    { 
        if ( $parent )
        {
            if ( is_string($parent) )
                $this->_parent = Contemplate::tpl( $parent );
            else
                $this->_parent = $parent; 
        }
        return $this; 
    }
    
    public function setBlocks($blocks) 
    { 
        if ( !$this->_blocks ) $this->_blocks = array(); 
        $this->_blocks = self::merge( $this->_blocks, $blocks ); 
        return $this; 
    }
    
    public function setRenderFunction($renderFunc=null) 
    { 
        if ( $renderFunc ) $this->_renderFunction = $renderFunc; 
        return $this; 
    }
    
    public function renderBlock($block, $__instance__=null)
    {
        if ( !$__instance__ ) $__instance__ = $this;
        
        if ( $this->_blocks && isset($this->_blocks[$block]) ) 
        {
            $blockfunc = $this->_blocks[$block]; 
            return $blockfunc( $__instance__ );
        }
        elseif ( $this->_parent ) 
        {
            return $this->_parent->renderBlock($block, $__instance__);
        }
        
        return '';
    }
    
    public function render($data, $__instance__=null) 
    {
        $__p__ = ''; 
        if ( !$__instance__ ) $__instance__ = $this;
        
        if ( $this->_parent ) 
        { 
            $__p__ = $this->_parent->render($data, $__instance__); 
        }
        elseif ( $this->_renderFunction )
        {
            /* dynamic function */
            $__instance__->data = self::data( $data ); 
            $renderFunction = $this->_renderFunction;  
            $__p__ = $renderFunction( $__instance__ );
        }
        
        $this->data = null;
        return $__p__;
    }
    
    //
    //
    //
    
    public static function init()
    {
        if ( self::$__isInited ) return;
        
        self::$__stack = array();
        
        self::$__tplClassCode = <<<_T0_
__{{PREFIX_CODE}}__
/* Contemplate cached template '__{{ID}}__' */
if (!class_exists('__{{CLASSNAME}}__'))
{
final class __{{CLASSNAME}}__ extends Contemplate
{    
    /* constructor */
    public function __construct(\$id=null, \$__=null)
    {
        /* initialize internal vars */
        \$this->id = null; 
        \$this->data = null;
        \$this->_renderFunction = null;
        \$this->_parent = null;
        \$this->_blocks = null;
        
        \$this->id = \$id;
        
        /* parent tpl assign code starts here */
__{{PARENTCODE}}__
        /* parent tpl assign code ends here */
    }    
    
    /* tpl-defined blocks render code starts here */
__{{BLOCKS}}__
    /* tpl-defined blocks render code ends here */
    
    /* render a tpl block method */
    public function renderBlock(\$block, \$__instance__=null)
    {
        if ( !\$__instance__ ) \$__instance__ = \$this;
        
        \$method = '_blockfn_' . \$block;
        
        if ( method_exists(\$this, \$method) ) return \$this->{\$method}(\$__instance__);
        
        elseif ( \$this->_parent ) return \$this->_parent->renderBlock(\$block, \$__instance__);
        
        return '';
    }
    
    /* tpl render method */
    public function render(\$data, \$__instance__=null)
    {
        \$__p__ = '';
        if ( !\$__instance__ ) \$__instance__ = \$this;
        
        if ( \$this->_parent )
        {
            \$__p__ = \$this->_parent->render(\$data, \$__instance__);
        }
        else
        {
            /* tpl main render code starts here */
__{{RENDERCODE}}__
            /* tpl main render code ends here */
        }
        \$this->data = null;
        return \$__p__;
    }
}
}
_T0_;
    
        // generated tpl block method code as a heredoc template
        self::$__tplBlockCode = <<<_T1_

/* tpl block render method for block '__{{BLOCK}}__' */
private function __{{BLOCKMETHOD}}__(\$__instance__) 
{ 
__{{BLOCKMETHODCODE}}__
}
_T1_;
    
        // generated IF code
        self::$__IF = <<<_T2_

if ( __{{COND}}__ )
{

_T2_;
    
        // generated ELSEIF code
        self::$__ELSEIF = <<<_T3_
        
}
elseif ( __{{COND}}__ )
{

_T3_;

        // generated ELSE code
        self::$__ELSE = <<<_T4_
        
}
else
{

_T4_;
    
        // generated ENDIF code
        self::$__ENDIF = <<<_T5_
        
}

_T5_;
    
        // generated FOR code
        self::$__FOR = <<<_T6_

__{{O}}__ = __{{FOR_EXPR_O}}__;
if ( !empty(__{{O}}__) )
{
    foreach ( __{{O}}__ as __{{K}}__=>__{{V}}__ )
    {
        __{{ASSIGN1}}__
        __{{ASSIGN2}}__
_T6_;
    
        // generated ELSEFOR code
        self::$__ELSEFOR = <<<_T7_
        
    }
}
else
{    
    
_T7_;
    
        // generated ENDFOR code
        self::$__ENDFOR1 = <<<_T8_
            
    }
}

_T8_;
    
        // generated ENDFOR code
        self::$__ENDFOR2 = <<<_T9_
        
}

_T9_;
    
        // generated block code snippet
        self::$__DOBLOCK = <<<_DO_BLOCK_
\$__p__ = '';
__{{CODE}}__
return \$__p__;
_DO_BLOCK_;

    
        // generated dynamic render code
        self::$__TFUNC1 = "return '';";

        // generated dynamic render code
        self::$__TFUNC2 = <<<_TPL_FUNC_
\$__p__ = '';  
__{{CODE}}__
return \$__p__;
_TPL_FUNC_;

        self::$__RCODE1 = "\$__p__ = '';";
    
        self::$__RCODE2 = <<<_TPLRENDERCODE_
\$__instance__->data = Contemplate::data( \$data ); 
__{{CODE}}__
_TPLRENDERCODE_;
        
        // pre-compute the needed regular expressions
        self::$__regExps[ 'specials' ] = '/[\\n\\r\\v\\t]/';
        
        self::$__regExps[ 'replacements' ] = '/\\t[ ]*(.*?)[ ]*\\v/';
        
        self::$__regExps[ 'controls' ] = '/\\t[ ]*%(' . implode('|', self::$__controlConstructs) . ')\\b[ ]*\\((.*)\\)/';
        self::$__regExps[ 'controls2' ] = '/%(' . implode('|', self::$__controlConstructs) . ')\\b[ ]*\\((.*)\\)/';
        
        self::$__regExps[ 'functions' ] = '/%(' . implode('|', self::$__funcs) . ')\\b/';
        
        self::$__preserveLines = self::$__preserveLinesDefault;
        
        self::$__tplStart = "'; " . self::$__TEOL;
        self::$__tplEnd = self::$__TEOL . "\$__p__ .= '";
        
        self::$__isInited = true;
    }
    
    // http://www.blainesch.com/403/dynamically-adding-methods-to-classes-and-objects-in-php/
    public static function __callstatic($method, $params=array()) 
    {
        if ( isset( self::$__plugins[ $method ] ) && is_callable( self::$__plugins[ $method ] ) ) 
        {
            return call_user_func_array(self::$__plugins[ $method ], $params);
        } 
        /*else 
        {
            throw new Exception("Method not defined.");
        }*/
        return '';
    }
    
    //
    // Main template static methods
    //
    
    // add custom plugins as template functions
    public static function addPlugin($name, $handler) 
    {
        self::$__plugins[ "plugin_$name" ] = $handler;
    }
    
    // custom php code to add to start of template (eg custom access checks etc..)
    public static function setPrefixCode($preCode=null)
    {
        if ( $preCode )
            self::$__tplPrefixCode = (string)$preCode;
    }
    
    public static function setLocaleStrings($l) 
    { 
        self::$__locale = self::merge(self::$__locale, $l); 
    }
    
    public static function clearLocaleStrings() 
    { 
        self::$__locale = array(); 
    }
    
    public static function setPlurals($plurals) 
    { 
        if ( is_array($plurals) )
        {
            foreach ($plurals as $singular=>$plural)
            {
                if ( null == $plural )
                {
                    // auto plural
                    $plurals[ $singular ] = $singular.'s';
                }
            }
            self::$__plurals = self::merge(self::$__plurals, $plurals); 
        }
    }
    
    public static function clearPlurals() 
    { 
        self::$__plurals = array(); 
    }
    
    public static function setTemplateSeparators($seps=null)
    {
        if (is_array($seps))
        {
            if ( isset($seps['left']) ) self::$__leftTplSep = strval($seps['left']);
            if ( isset($seps['right']) ) self::$__rightTplSep = strval($seps['right']);
        }
    }
    
    public static function setPreserveLines($bool=true) 
    { 
        if ( $bool )  
            self::$__preserveLines = self::$__preserveLinesDefault;  
        else 
            self::$__preserveLines = ''; 
    }
    
    public static function setCacheDir($dir) 
    {  
        self::$__cacheDir = rtrim($dir,'/').'/'; 
    }
    
    public static function setCacheMode($mode) 
    { 
        self::$__cacheMode = $mode; 
    }
    
    public static function clearCache($all=false) 
    { 
        self::$__cache = array(); 
        if ( $all ) self::$__partials = array(); 
    }
    
    // add templates manually
    public static function add($tpls) 
    { 
        if ( is_array($tpls) )
        {
            foreach ($tpls as $tplID=>$tplData)
            {
                if ( is_array( $tplData ) )
                {
                    // unified way to add tpls both as reference and inline
                    // inline tpl, passed as array
                    if ( isset($tplData[ 0 ]) )
                        self::$__inlines[ $tplID ] = $tplData[ 0 ];
                    unset( $tpls[ $tplID ] );
                }
            }
            self::$__templates = self::merge(self::$__templates, $tpls); 
        }
    }
    
    // add inline templates manually
    public static function addInline($tpls) 
    { 
        self::$__inlines = self::merge(self::$__inlines, $tpls);  
    }
        
    // return the requested template (with optional data)
    public static function tpl($id, $data=null, $refresh=false)
    {
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        if ( $refresh || !isset(self::$__cache[$id]) )  
            self::$__cache[$id] = self::getCachedTemplate($id);
        
        $tpl = self::$__cache[$id];
        
        // Provide some basic currying to the user
        if ( is_array( $data ) )  return $tpl->render( $data );
        else  return $tpl;
    }
    
    //
    // Basic template functions
    //
    
    // basic html escaping
    public static function html($s) 
    { 
        return htmlentities($s, ENT_COMPAT, 'UTF-8'); 
    }
    
    // basic url escaping
    public static function url($s) 
    { 
        return urlencode($s); 
    }
    
    // count items in array
    public static function count($a) 
    { 
        return count($a); 
    }
    
    // check if (nested) keys exist in tpl variable
    public static function haskey($v/*, key1, key2, etc.. */) 
    {
        if (!$v || !is_array($v)) return false;
        $args = func_get_args();
        array_shift($args);
        $argslen = count($args);
        $tmp = $v;
        for ($i=0; $i<$argslen; $i++)
        {
            if (!array_key_exists($args[$i], $tmp)) return false;
            $tmp = $tmp[$args[$i]];
        }
        return true;
    }
        
    // quote
    public static function q($e) 
    { 
        return "'" . $e . "'"; 
    }
    
    // double quote
    public static function dq($e) 
    { 
        return '"' . $e . '"'; 
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
    
    public static function addslashes($s)
    {
        return addslashes($s);
    }
    
    public static function stripslashes($s)
    {
        return stripslashes($s);
    }
    
    // Concatenate strings/vars
    public static function concat() 
    { 
        $args = func_get_args(); 
        return implode('', $args); 
    }
    
    // Trim strings in templates
    public static function trim($s, $charlist=null) 
    { 
        if ( $charlist ) return trim($s, $charlist); 
        else return trim($s); 
    }
    
    public static function ltrim($s, $charlist=null) 
    { 
        if ( $charlist ) return ltrim($s, $charlist); 
        else return ltrim($s); 
    }
    
    public static function rtrim($s, $charlist=null) 
    { 
        if ( $charlist ) return rtrim($s, $charlist); 
        else return rtrim($s); 
    }
    
    public static function ucfirst($s)
    {
        return ucfirst($s);
    }
    
    public static function lcfirst($s)
    {
        return lcfirst($s);
    }
    
    public static function lowercase($s)
    {
        return strtolower($s);
    }
    
    public static function uppercase($s)
    {
        return strtoupper($s);
    }
    
    public static function camelcase($s, $sep="_", $capitalizeFirst=false)
    {
        if ( $capitalizeFirst )
            return implode("", array_map("ucfirst", explode($sep, $s))); 
        else
            return lcfirst( implode("", array_map("ucfirst", explode($sep, $s))) );
    }
    
    public static function snakecase($s, $sep="_")
    {
        return strtolower( preg_replace( '/([A-Z])/', $sep . '$1', $s ) );
    }
    
    // Sprintf in templates
    public static function sprintf() 
    { 
        $args = func_get_args(); 
        $format = array_shift($args); 
        return vsprintf($format, $args); 
    }
    
    //
    //  Localization functions
    //
    
    // current time in seconds
    public static function time() 
    { 
        return time(); 
    }
    public static function now() 
    { 
        return time(); 
    }
    
    // formatted date
    public static function date($format, $time=false) 
    { 
        if (false===$time) $time=time(); 
        return date($format, $time); 
    }
    
    // localized formatted date
    public static function ldate($format, $time=false) 
    { 
        if (false===$time) $time=time(); 
        return self::_localized_date(self::$__locale, $format, $time);  
    }
    
    // locale
    public static function locale($e) 
    { 
        return ( isset(self::$__locale[$e]) ) ? self::$__locale[$e] : $e; 
    }
    public static function l($e) 
    { 
        return self::locale($e); 
    }
    // pluralise
    public static function pluralise($singular, $count) 
    { 
        if ( isset(self::$__plurals[$singular]) )
            return 1 != $count ? self::$__plurals[$singular] : $singular;
        return $singular;
    }
    
    // generate a uuid
    public static function uuid($namespace='UUID') 
    {
        return implode('_', array($namespace, ++self::$__uuid, time()));
    }
    
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
    // Control structures
    //
    
    // whether var is set
    private static function t_isset($varname) 
    {
        return ' ( isset(' . $varname . ') ) ';
    }
        
    // set/create/update tpl var
    private static function t_set($args) 
    {
        $args = explode(',', $args);
        $varname = trim( array_shift($args) );
        $expr = trim(implode(',', $args));
        return "';" . self::$__TEOL . self::padLines( "$varname = ( $expr );" ) . self::$__TEOL;
    }
    
    // unset/remove/delete tpl var
    private static function t_unset($varname=null) 
    {
        if ( $varname && strlen($varname) )
        {
            $varname = trim( $varname );
            return "';" . self::$__TEOL . self::padLines( "if ( isset($varname) ) unset( $varname );" ) . self::$__TEOL;
        }
        return "'; " . self::$__TEOL; 
    }
        
    // if
    private static function t_if($cond='false') 
    {  
        self::$__ifs++;  
        
        $out = "';";
        $out1 = str_replace( '__{{COND}}__', $cond, self::$__IF );
        $out .= self::padLines($out1);
        self::$__level++;
        
        return $out;
    }
    
    // elseif    
    private static function t_elseif($cond='false') 
    { 
        $out = "';";
        $out1 = str_replace( '__{{COND}}__', $cond, self::$__ELSEIF );

        self::$__level--;
        $out .= self::padLines($out1);
        self::$__level++;
        
        return $out;
    }
    
    // else
    private static function t_else() 
    { 
        $out = "';";
        $out1 = self::$__ELSE;
        
        self::$__level--;
        $out .= self::padLines($out1);
        self::$__level++;
        
        return $out;
    }
    
    // endif
    private static function t_endif() 
    { 
        self::$__ifs--;  
        
        $out = "';";
        $out1 = self::$__ENDIF;
        
        self::$__level--;
        $out .= self::padLines($out1);
        
        return $out;
    }
    
    // for, foreach
    private static function t_for($for_expr) 
    {
        static $id = 0;
        
        self::$__loops++;  self::$__loopifs++;
        $for_expr = explode(' as ', $for_expr); 
        $exprO = trim($for_expr[0]); 
        $kv = explode('=>', $for_expr[1]); 
        $k = trim($kv[0]) . '__RAW__'; 
        $v = trim($kv[1]) . '__RAW__'; 
        $o = '$_loopObj' . (++$id);

        $out = "';";
        $out1 = str_replace(array(
            '__{{FOR_EXPR_O}}__',
            '__{{O}}__', 
            '__{{K}}__', 
            '__{{V}}__', 
            '__{{ASSIGN1}}__', 
            '__{{ASSIGN2}}__'
        ), array(
            $exprO,
            $o, 
            '$'.$k,
            '$'.$v,
            "\$__instance__->data['$k'] = \${$k};",
            "\$__instance__->data['$v'] = \${$v};"
        ), self::$__FOR);
        
        $out .= self::padLines($out1);
        self::$__level+=2;
        
        return $out;
    }
    
    // elsefor
    private static function t_elsefor() 
    { 
        /* else attached to  for loop */ 
        self::$__loopifs--;  
        $out = "';";
        $out1 = self::$__ELSEFOR;
        
        self::$__level+=-2;
        $out .= self::padLines($out1);
        self::$__level+=1;
        
        return $out;
    }
    
    // endfor
    private static function t_endfor() 
    {
        $out = "';";
        if ( self::$__loopifs==self::$__loops ) 
        { 
            self::$__loops--; self::$__loopifs--;  
            
            $out1 = self::$__ENDFOR1;
            
            self::$__level+=-2;
            $out .= self::padLines($out1);
            
            return $out;
        }
        self::$__loops--;  
        $out1 = self::$__ENDFOR2;
        
        self::$__level+=-1;
        $out .= self::padLines($out1);
        
        return $out;
    }
    
    // include file
    private static function t_include($id) 
    { 
        /* cache it */ 
        if ( !isset(self::$__partials[$id]) )
        {
            self::pushState();
            self::resetState();
            self::$__partials[$id]=" " . self::parse(self::getTemplateContents($id), false) . "'; " . self::$__TEOL;
            self::popState();
        }
        return self::padLines( self::$__partials[$id] );
    }
    
    // include template
    private static function t_template($args)
    {
        $args = explode(',', $args); 
        $id = trim(array_shift($args));
        $obj = implode(',', $args);
        return '\' . %tpl( "'.$id.'", '.$obj.' ); ' . self::$__TEOL;
    }
    
    // extend another template
    private static function t_extends($tpl) 
    { 
        self::$__extends = $tpl; 
        return "'; " . self::$__TEOL; 
    }
    
    // define (overridable) block
    private static function t_block($block) 
    { 
        $block = trim($block);
        if ( !in_array($block, self::$__allblocks) )
        {
            self::$__allblocks[] = $block; 
        }
        
        self::$__blockcnt++; 
        array_push(self::$__blocks, $block); 
        return "' . __||" . $block . "||__";  
    }
    
    // end define (overridable) block
    private static function t_endblock() 
    { 
        if ( self::$__blockcnt ) 
        {
            self::$__blockcnt--; 
            return "__||/" . array_pop(self::$__blocks) . "||__";
        }  
        return '';  
    }

    //
    // auxilliary parsing methods
    //
    private static function split($s)
    {
        $parts1 = explode( self::$__leftTplSep, $s );
        $len = count( $parts1 );
        $parts = array();
        for ($i=0; $i<$len; $i++)
        {
            $tmp = explode( self::$__rightTplSep, $parts1[$i] );
            $parts[] = $tmp[0];
            if ( isset($tmp[1]) ) $parts[] = $tmp[1];
        }
        return $parts;
    }
    
    private static function parseControlConstructs($m)
    {
        if (isset($m[1]))
        {
            $ctrl = $m[1];
            $args = isset($m[2]) ? $m[2] : '';
            
            switch($ctrl)
            {
                case 'isset': 
                    // constructs in args, eg. isset
                    $args = preg_replace_callback( self::$__regExps['controls2'], array(__CLASS__, 'parseControlConstructs'), $args );
                    return self::t_isset($args);  
                    break;
                
                case 'set':  
                    // constructs in args, eg. isset
                    $args = preg_replace_callback( self::$__regExps['controls2'], array(__CLASS__, 'parseControlConstructs'), $args );
                    return self::t_set($args);  
                    break;
                
                case 'unset': 
                    // constructs in args, eg. isset
                    $args = preg_replace_callback( self::$__regExps['controls2'], array(__CLASS__, 'parseControlConstructs'), $args );
                    return self::t_unset($args);  
                    break;
                
                case 'if': 
                    // constructs in args, eg. isset
                    $args = preg_replace_callback( self::$__regExps['controls2'], array(__CLASS__, 'parseControlConstructs'), $args );
                    return self::t_if($args);  
                    break;
                
                case 'elseif': 
                    // constructs in args, eg. isset
                    $args = preg_replace_callback( self::$__regExps['controls2'], array(__CLASS__, 'parseControlConstructs'), $args );
                    return self::t_elseif($args); 
                    break;
                
                case 'else': 
                    return self::t_else($args);  
                    break;
                
                case 'endif': 
                    return self::t_endif($args);  
                    break;
                
                case 'for': 
                    // constructs in args, eg. isset
                    $args = preg_replace_callback( self::$__regExps['controls2'], array(__CLASS__, 'parseControlConstructs'), $args );
                    return self::t_for($args);  
                    break;
                
                case 'elsefor': 
                    return self::t_elsefor($args); 
                    break;
                
                case 'endfor': 
                    return self::t_endfor($args); 
                    break;
                
                case 'template': 
                    // constructs in args, eg. isset
                    $args = preg_replace_callback( self::$__regExps['controls2'], array(__CLASS__, 'parseControlConstructs'), $args );
                    return self::t_template($args); 
                    break;
                
                case 'extends': 
                    return self::t_extends($args); 
                    break;
                
                case 'block': 
                    return self::t_block($args); 
                    break;
                
                case 'endblock': 
                    return self::t_endblock($args); 
                    break;
                
                case 'include': 
                    return self::t_include($args); 
                    break;
            }
        }
        return $m[0];
    }
    
    private static function parseBlocks($s) 
    {
        $blocks = array(); 
        $bl = count(self::$__allblocks);
        
        while ($bl--)
        {
            $block = array_pop(self::$__allblocks);
            
            $delim1 = '__||' . $block . '||__'; 
            $delim2 = '__||/' . $block . '||__'; 
            
            $len1 = strlen($delim1); 
            $len2 = $len1+1; 
            
            $pos1 = strpos($s, $delim1, 0);
            $pos2 = strpos($s, $delim2, $pos1+$len1);
            
            $code = substr($s, $pos1, $pos2-$pos1+$len2);
            
            if ( !empty($code) )
            {
                $code = substr($code, $len1, -$len2); //str_replace(array(". '' .", ". '';"), array('.', ';'), substr($code, $len1, -$len2)); // remove redundant code
                
                $bout = str_replace('__{{CODE}}__', $code."';", self::$__DOBLOCK);
                
                $blocks[$block] = $bout;
            }
            
            $replace = true;
            while ($replace)
            {
                // replace all occurances of the block on the current template, 
                // with the code found previously
                // in the 1st block definition
                $s = substr($s, 0, $pos1) .  
                    "\$__instance__->renderBlock( '" . $block . "' ); " . 
                    substr($s, $pos2+$len2)
                ;
                
                $replace = (false !== ($pos1 = strpos($s, $delim1, 0)));
                $pos2 = ($replace) ? strpos($s, $delim2, $pos1+$len1) : 0;
            }
        }
        
        return array($s/*str_replace(array(". '' .", ". '';"), array('.', ';'), $s)*/, $blocks);
    }

    private static function parseString($s, $q, $i, $l)
    {
        $string = $q;
        $escaped = false;
        $ch = '';
        while ( $i < $l )
        {
            $ch = $s[$i++];
            $string .= $ch;
            if ( $q == $ch && !$escaped )  break;
            $escaped = (!$escaped && '\\' == $ch);
        }
        return $string;
    }
    
    private static function parseVariable($s, $i, $l, $pre='VARSTR')
    {
        if ( preg_match(self::$ALPHA, $s[$i], $m) )
        {
            $cnt = 0;
            $strings = array();
            $variables = array();
            
            // main variable
            $variable = $s[$i++];
            while ( $i < $l && preg_match(self::$ALPHANUM, $s[$i], $m) )
            {
                $variable .= $s[$i++];
            }
            
            $variable_raw = $variable;
            // transform into tpl variable
            $variable = "\$__instance__->data['" . $variable . "']";
            $len = strlen($variable_raw);
            
            // extra space
            $space = 0;
            while ( $i < $l && preg_match(self::$SPACE, $s[$i], $m) )
            {
                $space++;
                $i++;
            }
            
            $bracketcnt = 0;
            
            // optional properties
            while ( $i < $l && ('.' == $s[$i] || '[' == $s[$i]) )
            {
                $delim = $s[$i++];
                
                // extra space
                while ( $i < $l && preg_match(self::$SPACE, $s[$i], $m) )
                {
                    $space++;
                    $i++;
                }
            
                // alpha-numeric dot property
                if ( '.' == $delim )
                {
                    // property
                    $property = '';
                    while ( $i < $l && preg_match(self::$ALPHANUM, $s[$i], $m) )
                    {
                        $property .= $s[$i++];
                    }
                    $lp = strlen($property);
                    if ( $lp )
                    {
                        // transform into tpl variable bracketed property
                        $variable .= "['" . $property . "']";
                        $len += $space + 1 + $lp;
                        $space = 0;
                    }
                    else
                    {
                        break;
                    }
                }
                
                // bracketed property
                elseif ( '[' == $delim )
                {
                    $bracketcnt++;
                    
                    $ch = $s[$i];
                    
                    // literal string property
                    if ( '"' == $ch || "'" == $ch )
                    {
                        $property = self::parseString( $s, $ch, $i+1, $l );
                        $cnt++;
                        $strid = "__##$pre$cnt##__";
                        $strings[ $strid ] = $property;
                        $variable .= $delim . $strid;
                        $lp = strlen($property);
                        $i += $lp;
                        $len += $space + 1 + $lp;
                        $space = 0;
                    }
                    
                    // numeric array property
                    elseif ( preg_match(self::$NUM, $ch, $m) )
                    {
                        $property = $s[$i++];
                        while ( $i < $l && preg_match(self::$NUM, $s[$i], $m) )
                        {
                            $property .= $s[$i++];
                        }
                        $variable .= $delim . $property;
                        $lp = strlen($property);
                        $len += $space + 1 + $lp;
                        $space = 0;
                    }
                    
                    // sub-variable property
                    elseif ( '$' == $ch )
                    {
                        $sub = substr($s, $i+1);
                        $subvariables = self::parseVariable($sub, 0, strlen($sub), $pre . '_' . $cnt . '_');
                        if ( $subvariables )
                        {
                            // transform into tpl variable property
                            $property = end($subvariables);
                            $variable .= $delim . $property[0][0];
                            $lp = $property[1];
                            $i += $lp + 1;
                            $len += $space + 2 + $lp;
                            $space = 0;
                            $variables = array_merge($variables, $subvariables);
                        }
                    }
                    
                    // close bracket
                    elseif ( ']' == $ch )
                    {
                        if ( $bracketcnt > 0 )
                        {
                            $bracketcnt--;
                            $variable .= $delim . $s[$i++];
                            $len += $space + 2;
                            $space = 0;
                        }
                        else
                        {
                            break;
                        }
                    }
                    
                    else
                    {
                        break;
                    }
                    
                    
                    // extra space
                    while ( $i < $l && preg_match(self::$SPACE, $s[$i], $m) )
                    {
                        $space++;
                        $i++;
                    }
            
                    // close bracket
                    if ( ']' == $s[$i] )
                    {
                        if ( $bracketcnt > 0 )
                        {
                            $bracketcnt--;
                            $variable .= $s[$i++];
                            $len += $space + 1;
                            $space = 0;
                        }
                        else
                        {
                            break;
                        }
                    }
                }
                
                // extra space
                while ( $i < $l && preg_match(self::$SPACE, $s[$i], $m) )
                {
                    $space++;
                    $i++;
                }
            }
            
            $variables[] = array(array($variable, $variable_raw), $len, $strings);
            return $variables;
        }
        return null;
    }
    
    private static function parse($tpl, $withblocks=true) 
    {
        $parts = self::split($tpl);
        $len = count($parts);
        $isTag = false;
        $parsed = '';
        for ($i=0; $i<$len; $i++)
        {
            $s = $parts[$i];
            
            if ( $isTag )
            {
                $tag = "\t" . preg_replace( self::$__regExps['specials'], " ", $s ) . "\v"; // replace special chars
                
                // parse each template tag section accurately
                // refined parsing of strings and variables
                $count = strlen( $tag );
                $index = 0;
                $ch = '';
                $out = '';
                $cnt = 0;
                $variables = array();
                $strings = array();
                while ( $index < $count )
                {
                    $ch = $tag[$index++];
                    
                    // parse mainly literal strings and variables
                    
                    // literal string
                    if ( '"' == $ch || "'" == $ch )
                    {
                        $tok = self::parseString( $tag, $ch, $index, $count );
                        $cnt++;
                        $id = "__##STR$cnt##__";
                        $strings[ $id ] = $tok;
                        $out .= $id;
                        $index += strlen($tok)-1;
                    }
                    // variable
                    elseif ( '$' == $ch )
                    {
                        $tok = self::parseVariable($tag, $index, $count);
                        if ( $tok )
                        {
                            foreach ($tok as $tokv)
                            {
                                $cnt++;
                                $id = "__##VAR$cnt##__";
                                $variables[ $id ] = $tokv[ 0 ];
                                $strings = array_merge( $strings, $tokv[ 2 ] );
                            }
                            $out .= $id;
                            $index += $tokv[ 1 ];
                        }
                        else
                        {
                            $out .= '$';
                        }
                    }
                    // rest, bypass
                    else
                    {
                        $out .= $ch;
                    }
                }
                $tag = $out;
                
                // fix literal data notation
                $tag = str_replace(array('{', '}', '[', ']', ':'), array('array(', ')','array(', ')', '=>'), $tag);
                
                // directives and control constructs
                $tag = preg_replace_callback( self::$__regExps['controls'], array(__CLASS__, 'parseControlConstructs'), $tag );
                
                // functions
                $tag = preg_replace( self::$__regExps['functions'], 'Contemplate::${1}', $tag );
                
                // other replacements
                $tag = preg_replace( self::$__regExps['replacements'], '\' . ( $1 ) . \'', $tag );
                
                foreach($variables as $id=>$variable)
                {
                    $tag = str_replace("{$id}__RAW__", $variable[1], $tag);
                    $tag = str_replace($id, $variable[0], $tag);
                }
                $tag = str_replace(array_keys($strings), array_values($strings), $tag);
                
                $tag = str_replace( array("\t", "\v"), array(self::$__tplStart, self::padLines( self::$__tplEnd )), $tag );
                
                $s  = $tag;
                
                $isTag = false;
            }
            else
            {
                $s = str_replace( "'", "\\'", $s );  // escape single quotes accurately (used by parse function)
                
                $s = str_replace( "\n", self::$__preserveLines, $s ); // preserve lines
                
                $isTag = true;
            }
            
            $parsed .= $s;
        }
        
        if ( $withblocks ) return self::parseBlocks($parsed);
        
        return $parsed; //str_replace( array(". '' .", ". '';"), array('.', ';'), $parsed ); // remove redundant code
    }
    
    public static function getTemplateContents($id)
    {
        if ( isset(self::$__inlines[$id]) )  
            return self::$__inlines[$id];
        
        elseif ( isset(self::$__templates[$id]) && is_file(self::$__templates[$id]) ) 
            return file_get_contents( self::$__templates[$id] );
        
        return '';
    }
    
    private static function getCachedTemplateName($id) 
    { 
        return self::$__cacheDir . str_replace(array('-', ' '), '_', $id) . '_tpl.php'; 
    }
    
    private static function getCachedTemplateClass($id) 
    { 
        return 'Contemplate_' . str_replace(array('-', ' '), '_', $id) . '_Cached';  
    }
    
    private static function createTemplateRenderFunction($id)
    {
        self::resetState();
        
        $blocks = self::parse(self::getTemplateContents($id));
        
        if ( self::$__extends )
        {
            $func = self::$__TFUNC1;
        }
        else
        {
            $func = str_replace( '__{{CODE}}__', "\$__p__ .= '" . $blocks[0] . "';", self::$__TFUNC2 );
        }
        
        $fn = create_function('$__instance__', $func);
        
        $blockfns = array();  
        foreach ($blocks[1] as $b=>$bc) 
        {
            $blockfns[$b] = create_function('$__instance__', $bc);
        }
        
        return array($fn, $blockfns);
    }
    
    private static function createCachedTemplate($id, $filename, $classname)
    {
        self::resetState();
        
        $blocks = self::parse(self::getTemplateContents($id));
        
        // tpl-defined blocks
        $sblocks = '';
        foreach ($blocks[1] as $b=>$bc)
        {
            $sblocks .= self::$__TEOL . str_replace(
                array(
                    '__{{BLOCK}}__',
                    '__{{BLOCKMETHOD}}__',
                    '__{{BLOCKMETHODCODE}}__'
                ),
                array(
                    $b,
                    "_blockfn_$b",
                    self::padLines($bc, 1)
                ),
                self::$__tplBlockCode);
        }
        
        // tpl render code
        if (self::$__extends)
        {
            $parentCode = "\$this->setParent( '".self::$__extends."' );";
            $renderCode = self::$__RCODE1;
        }
        else
        {
            $parentCode = '';
            $renderCode = str_replace( '__{{CODE}}__', "\$__p__ .= '" . $blocks[0] . "';", self::$__RCODE2 );
        }
        
        if ( self::$__tplPrefixCode )
            $prefixCode = self::$__tplPrefixCode;
        else
            $prefixCode = '';
            
        // generate tpl class
        $class = '<?php ' .self::$__TEOL . str_replace(
                    array(
                        '__{{PREFIX_CODE}}__',
                        '__{{ID}}__',
                        '__{{CLASSNAME}}__',
                        '__{{PARENTCODE}}__',
                        '__{{BLOCKS}}__',
                        '__{{RENDERCODE}}__'
                    ),
                    array(
                        $prefixCode,
                        $id,
                        $classname,
                        self::padLines($parentCode, 2),
                        self::padLines($sblocks, 1),
                        self::padLines($renderCode, 3)
                    ),
                    self::$__tplClassCode);
        
        //return self::setCachedTemplate($filename, $class);
        return file_put_contents($filename, $class);
    }
    
    private static function getCachedTemplate($id)
    {
        // inline templates saved only in-memory
        if ( isset(self::$__inlines[$id]) )
        {
            // dynamic in-memory caching during page-request
            //return new Contemplate($id, self::createTemplateRenderFunction($id));
            $tpl = new Contemplate();
            $tpl->setId( $id );
            $fns = self::createTemplateRenderFunction($id);
            $tpl->setRenderFunction( $fns[0] ); 
            $tpl->setBlocks( $fns[1] );
            if ( self::$__extends ) $tpl->setParent( self::tpl(self::$__extends) );
            return $tpl;
        }
        
        switch ( self::$__cacheMode )
        {
            case self::CACHE_TO_DISK_NOUPDATE:
            
                $cachedTplFile = self::getCachedTemplateName($id);
                $cachedTplClass = self::getCachedTemplateClass($id);
                if ( !is_file($cachedTplFile) )
                {
                    // if not exist, create it
                    self::createCachedTemplate($id, $cachedTplFile, $cachedTplClass);
                }
                if (is_file($cachedTplFile))
                {
                    include($cachedTplFile);  
                    $tpl = new $cachedTplClass();
                    $tpl->setId( $id ); 
                    return $tpl;
                }
                return null;
                break;
            
            case self::CACHE_TO_DISK_AUTOUPDATE:
            
                $cachedTplFile = self::getCachedTemplateName($id);
                $cachedTplClass = self::getCachedTemplateClass($id);
                if ( !is_file($cachedTplFile) || (filemtime($cachedTplFile) <= filemtime(self::$__templates[$id])) )
                {
                    // if tpl not exist or is out-of-sync (re-)create it
                    self::createCachedTemplate($id, $cachedTplFile, $cachedTplClass);
                }
                if ( is_file($cachedTplFile) )
                {
                    include($cachedTplFile);  
                    $tpl = new $cachedTplClass();
                    $tpl->setId( $id );  
                    return $tpl;
                }
                return null;
                break;
            
            case self::CACHE_TO_DISK_NONE:
            default:
            
                // dynamic in-memory caching during page-request
                //return new Contemplate($id, self::createTemplateRenderFunction($id));
                $tpl = new Contemplate();
                $tpl->setId( $id );
                $fns = self::createTemplateRenderFunction($id);
                $tpl->setRenderFunction( $fns[0] ); 
                $tpl->setBlocks( $fns[1] );
                if ( self::$__extends ) $tpl->setParent( self::tpl(self::$__extends) );
                return $tpl;
                break;
        }
        
        return null;
    }
    
    private static function setCachedTemplate($filename, $tplContents) 
    { 
        return file_put_contents($filename, $tplContents); 
    }
    
    private static function resetState() 
    {
        // reset state
        self::$__loops = 0; self::$__ifs = 0; self::$__loopifs = 0; self::$__level = 0;
        self::$__blockcnt = 0; self::$__blocks = array();  self::$__allblocks = array();  self::$__extends = null;
    }
    
    private static function pushState() 
    {
        // push state
        array_push(self::$__stack, array(self::$__loops, self::$__ifs, self::$__loopifs, self::$__level,
        self::$__blockcnt, self::$__blocks,  self::$__allblocks,  self::$__extends));
    }
    
    private static function popState() 
    {
        // pop state
        $t = array_pop(self::$__stack);
        self::$__loops = $t[0]; self::$__ifs = $t[1]; self::$__loopifs = $t[2]; self::$__level = $t[3];
        self::$__blockcnt = $t[4]; self::$__blocks = $t[5];  self::$__allblocks = $t[6];  self::$__extends = $t[7];
    }
    
    private static function _localized_date($locale, $format, $timestamp) 
    {
        $txt_words = array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
        
        $date = date($format, $timestamp);
        
        // localize days/months
        $replace = array();
        
        foreach ($txt_words as $word) 
            if ( isset($locale[$word]) ) 
                $replace[$word] = $locale[$word]; 
            
        if ( !empty($replace) )  
            $date = str_replace( array_keys($replace), array_values($replace), $date );
            
        // return localized date
        return $date;
    }
    
    private static function padLines($lines, $level=null)
    {
        if (null === $level)  $level = self::$__level;
        
        $NLRX = '/\n\r|\r\n|\n|\r/';
        
        if ($level>=0)
        {
            //$pad=implode("", array_fill(0, $level, "    "));
            $pad = str_repeat(self::$__pad, $level);
            
            $lines = preg_split($NLRX, $lines);
            
            foreach ($lines as $i=>$line)
            {   
                $lines[$i] = $pad . $line;
            }
            $lines = implode(self::$__TEOL, $lines);
        }
        
        return $lines;
    }
    
    public static function data($d)
    {
        if ( $d instanceof \stdClass ) 
        {
            $d = (array)$d; //array_merge(array(), (array)$d);
        }
        if ( is_array($d) ) 
        { 
            foreach ($d as $k=>$v) 
            { 
                if ( $v instanceof \stdClass || is_array($v) ) $d[$k] = self::data($v); 
            } 
        }
        return $d;
    }
    
    
    public static function merge()
    {
        if (func_num_args() < 1) return;
        $arrays = func_get_args(); 
        $merged = array_shift($arrays); 
        $isTargetObject = false;
        
        if ( is_object($merged) ) 
        { 
            $isTargetObject = true; 
            $merged = (array)$merged; 
        }
        
        foreach ($arrays as $arr)
        {
            $isObject = false;
            if ( is_object($arr) ) 
            { 
                $isObject = true; 
                $arr = (array)$arr; 
            }
                
            foreach($arr as $key => $val)
            {
                // only one level, no need to recurse
                /*if( array_key_exists($key, $merged) && (is_array($val) || is_object($val)) )
                {
                    $merged[$key] = self::merge($merged[$key], $arr[$key]);
                    if (is_object($val))  $merged[$key] = (object)$merged[$key];
                }
                else*/  $merged[$key] = $val;
            }
        }
        if ($isTargetObject) 
        { 
            $isTargetObject = false; 
            $merged = (object)$merged; 
        }
        return $merged;
    }
}

// init the engine on first load
Contemplate::init();
}
