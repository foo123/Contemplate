<?php
/**
*  Contemplate
*  Light-weight Template Engine for PHP, Python, Node and client-side JavaScript
*
*  @version: 0.6.4
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
    const VERSION = "0.6.4";
    
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
    private static $__escape = true;
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
    private static $__allblocks = null;
    private static $__allblockscnt = null;
    private static $__openblocks = null;
    private static $__startblock = null; 
    private static $__endblock = null; 
    private static $__blockptr = -1;
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
    public function __construct( $id=null, $renderFunc=null )
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
    
    public function setId( $id=null ) 
    { 
        if ( $id ) $this->id = $id; 
        return $this; 
    }
    
    public function setParent( $parent ) 
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
    
    public function setBlocks( $blocks ) 
    { 
        if ( !$this->_blocks ) $this->_blocks = array(); 
        $this->_blocks = self::merge( $this->_blocks, $blocks ); 
        return $this; 
    }
    
    public function setRenderFunction( $renderFunc=null ) 
    { 
        if ( $renderFunc ) $this->_renderFunction = $renderFunc; 
        return $this; 
    }
    
    public function renderBlock( $block, $__i__=null )
    {
        if ( !$__i__ ) $__i__ = $this;
        
        if ( $this->_blocks && isset($this->_blocks[$block]) ) 
        {
            $blockfunc = $this->_blocks[$block]; 
            return $blockfunc( $__i__ );
        }
        elseif ( $this->_parent ) 
        {
            return $this->_parent->renderBlock($block, $__i__);
        }
        
        return '';
    }
    
    public function render( $data, $__i__=null ) 
    {
        $__p__ = ''; 
        if ( !$__i__ ) $__i__ = $this;
        
        if ( $this->_parent ) 
        { 
            $__p__ = $this->_parent->render($data, $__i__); 
        }
        elseif ( $this->_renderFunction )
        {
            /* dynamic function */
            $__i__->data = self::data( $data ); 
            $renderFunction = $this->_renderFunction;  
            $__p__ = $renderFunction( $__i__ );
        }
        
        $this->data = null;
        return $__p__;
    }
    
    //
    //
    //
    
    public static function init( )
    {
        if ( self::$__isInited ) return;
        
        self::$__stack = array();
        
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
    public static function __callstatic( $method, $params=array() ) 
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
    public static function addPlugin( $name, $handler ) 
    {
        self::$__plugins[ "plugin_$name" ] = $handler;
    }
    
    // custom php code to add to start of template (eg custom access checks etc..)
    public static function setPrefixCode( $preCode=null )
    {
        if ( $preCode )
            self::$__tplPrefixCode = (string)$preCode;
    }
    
    public static function setLocaleStrings( $l ) 
    { 
        self::$__locale = self::merge(self::$__locale, $l); 
    }
    
    public static function clearLocaleStrings( ) 
    { 
        self::$__locale = array(); 
    }
    
    public static function setPlurals( $plurals ) 
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
    
    public static function clearPlurals( ) 
    { 
        self::$__plurals = array(); 
    }
    
    public static function setTemplateSeparators( $seps=null )
    {
        if (is_array($seps))
        {
            if ( isset($seps['left']) ) self::$__leftTplSep = strval($seps['left']);
            if ( isset($seps['right']) ) self::$__rightTplSep = strval($seps['right']);
        }
    }
    
    public static function setPreserveLines( $enable=true ) 
    { 
        if ( $enable )  
            self::$__preserveLines = self::$__preserveLinesDefault;  
        else 
            self::$__preserveLines = ''; 
    }
    
    public static function setCacheDir( $dir ) 
    {  
        self::$__cacheDir = rtrim($dir,'/').'/'; 
    }
    
    public static function setCacheMode( $mode ) 
    { 
        self::$__cacheMode = $mode; 
    }
    
    public static function clearCache( $all=false ) 
    { 
        self::$__cache = array(); 
        if ( $all ) self::$__partials = array(); 
    }
    
    // add templates manually
    public static function add( $tpls, $tplStr=null ) 
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
        elseif ( $tpls && $tplStr )
        {
            self::$__templates[ $tpls ] = $tplStr;
        }
    }
    
    // add inline templates manually
    public static function addInline( $tpls, $tplStr=null ) 
    { 
        if ( is_array($tpls) )
        {
            self::$__inlines = self::merge(self::$__inlines, $tpls);
        }
        elseif ( $tpls && $tplStr )
        {
            self::$__inlines[ $tpls ] = $tplStr;
        }
    }
        
    // return the requested template (with optional data)
    public static function tpl( $id, $data=null, $options=array() )
    {
        $options = array_merge(array(
            'autoUpdate'=> false,
            'refresh'=> false,
            'escape'=> true,
            'separators'=> null
        ), (array)$options);
        
        if ( false === $options['escape'] ) self::$__escape = false;
        else  self::$__escape = true;
        
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        if ( $options['refresh'] || !isset(self::$__cache[ $id ]) ) 
        {
            // load/parse required tpl (and any associated tpl)
            self::$__cache[ $id ] = self::getCachedTemplate( $id, $options );
        }
        
        $tpl = self::$__cache[ $id ];
        
        // Provide some basic currying to the user
        if ( is_array( $data ) )  return $tpl->render( $data );
        else  return $tpl;
    }
    
    //
    // Basic template functions
    //
    
    // basic html escaping
    public static function html( $s ) 
    { 
        return htmlentities($s, ENT_COMPAT, 'UTF-8'); 
    }
    
    // basic url escaping
    public static function url( $s ) 
    { 
        return urlencode($s); 
    }
    
    // count items in array
    public static function count( $a ) 
    { 
        return count($a); 
    }
    
    // check if (nested) keys exist in tpl variable
    public static function haskey( $v/*, key1, key2, etc.. */ ) 
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
    public static function q( $e ) 
    { 
        return "'" . $e . "'"; 
    }
    
    // double quote
    public static function dq( $e ) 
    { 
        return '"' . $e . '"'; 
    }
    
    // to String
    public static function s( $e ) 
    { 
        return strval($e); 
    }
    
    // to Integer
    public static function n( $e ) 
    { 
        return intval($e); 
    }
    
    // to Float
    public static function f( $e ) 
    { 
        return floatval($e); 
    }
    
    public static function addslashes( $s )
    {
        return addslashes($s);
    }
    
    public static function stripslashes( $s )
    {
        return stripslashes($s);
    }
    
    // Concatenate strings/vars
    public static function concat( ) 
    { 
        $args = func_get_args(); 
        return implode('', $args); 
    }
    
    // Trim strings in templates
    public static function trim( $s, $charlist=null ) 
    { 
        if ( $charlist ) return trim($s, $charlist); 
        else return trim($s); 
    }
    
    public static function ltrim( $s, $charlist=null ) 
    { 
        if ( $charlist ) return ltrim($s, $charlist); 
        else return ltrim($s); 
    }
    
    public static function rtrim( $s, $charlist=null ) 
    { 
        if ( $charlist ) return rtrim($s, $charlist); 
        else return rtrim($s); 
    }
    
    public static function ucfirst( $s )
    {
        return ucfirst($s);
    }
    
    public static function lcfirst( $s )
    {
        return lcfirst($s);
    }
    
    public static function lowercase( $s )
    {
        return strtolower($s);
    }
    
    public static function uppercase( $s )
    {
        return strtoupper($s);
    }
    
    public static function camelcase( $s, $sep="_", $capitalizeFirst=false )
    {
        if ( $capitalizeFirst )
            return implode("", array_map("ucfirst", explode($sep, $s))); 
        else
            return lcfirst( implode("", array_map("ucfirst", explode($sep, $s))) );
    }
    
    public static function snakecase( $s, $sep="_" )
    {
        return strtolower( preg_replace( '/([A-Z])/', $sep . '$1', $s ) );
    }
    
    // Sprintf in templates
    public static function sprintf( ) 
    { 
        $args = func_get_args(); 
        $format = array_shift($args); 
        return vsprintf($format, $args); 
    }
    
    //
    //  Localization functions
    //
    
    // current time in seconds
    public static function time( ) 
    { 
        return time(); 
    }
    public static function now( ) 
    { 
        return time(); 
    }
    
    // formatted date
    public static function date( $format, $time=false ) 
    { 
        if (false===$time) $time=time(); 
        return date($format, $time); 
    }
    
    // localized formatted date
    public static function ldate( $format, $time=false ) 
    { 
        if (false===$time) $time=time(); 
        return self::_localized_date(self::$__locale, $format, $time);  
    }
    
    // locale
    public static function locale( $e ) 
    { 
        return ( isset(self::$__locale[$e]) ) ? self::$__locale[$e] : $e; 
    }
    public static function l( $e ) 
    { 
        return self::locale($e); 
    }
    // pluralise
    public static function pluralise( $singular, $count ) 
    { 
        if ( isset(self::$__plurals[$singular]) )
            return 1 != $count ? self::$__plurals[$singular] : $singular;
        return $singular;
    }
    
    // generate a uuid
    public static function uuid( $namespace='UUID' ) 
    {
        return implode('_', array($namespace, ++self::$__uuid, time()));
    }
    
    //
    //  HTML elements
    //
    
    // html table
    public static function htmltable( $data, $options=array() )
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
    public static function htmlselect( $data, $options=array() )
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
    private static function t_isset( $varname ) 
    {
        return ' (isset(' . $varname . ')) ';
    }
        
    // set/create/update tpl var
    private static function t_set( $args ) 
    {
        $args = explode(',', $args);
        $varname = trim( array_shift($args) );
        $expr = trim(implode(',', $args));
        return "';" . self::$__TEOL . self::padLines( "$varname = ( $expr );" ) . self::$__TEOL;
    }
    
    // unset/remove/delete tpl var
    private static function t_unset( $varname=null ) 
    {
        if ( $varname && strlen($varname) )
        {
            $varname = trim( $varname );
            return "';" . self::$__TEOL . self::padLines( "if (isset($varname)) unset( $varname );" ) . self::$__TEOL;
        }
        return "'; " . self::$__TEOL; 
    }
        
    // if
    private static function t_if( $cond='false' ) 
    {  
        $out = "';" . self::padLines( self::TT_IF(array(
                'IFCOND'=> $cond
            )) );
        self::$__ifs++;  
        self::$__level++;
        
        return $out;
    }
    
    // elseif    
    private static function t_elseif( $cond='false' ) 
    { 
        self::$__level--;
        $out = "';" . self::padLines( self::TT_ELSEIF(array(
                'ELIFCOND'=> $cond
            )) );
        self::$__level++;
        
        return $out;
    }
    
    // else
    private static function t_else( ) 
    { 
        self::$__level--;
        $out = "';" . self::padLines( self::TT_ELSE( ) );
        self::$__level++;
        
        return $out;
    }
    
    // endif
    private static function t_endif( ) 
    { 
        self::$__ifs--;  
        self::$__level--;
        $out = "';" . self::padLines( self::TT_ENDIF( ) );
        
        return $out;
    }
    
    // for, foreach
    private static function t_for( $for_expr ) 
    {
        static $id = 0;
        
        $for_expr = explode(' as ', $for_expr); 
        $o = trim($for_expr[0]); 
        $kv = explode('=>', $for_expr[1]); 
        $k = trim($kv[0]) . '__RAW__'; 
        $v = trim($kv[1]) . '__RAW__'; 
        $_o = '$_O' . (++$id);
        $_k = '$_K' . (++$id);
        $_v = '$_V' . (++$id);

        $out = "';" . self::padLines( self::TT_FOR(array(
                'O'=> $o, '_O'=> $_o, 
                'K'=> '$'.$k, '_K'=> $_k,
                'V'=> '$'.$v, '_V'=> $_v,
                'ASSIGN1'=> "\$__i__->data['$k'] = $_k;", 
                'ASSIGN2'=> "\$__i__->data['$v'] = $_v;"
            )) );
        self::$__loops++;  self::$__loopifs++;
        self::$__level+=2;
        
        return $out;
    }
    
    // elsefor
    private static function t_elsefor( ) 
    { 
        /* else attached to  for loop */ 
        self::$__loopifs--;  
        self::$__level+=-2;
        $out = "';" . self::padLines( self::TT_ELSEFOR( ) );
        self::$__level+=1;
        
        return $out;
    }
    
    // endfor
    private static function t_endfor( ) 
    {
        if ( self::$__loopifs == self::$__loops ) 
        { 
            self::$__loops--; self::$__loopifs--;  
            self::$__level+=-2;
            $out = "';" . self::padLines( self::TT_ENDFOR( null, 1 ) );
        }
        else
        {
            self::$__loops--;  
            self::$__level+=-1;
            $out = "';" . self::padLines( self::TT_ENDFOR( null, 2 ) );
        }
        return $out;
    }
    
    // include file
    private static function t_include( $id ) 
    { 
        /* cache it */ 
        if ( !isset(self::$__partials[$id]) )
        {
            self::pushState();
            self::resetState();
            self::$__partials[$id]=" " . self::parse(self::getSeparators( self::getTemplateContents($id) ), false) . "'; " . self::$__TEOL;
            self::popState();
        }
        return self::padLines( self::$__partials[$id] );
    }
    
    // include template
    private static function t_template( $args )
    {
        $args = explode(',', $args); 
        $id = trim(array_shift($args));
        $obj = implode(',', $args);
        return '\' . %tpl( "'.$id.'", '.$obj.' ); ' . self::$__TEOL;
    }
    
    // extend another template
    private static function t_extends( $tpl ) 
    { 
        self::$__extends = trim( $tpl );
        return "'; " . self::$__TEOL; 
    }
    
    // define (overridable) block
    private static function t_block( $block ) 
    { 
        $block = trim( $block );
        array_push(self::$__allblocks, array($block, -1, -1, 0, self::$__openblocks[ 0 ][ 1 ]));
        self::$__allblockscnt[ $block ] = isset(self::$__allblockscnt[ $block ]) ? (self::$__allblockscnt[ $block ]+1) : 1;
        self::$__blockptr = count(self::$__allblocks);
        array_unshift(self::$__openblocks, array($block, self::$__blockptr-1));
        self::$__startblock = $block;
        self::$__endblock = null;
        return "' .  __||" . $block . "||__";  
    }
    
    // end define (overridable) block
    private static function t_endblock( ) 
    { 
        if ( 1 < count(self::$__openblocks) ) 
        {
            $block = array_shift(self::$__openblocks);
            self::$__endblock = $block[0];
            self::$__blockptr = $block[1]+1;
            self::$__startblock = null;
            return "__||/" . $block[0] . "||__";
        }  
        return '';  
    }

    //
    // auxilliary parsing methods
    //
    private static function split( $s, $leftTplSep, $rightTplSep )
    {
        $parts1 = explode( $leftTplSep, $s );
        $len = count( $parts1 );
        $parts = array();
        for ($i=0; $i<$len; $i++)
        {
            $tmp = explode( $rightTplSep, $parts1[$i] );
            $parts[] = $tmp[0];
            if ( isset($tmp[1]) ) $parts[] = $tmp[1];
        }
        return $parts;
    }
    
    private static function parseControlConstructs( $m )
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
    
    private static function parseBlocks( $s ) 
    {
        $blocks = array(); 
        $bl = count(self::$__allblocks);
        
        while ($bl--)
        {
            $delims = self::$__allblocks[ $bl ];
            
            $block = $delims[ 0 ];
            $pos1 = $delims[ 1 ];
            $pos2 = $delims[ 2 ];
            $off = $delims[ 3 ];
            $containerblock = $delims[ 4 ];
            $tag = "__||" . $block . "||__";
            $rep = "\$__i__->renderBlock( '" . $block . "' ); ";
            $tl = strlen($tag); $rl = strlen($rep);
            
            if ( -1 < $containerblock )
            {
                // adjust the ending position of the container block (if nested)
                // to compensate for the replacements in this (nested) block
                self::$__allblocks[ $containerblock ][ 3 ] += $rl - ($pos2-$pos1+1);
            }
            // adjust the ending position of this block (if nested)
            // to compensate for the replacements of any (nested) block(s)
            $pos2 += $off;
            
            if ( 1 === self::$__allblockscnt[ $block ] )
            {
                // 1st occurance, block definition
                $blocks[ $block ] = self::TT_BLOCK(array(
                        'BLOCKCODE'=> substr($s, $pos1+$tl, $pos2-$tl-1-$pos1-$tl) ."';"
                    ));
            }
            /*
                function strSlice($str, $start, $end) {
                    $end = $end - $start;
                    return substr($str, $start, $end);
                }
            */
            $s = substr($s, 0, $pos1) . $rep . substr($s, $pos2+1);
            if ( 1 <= self::$__allblockscnt[ $block ] ) self::$__allblockscnt[ $block ]--;
        }
        self::$__allblocks = null; self::$__allblockscnt = null; self::$__openblocks = null;
        
        return array($s, $blocks);
    }

    private static function parseString( $s, $q, $i, $l )
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
    
    private static function parseVariable( $s, $i, $l, $pre='VARSTR' )
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
            $variable = "\$__i__->data['" . $variable . "']";
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
    
    private static function parse( $tpl, $withblocks=true ) 
    {
        $parts = self::split($tpl, self::$__leftTplSep, self::$__rightTplSep);
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
                
                self::$__startblock = null;  self::$__endblock = null; self::$__blockptr = -1;
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
                
                if ( self::$__startblock )
                {
                    self::$__startblock = "__||".self::$__startblock."||__";
                    self::$__allblocks[ self::$__blockptr-1 ][ 1 ] = strlen($parsed) + strpos($tag, self::$__startblock);
                }
                elseif ( self::$__endblock )
                {
                    self::$__endblock = "__||/".self::$__endblock."||__";
                    self::$__allblocks[ self::$__blockptr-1 ][ 2 ] = strlen($parsed) + strpos($tag, self::$__endblock) + strlen(self::$__endblock);
                }
                    
                $isTag = false;
            }
            else
            {
                if ( self::$__escape )
                    $s = str_replace( "\\", "\\\\", $s );  // escape escapes
                
                $s = str_replace( "'", "\\'", $s );  // escape single quotes accurately (used by parse function)
                
                $s = preg_replace( "/[\n]/", self::$__preserveLines, $s ); // preserve lines
                
                $isTag = true;
            }
            
            $parsed .= $s;
        }
        
        if ( false !== $withblocks ) return self::parseBlocks($parsed);
        
        return $parsed;
    }
    
    private static function getSeparators( $text, $separators=null )
    {
        if ( $separators )
        {
            $seps = explode( " ", trim( $separators ) );
            self::$__leftTplSep = trim( $seps[ 0 ] );
            self::$__rightTplSep = trim( $seps[ 1 ] );
        }
        else
        {
            // tpl separators are defined on 1st (non-empty) line of tpl content
            $lines = explode( "\n", $text );
            while ( count($lines)>0 && !strlen( trim( $lines[ 0 ] ) ) ) array_shift( $lines );
            if ( count($lines)>0 )
            {
                $seps = explode( " ", trim( array_shift( $lines ) ) );
                self::$__leftTplSep = trim( $seps[ 0 ] );
                self::$__rightTplSep = trim( $seps[ 1 ] );
            }
            $text = implode("\n", $lines);
        }
        return $text;
    }
    
    public static function getTemplateContents( $id )
    {
        if ( isset(self::$__inlines[$id]) ) 
        {        
            return self::$__inlines[$id];
        }
        
        elseif ( isset(self::$__templates[$id]) && is_file(self::$__templates[$id]) ) 
            return file_get_contents( self::$__templates[$id] );
        
        return '';
    }
    
    private static function getCachedTemplateName( $id ) 
    { 
        return self::$__cacheDir . str_replace(array('-', ' '), '_', $id) . '_tpl.php'; 
    }
    
    private static function getCachedTemplateClass( $id ) 
    { 
        return 'Contemplate_' . str_replace(array('-', ' '), '_', $id) . '_Cached';  
    }
    
    private static function createTemplateRenderFunction( $id, $seps=null )
    {
        self::resetState();
        
        $blocks = self::parse(self::getSeparators( self::getTemplateContents($id), $seps ));
        
        if ( self::$__extends )
        {
            $func = self::TT_FUNC( null, 1 );
        }
        else
        {
            $func = self::TT_FUNC(array(
                        'FCODE'=> "\$__p__ .= '" . $blocks[0] . "';"
                    ), 2);
        }
        
        $fn = create_function('$__i__', $func);
        
        $blockfns = array();  
        foreach ($blocks[1] as $b=>$bc) 
        {
            $blockfns[$b] = create_function('$__i__', $bc);
        }
        
        return array($fn, $blockfns);
    }
    
    private static function createCachedTemplate( $id, $filename, $classname, $seps=null )
    {
        self::resetState();
        
        $blocks = self::parse(self::getSeparators( self::getTemplateContents($id), $seps ));
        
        // tpl-defined blocks
        $sblocks = '';
        foreach ($blocks[1] as $b=>$bc)
        {
            $sblocks .= self::$__TEOL . self::TT_BlockCode(array(
                            'BLOCKNAME'=> $b,
                            'BLOCKMETHODNAME'=> "_blockfn_$b",
                            'BLOCKMETHODCODE'=> self::padLines($bc, 1)
                        ));
        }
        
        // tpl render code
        if (self::$__extends)
        {
            $parentCode = "\$this->setParent( '".self::$__extends."' );";
            $renderCode = self::TT_RCODE( null, 1 );
        }
        else
        {
            $parentCode = '';
            $renderCode = self::TT_RCODE(array(
                            'RCODE'=> "\$__p__ .= '" . $blocks[0] . "';"
                        ), 2);
        }
        
        if ( self::$__tplPrefixCode )
            $prefixCode = self::$__tplPrefixCode;
        else
            $prefixCode = '';
            
        // generate tpl class
        $class = '<?php ' .self::$__TEOL . self::TT_ClassCode(array(
                                'PREFIXCODE'=> $prefixCode,
                                'TPLID'=> $id,
                                'CLASSNAME'=> $classname,
                                'PARENTCODE'=> self::padLines($parentCode, 2),
                                'BLOCKS'=> self::padLines($sblocks, 1),
                                'RENDERCODE'=> self::padLines($renderCode, 3)
                            ));
        
        //return self::setCachedTemplate($filename, $class);
        return file_put_contents($filename, $class);
    }
    
    private static function getCachedTemplate( $id, $options=array() )
    {
        $options = (array)$options;
        
        // inline templates saved only in-memory
        if ( isset(self::$__inlines[$id]) )
        {
            // dynamic in-memory caching during page-request
            //return new Contemplate($id, self::createTemplateRenderFunction($id));
            $tpl = new Contemplate();
            $tpl->setId( $id );
            $fns = self::createTemplateRenderFunction($id, $options['separators']);
            $tpl->setRenderFunction( $fns[0] ); 
            $tpl->setBlocks( $fns[1] );
            if ( self::$__extends ) $tpl->setParent( self::tpl(self::$__extends, null, false) );
            return $tpl;
        }
        
        else
        {
            if ( true !== $options['autoUpdate'] && self::CACHE_TO_DISK_NOUPDATE === self::$__cacheMode )
            {
                $cachedTplFile = self::getCachedTemplateName($id);
                $cachedTplClass = self::getCachedTemplateClass($id);
                if ( !is_file($cachedTplFile) )
                {
                    // if not exist, create it
                    self::createCachedTemplate($id, $cachedTplFile, $cachedTplClass, $options['separators']);
                }
                if (is_file($cachedTplFile))
                {
                    include($cachedTplFile);  
                    $tpl = new $cachedTplClass();
                    $tpl->setId( $id ); 
                    return $tpl;
                }
                return null;
            }
            
            elseif ( true === $options['autoUpdate'] || self::CACHE_TO_DISK_AUTOUPDATE === self::$__cacheMode )
            {
                $cachedTplFile = self::getCachedTemplateName($id);
                $cachedTplClass = self::getCachedTemplateClass($id);
                if ( !is_file($cachedTplFile) || (filemtime($cachedTplFile) <= filemtime(self::$__templates[$id])) )
                {
                    // if tpl not exist or is out-of-sync (re-)create it
                    self::createCachedTemplate($id, $cachedTplFile, $cachedTplClass, $options['separators']);
                }
                if ( is_file($cachedTplFile) )
                {
                    include($cachedTplFile);  
                    $tpl = new $cachedTplClass();
                    $tpl->setId( $id );  
                    return $tpl;
                }
                return null;
            }
            
            else
            {
                // dynamic in-memory caching during page-request
                //return new Contemplate($id, self::createTemplateRenderFunction($id));
                $tpl = new Contemplate();
                $tpl->setId( $id );
                $fns = self::createTemplateRenderFunction($id, $options['separators']);
                $tpl->setRenderFunction( $fns[0] ); 
                $tpl->setBlocks( $fns[1] );
                if ( self::$__extends ) $tpl->setParent( self::tpl(self::$__extends) );
                return $tpl;
            }
        }
        
        return null;
    }
    
    private static function setCachedTemplate( $filename, $tplContents ) 
    { 
        return file_put_contents($filename, $tplContents); 
    }
    
    private static function resetState( ) 
    {
        // reset state
        self::$__loops = 0; self::$__ifs = 0; self::$__loopifs = 0; self::$__level = 0;
        self::$__allblocks = array(); self::$__allblockscnt = array(); self::$__openblocks = array(array(null, -1));  
        self::$__extends = null;
        //self::$__escape = true;
    }
    
    private static function pushState( ) 
    {
        // push state
        array_push(self::$__stack, array(self::$__loops, self::$__ifs, self::$__loopifs, self::$__level,
        self::$__allblocks, self::$__allblockscnt, self::$__openblocks,  self::$__extends));
    }
    
    private static function popState( ) 
    {
        // pop state
        $t = array_pop(self::$__stack);
        self::$__loops = $t[0]; self::$__ifs = $t[1]; self::$__loopifs = $t[2]; self::$__level = $t[3];
        self::$__allblocks = $t[4]; self::$__allblockscnt = $t[5]; self::$__openblocks = $t[6];
        self::$__extends = $t[7];
    }
    
    private static function _localized_date( $locale, $format, $timestamp ) 
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
    
    private static function padLines( $lines, $level=null )
    {
        if ( null === $level )  $level = self::$__level;
        
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
    
    private static function j( ) /* joinLines */
    {
        $args = func_get_args( );
        return implode(self::$__TEOL, $args);
    }
    
    // generated cached tpl class code as a heredoc template
    private static function TT_ClassCode( $r=null, $t = 1 )
    {
        return implode("", array(
            $r['PREFIXCODE'],
            self::j(""
            ,"/* Contemplate cached template '"), $r['TPLID'], self::j("' */"
            ,"if (!class_exists('"), $r['CLASSNAME'], self::j("'))"
            ,"{"
            ,"final class "), $r['CLASSNAME'], self::j(" extends Contemplate"
            ,"{    "
            ,"    /* constructor */"
            ,"    public function __construct(\$id=null, \$__=null)"
            ,"    {"
            ,"        /* initialize internal vars */"
            ,"        \$this->id = null; "
            ,"        \$this->data = null;"
            ,"        \$this->_renderFunction = null;"
            ,"        \$this->_parent = null;"
            ,"        \$this->_blocks = null;"
            ,"        "
            ,"        \$this->id = \$id;"
            ,"        "
            ,"        /* parent tpl assign code starts here */"
            ,""), $r['PARENTCODE'], self::j(""
            ,"        /* parent tpl assign code ends here */"
            ,"    }    "
            ,"    "
            ,"    /* tpl-defined blocks render code starts here */"
            ,""), $r['BLOCKS'], self::j(""
            ,"    /* tpl-defined blocks render code ends here */"
            ,"    "
            ,"    /* render a tpl block method */"
            ,"    public function renderBlock(\$block, \$__i__=null)"
            ,"    {"
            ,"        if ( !\$__i__ ) \$__i__ = \$this;"
            ,"        "
            ,"        \$method = '_blockfn_' . \$block;"
            ,"        "
            ,"        if ( method_exists(\$this, \$method) ) return \$this->{\$method}(\$__i__);"
            ,"        "
            ,"        elseif ( \$this->_parent ) return \$this->_parent->renderBlock(\$block, \$__i__);"
            ,"        "
            ,"        return '';"
            ,"    }"
            ,"    "
            ,"    /* tpl render method */"
            ,"    public function render(\$data, \$__i__=null)"
            ,"    {"
            ,"        \$__p__ = '';"
            ,"        if ( !\$__i__ ) \$__i__ = \$this;"
            ,"        "
            ,"        if ( \$this->_parent )"
            ,"        {"
            ,"            \$__p__ = \$this->_parent->render(\$data, \$__i__);"
            ,"        }"
            ,"        else"
            ,"        {"
            ,"            /* tpl main render code starts here */"
            ,""), $r['RENDERCODE'], self::j(""
            ,"            /* tpl main render code ends here */"
            ,"        }"
            ,"        \$this->data = null;"
            ,"        return \$__p__;"
            ,"    }"
            ,"}"
            ,"}"
            ,"")
        ));
    }
    
    // generated tpl block method code as a heredoc template
    private static function TT_BlockCode( $r=null, $t = 1 )
    {
        return implode("", array(
            self::j(""
            ,"/* tpl block render method for block '"), $r['BLOCKNAME'], self::j("' */"
            ,"private function "), $r['BLOCKMETHODNAME'], self::j("(\$__i__) "
            ,"{ "
            ,""), $r['BLOCKMETHODCODE'], self::j(""
            ,"}"
            ,"")
        ));
    }
    
    // generated IF code
    private static function TT_IF( $r=null, $t = 1 )
    {
        return implode("", array(
            self::j(""
            ,"if ( "), $r['IFCOND'], self::j(" )"
            ,"{"
            ,"")
        ));
    }
    
    // generated ELSEIF code
    private static function TT_ELSEIF( $r=null, $t = 1 )
    {
        return implode("", array(
            self::j(""
            ,"}"
            ,"elseif ( "), $r['ELIFCOND'], self::j(" )"
            ,"{"
            ,"")
        ));
    }

    // generated ELSE code
    private static function TT_ELSE( $r=null, $t = 1 ) 
    {
        return self::j(""
            ,"}"
            ,"else"
            ,"{"
            ,"");
    }
    
    // generated ENDIF code
    private static function TT_ENDIF( $r=null, $t = 1 )
    {
        return self::j(""
            ,"}"
            ,"");
    }
    
    // generated FOR code
    private static function TT_FOR( $r=null, $t = 1 )
    {
        return implode("", array(
            self::j(""
            ,""), $r['_O'], " = ", $r['O'], self::j(";"
            ,"if ( !empty("), $r['_O'], self::j(") )"
            ,"{"
            ,"    foreach ( "), $r['_O'], " as ", $r['_K'], "=>", $r['_V'], self::j(" )"
            ,"    {"
            ,"        "), $r['ASSIGN1'], self::j(""
            ,"        "), $r['ASSIGN2'], self::j(""
            ,"")
        ));
    }
    
    // generated ELSEFOR code
    private static function TT_ELSEFOR( $r=null, $t = 1 )
    {
        return self::j(""
            ,"    }"
            ,"}"
            ,"else"
            ,"{"
            ,"");
    }
    
    // generated ENDFOR code
    private static function TT_ENDFOR( $r=null, $t = 1 ) 
    {
        if ( 1 === $t )
        {
            return self::j(""
                ,"    }"
                ,"}"
                ,"");
        }
        else
        {
            return self::j(""
                ,"}"
                ,"");
            }
    }
    
    // generated block code snippet
    private static function TT_BLOCK( $r=null, $t = 1 )
    {
        return implode("", array(
            self::j(""
            ,"\$__p__ = '';"
            ,""), $r['BLOCKCODE'], self::j(""
            ,"return \$__p__;"
            ,"")
        ));
    }

    
    // generated dynamic render code
    private static function TT_FUNC( $r=null, $t = 1 )
    {
        if ( 1 === $t )
        {
            return "return '';";
        }
        else
        {
            return implode("", array(
                self::j(""
                ,"\$__p__ = '';"  
                ,""), $r['FCODE'], self::j(""
                ,"return \$__p__;"
                ,"")
            ));
        }
    }

    private static function TT_RCODE( $r=null, $t = 1 )
    {
        if ( 1 === $t )
        {
            return "\$__p__ = '';";
        }
        else
        {
            return implode("", array(
                self::j(""
                ,"\$__i__->data = Contemplate::data( \$data );" 
                ,""), $r['RCODE'], self::j(""
                ,"")
            ));
        }
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
