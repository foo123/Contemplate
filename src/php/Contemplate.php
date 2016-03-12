<?php
/**
*  Contemplate
*  Light-weight Template Engine for PHP, Python, Node and client-side JavaScript
*
*  @version: 1.1.4
*  https://github.com/foo123/Contemplate
*
*  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed
*  http://ejohn.org/blog/javascript-micro-templating/
*
**/
if (!class_exists('Contemplate'))
{
class ContemplateInlineTemplate
{ 
    public $id = null;
    public $tpl = '';
    private $_renderer = null;
    private $_parsed = false;
    private $_args = null;
    
    public static function multisplit( $tpl, $reps=array(), $as_array=false ) 
    {
        //$as_array = !Contemplate::is_assoc( $reps );
        $a = array( array(1, $tpl) );
        foreach ( (array)$reps as $r=>$s )
        {
            $c = array( ); $sr = $as_array ? $s : $r; $s = array( 0, $s );  $al = count($a);
            for ($i=0; $i<$al; $i++)
            {
                if ( 1 === $a[ $i ][ 0 ] )
                {
                    $b = explode($sr, $a[ $i ][ 1 ]); $bl = count($b);
                    $c[] = array(1, $b[0]);
                    if ( $bl > 1 )
                    {
                        for ($j=0; $j<$bl-1; $j++)
                        {
                            $c[] = $s;
                            $c[] = array(1, $b[$j+1]);
                        }
                    }
                }
                else
                {
                    $c[] = $a[ $i ];
                }
            }
            $a = $c;
        }
        return $a;
    }
    
    public static function multisplit_re( $tpl, $re ) 
    {
        $a = array(); 
        $i = 0; 
        while ( preg_match($re, $tpl, $m, PREG_OFFSET_CAPTURE, $i) ) 
        {
            $a[] = array(1, substr($tpl, $i, $m[0][1]-$i));
            $a[] = array(0, isset($m[1]) ? $m[1][0] : $m[0][0]);
            $i = $m[0][1] + strlen($m[0][0]);
        }
        $a[] = array(1, substr($tpl, $i));
        return $a;
    }
    
    public static function compile( $tpl ) 
    {
        $l = count($tpl);
        $out = 'return (';
        for ($i=0; $i<$l; $i++)
        {
            $notIsSub = $tpl[ $i ][ 0 ]; $s = $tpl[ $i ][ 1 ];
            if ( $notIsSub ) $out .= "'" . preg_replace(Contemplate::$NEWLINE, "' . \"\\n\" . '", preg_replace(Contemplate::$SQUOTE, "\\'", $s)) . "'";
            else $out .= " . \$args['" . $s . "'] . ";
        }
        $out .= ');';
        return create_function('$args', $out);
    }
    
    public function __construct( $tpl='', $replacements=null, $compiled=false ) 
    {
        if ( !$replacements ) $replacements = array();
        $this->id = null;
        $this->_renderer = null;
        $this->_parsed = false; // lazy init, only if needed, as and when needed
        $this->_args = array($tpl, $replacements, $compiled);
        $this->tpl = null;
    }
    
    public function __destruct()
    {
        $this->dispose();
    }
    
    public function dispose( ) 
    {
        $this->id = null;
        $this->tpl = null;
        $this->_renderer = null;
        $this->_args = null;
        $this->_parsed = null;
        return $this;
    }
    
    public function render( $args=null ) 
    {
        if ( !$args ) $args = array();
        if ( !$this->_parsed ) // lazy init, only if needed, as and when needed
        {
            $tpl = $this->_args[0]; $replacements = $this->_args[1]; $compiled = $this->_args[2];
            $this->tpl = is_string($replacements)
                    ? self::multisplit_re($tpl, $replacements)
                    : self::multisplit($tpl, (array)$replacements);
            if ( true === $compiled ) $this->_renderer = self::compile( $this->tpl );
            $this->_args = null;
            $this->_parsed = true;
        }
        if ( $this->_renderer )
        {
            $renderer = $this->_renderer;
            return $renderer( $args );
        }
        
        $tpl =& $this->tpl; 
        $l = count($tpl);
        $args = (array)$args;
        $out = '';
        for ($i=0; $i<$l; $i++)
        {
            $notIsSub = $tpl[ $i ][ 0 ]; $s = $tpl[ $i ][ 1 ];
            $out .= ($notIsSub ? $s : $args[ $s ]);
        }
        return $out;
    }
}
class ContemplateTemplate
{ 
    public $id = null;
    protected $_extends = null;
    protected $_ctx = null;
    protected $_blocks = null;
    protected $_renderer = null;
    protected $_autonomus = null;
    
    
    public function __construct( $id=null )
    {
        /* initialize internal vars */
        $this->_renderer = null;
        $this->_blocks = null;
        $this->_extends = null;
        $this->_ctx = null;
        $this->_autonomus = false;
        $this->id = null; 
        if ( $id ) $this->id = $id; 
    }
    
    public function __destruct()
    {
        $this->dispose();
    }
    
    public function dispose( ) 
    {
        $this->_renderer = null;
        $this->_blocks = null;
        $this->_extends = null;
        $this->_ctx = null;
        $this->_autonomus = null;
        $this->id = null;
        return $this;
    }
    
    public function setId( $id=null ) 
    { 
        if ( $id ) $this->id = $id; 
        return $this; 
    }
    
    public function ctx( $ctx ) 
    { 
        $this->_ctx = $ctx; 
        return $this; 
    }
    
    public function autonomus( $enable=true ) 
    { 
        $this->_autonomus = (bool)$enable; 
        return $this; 
    }
    
    public function extend( $tpl ) 
    { 
        $this->_extends = $tpl && is_string($tpl) ? Contemplate::tpl( $tpl ) : ($tpl instanceof ContemplateTemplate ? $tpl : null);
        return $this; 
    }
    
    public function setBlocks( $blocks ) 
    { 
        if ( !$this->_blocks ) $this->_blocks = array(); 
        $this->_blocks = Contemplate::merge( $this->_blocks, $blocks ); 
        return $this; 
    }
    
    public function setRenderFunction( $renderFunc=null ) 
    { 
        if ( $renderFunc && is_callable($renderFunc) ) $this->_renderer = $renderFunc;
        else $this->_renderer = null;
        return $this; 
    }
    
    public function sprblock( $block, &$data/*, $__i__=null*/ )
    {
        $self = $this;
        //if ( !$__i__ ) $__i__ = $self;
        if ( $self->_extends ) 
        {
            return $self->_extends->block($block, $data, $self->_extends);
        }
        return '';
    }
    
    public function block( $block, &$data, $__i__=null )
    {
        $self = $this; $r = ''; $__ctx = false;
        if ( !$__i__ )
        {
            $__i__ = $self;
            if ( !$this->_autonomus ) $__ctx = Contemplate::_set_ctx( $self->_ctx );
        }
        if ( $self->_blocks && isset($self->_blocks[$block]) ) 
        {
            $blockfunc = $self->_blocks[$block]; 
            $r = $blockfunc( $data, $self, $__i__ );
        }
        elseif ( $self->_extends ) 
        {
            $r = $self->_extends->block($block, $data, $__i__);
        }
        if ( $__ctx )  Contemplate::_set_ctx( $__ctx );
        return $r;
    }
    
    public function render( &$data, $__i__=null ) 
    {
        $self = $this; $__ctx = false;
        $__p__ = '';
        if ( !$__i__ )
        {
            $__i__ = $self;
            if ( !$this->_autonomus ) $__ctx = Contemplate::_set_ctx( $self->_ctx );
        }
        if ( $self->_extends ) 
        { 
            $__p__ = $self->_extends->render($data, $__i__); 
        }
        elseif ( $self->_renderer )
        {
            /* dynamic function */
            $renderer = $self->_renderer;
            $__p__ = $renderer($data, $self, $__i__);
        }
        if ( $__ctx )  Contemplate::_set_ctx( $__ctx );
        return $__p__;
    }
    
    // aliases
    public function renderBlock( $block, &$data, $__i__=null )
    {
        return $this->block( $block, $data, $__i__ );
    }
    public function renderSuperBlock( $block, &$data )
    {
        return $this->sprblock( $block, $data );
    }
}

class ContemplateCtx
{
    public $id = null;
    public $cacheDir = null;
    public $cacheMode = null;
    public $cache = null;
    public $templates = null;
    public $partials = null;
    public $locale = null;
    public $xlocale = null;
    public $plugins = null;
    public $prefix = null;
    public $encoding = null;
    
    public function __construct( $id )
    {
        $this->id               = $id;
        $this->cacheDir         = './';
        $this->cacheMode        = 0;
        $this->cache            = array( );
        $this->templates        = array( );
        $this->partials         = array( );
        $this->locale           = array( );
        $this->xlocale          = array( );
        $this->plugins          = array( );
        $this->prefix           = '';
        $this->encoding         = 'utf8';
    }
    
    public function __destruct( )
    {
        $this->dispose();
    }
    
    public function dispose( )
    {
        $this->id = null;
        $this->cacheDir = null;
        $this->cacheMode = null;
        $this->templates = null;
        $this->partials = null;
        $this->locale = null;
        $this->xlocale = null;
        $this->plugins = null;
        $this->prefix = null;
        $this->encoding = null;
        if ( $this->cache )
        {
            foreach ($this->cache as $tpl) $tpl->dispose( );
        }
        $this->cache = null;
    }
}

class Contemplate
{
    const VERSION = "1.1.4";
    
    const CACHE_TO_DISK_NONE = 0;
    const CACHE_TO_DISK_AUTOUPDATE = 2;
    const CACHE_TO_DISK_NOUPDATE = 4;
    
    public static $ALPHA = '/^[a-zA-Z_]/';
    public static $NUM = '/^[0-9]/';
    public static $ALPHANUM = '/^[a-zA-Z0-9_]/';
    public static $SPACE = '/^\\s/';
    public static $NEWLINE = '/\\n\\r|\\r\\n|\\n|\\r/';
    public static $SQUOTE = "/'/";
    
    private static $__isInited = false;
    
    private static $__leftTplSep = "<%";
    private static $__rightTplSep = "%>";
    private static $__tplStart = '';
    private static $__tplEnd = '';
    private static $__preserveLinesDefault = "' . \"\\n\" . '";
    private static $__preserveLines = '';
    private static $__compatibility = false;
    private static $__EOL = "\n";
    private static $__TEOL = PHP_EOL;
    private static $__pad = "    ";
    private static $__escape = true;
    
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
    private static $__strings = null;
    private static $__uuid = 0;
    private static $__idcnt = 0;
    private static $__locals; 
    private static $__variables;
    private static $__currentblock;
    
    private static $__ctx = null;
    private static $__global = null;
    private static $__context = null;
    
    private static $TT_ClassCode = null;
    private static $TT_BlockCode = null;
    private static $TT_BLOCK = null;
    private static $TT_FUNC = null;
    private static $TT_RCODE = null;
    
    private static $re_controls = '/(\\t|\\s?)\\s*((#ID_(continue|endblock|elsefor|endfor|endif|break|else|fi)#(\\s*\\(\\s*\\))?)|(#ID_([^#]+)#\\s*(\\()))(.*)$/';
    
    private static $__directives = array(
    'set', 'unset', 'isset',
    'if', 'elseif', 'else', 'endif',
    'for', 'elsefor', 'endfor',
    'extends', 'block', 'endblock',
    'include', 'super', 'getblock', 'iif', 'empty', 'continue', 'break', 'local_set'
    );
    private static $__directive_aliases = array(
     'elif'      => 'elseif'
    ,'fi'        => 'endif'
    );
    private static $__funcs = array( 
    's', 'n', 'f', 'q', 'qq', 
    'echo', 'time', 'count',
    'lowercase', 'uppercase', 'ucfirst', 'lcfirst', 'sprintf',
    'date', 'ldate', 'locale', 'xlocale',
    'inline', 'tpl', 'uuid', 'haskey',
    'concat', 'ltrim', 'rtrim', 'trim', 'addslashes', 'stripslashes', 'is_array',
    'camelcase', 'snakecase', 'e', 'url', 'nlocale', 'nxlocale'
    );
    private static $__aliases = array(
     'l'        => 'locale'
    ,'xl'       => 'xlocale'
    ,'nl'       => 'nlocale'
    ,'nxl'      => 'nxlocale'
    ,'cc'       => 'concat'
    ,'dq'       => 'qq'
    ,'now'      => 'time'
    ,'template' => 'tpl'
    );
    
    public static function Template( $id=null )
    {
        return new ContemplateTemplate( $id );
    }
    
    public static function InlineTemplate( $tpl, $reps=array(), $compiled=false )
    {
        return new ContemplateInlineTemplate( $tpl, $reps, $compiled );
    }
    
    public static function Ctx( $id )
    {
        return new ContemplateCtx( $id );
    }
    
    public static function init( )
    {
        if ( self::$__isInited ) return;
        
        // a default global context
        self::$__global = new ContemplateCtx('global');
        self::$__ctx = array(
        'global'  => self::$__global
        );
        self::$__context = self::$__global;
        
        // pre-compute the needed regular expressions
        self::$__preserveLines = self::$__preserveLinesDefault;
        self::$__tplStart = "'; " . self::$__TEOL;
        self::$__tplEnd = self::$__TEOL . "\$__p__ .= '";

        // make compilation templates
        self::$TT_ClassCode = new ContemplateInlineTemplate(implode('#EOL#', array(
            "#PREFIXCODE#"
            ,"if (!class_exists('#CLASSNAME#'))"
            ,"{"
            ,"/* Contemplate cached template '#TPLID#' */"
            ,"final class #CLASSNAME# extends ContemplateTemplate"
            ,"{"
            ,"/* constructor */"
            ,"public function __construct(\$id=null)"
            ,"{"
            ,"    \$self = \$this;"
            ,"    parent::__construct( \$id );"
            ,"    "
            ,"    /* extend tpl assign code starts here */"
            ,"#EXTENDCODE#"
            ,"    /* extend tpl assign code ends here */"
            ,"}    "
            ,"/* tpl-defined blocks render code starts here */"
            ,"#BLOCKS#"
            ,"/* tpl-defined blocks render code ends here */"
            ,"/* tpl block method */"
            ,"public function block(\$block, &\$data, \$__i__=null)"
            ,"{"
            ,"    \$self = \$this; \$r = ''; \$__ctx = false;"
            ,"    if ( !\$__i__ )"
            ,"    {"
            ,"        \$__i__ = \$self;"
            ,"        if ( !\$self->_autonomus ) \$__ctx = Contemplate::_set_ctx( \$self->_ctx );"
            ,"    }"
            ,"    \$method = '_blockfn_' . \$block;"
            ,"    if ( method_exists(\$self, \$method) ) \$r = \$self->{\$method}(\$data, \$self, \$__i__);"
            ,"    elseif ( \$self->_extends ) \$r = \$self->_extends->block(\$block, \$data, \$__i__);"
            ,"    if ( \$__ctx )  Contemplate::_set_ctx( \$__ctx );"
            ,"    return \$r;"
            ,"}"
            ,"/* tpl render method */"
            ,"public function render(&\$data, \$__i__=null)"
            ,"{"
            ,"    \$self = \$this; \$__ctx = false;"
            ,"    \$__p__ = '';"
            ,"    if ( !\$__i__ )"
            ,"    {"
            ,"        \$__i__ = \$self;"
            ,"        if ( !\$self->_autonomus ) \$__ctx = Contemplate::_set_ctx( \$self->_ctx );"
            ,"    }"
            ,"    if ( \$self->_extends )"
            ,"    {"
            ,"        \$__p__ = \$self->_extends->render(\$data, \$__i__);"
            ,"    }"
            ,"    else"
            ,"    {"
            ,"        /* tpl main render code starts here */"
            ,"#RENDERCODE#"
            ,"        /* tpl main render code ends here */"
            ,"    }"
            ,"    if ( \$__ctx )  Contemplate::_set_ctx( \$__ctx );"
            ,"    return \$__p__;"
            ,"}"
            ,"}"
            ,"}"
            ,""
        )), array(
             "#PREFIXCODE#"         => "PREFIXCODE"
            ,"#CLASSNAME#"          => "CLASSNAME"
            ,"#TPLID#"              => "TPLID"
            ,"#BLOCKS#"             => "BLOCKS"
            ,"#EXTENDCODE#"         => "EXTENDCODE"
            ,"#RENDERCODE#"         => "RENDERCODE"
            ,"#EOL#"                => "EOL"
        ), true);
        
        self::$TT_BlockCode = new ContemplateInlineTemplate(implode('#EOL#', array(
            ""
            ,"/* tpl block render method for block '#BLOCKNAME#' */"
            ,"private function #BLOCKMETHODNAME#(&\$data, \$self, \$__i__) "
            ,"{ "
            ,"#BLOCKMETHODCODE#"
            ,"}"
            ,""
        )), array(
             "#BLOCKNAME#"          => "BLOCKNAME"
            ,"#BLOCKMETHODNAME#"    => "BLOCKMETHODNAME"
            ,"#BLOCKMETHODCODE#"    => "BLOCKMETHODCODE"
            ,"#EOL#"                => "EOL"
        ), true);
        
        self::$TT_BLOCK = new ContemplateInlineTemplate(implode('#EOL#', array(
            ""
            ,"\$__p__ = '';"
            ,"#BLOCKCODE#"
            ,"return \$__p__;"
            ,""
        )), array(
             "#BLOCKCODE#"          => "BLOCKCODE"
            ,"#EOL#"                => "EOL"
        ), true);
        
        self::$TT_FUNC = new ContemplateInlineTemplate(implode('#EOL#', array(
            ""
            ,"\$__p__ = '';"  
            ,"#FCODE#"
            ,"return \$__p__;"
            ,""
        )), array(
             "#FCODE#"              => "FCODE"
            ,"#EOL#"                => "EOL"
        ), true);

        self::$TT_RCODE = new ContemplateInlineTemplate(implode('#EOL#', array(
            ""
            ,"#RCODE#"
            ,""
        )), array(
             "#RCODE#"              => "RCODE"
            ,"#EOL#"                => "EOL"
        ), true);
        
        self::clear_state( );
        self::$__isInited = true;
    }
    
    public static function _set_ctx( $ctx )
    {
        $contx = self::$__context;
        /*if ( $ctx instanceof ContemplateCtx ) self::$__context = $ctx;
        elseif ( $ctx && isset(self::$__ctx[$ctx]) ) self::$__context = self::$__ctx[$ctx];
        else self::$__context = self::$__global;*/
        self::$__context = $ctx ? $ctx : self::$__global;
        return $contx;
    }
    
    //
    // Main API methods
    //
    
    public static function createCtx( $ctx )
    {
        if ( $ctx && 'global' !== $ctx && !isset(self::$__ctx[$ctx]) ) self::$__ctx[$ctx] = new ContemplateCtx( $ctx );
    }
    
    public static function disposeCtx( $ctx )
    {
        if ( $ctx && 'global' !== $ctx && isset(self::$__ctx[$ctx]) )
        {
            self::$__ctx[$ctx]->dispose( );
            unset( self::$__ctx[$ctx] );
        }
    }
    
    public static function setCompatibilityMode( $enable=true )
    { 
        self::$__compatibility = (bool)$enable;
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
        self::$__preserveLines = $enable ? self::$__preserveLinesDefault : '';
    }
    
    public static function hasPlugin( $name, $ctx='global' ) 
    {
        $contx = $ctx && isset(self::$__ctx[$ctx]) ? self::$__ctx[$ctx] : self::$__context;
        return !empty($name) && (isset($contx->plugins[ $name ]) || isset(self::$__global->plugins[ $name ]));
    }
    
    public static function addPlugin( $name, $pluginCode, $ctx='global' ) 
    {
        if ( $name && $pluginCode )
        {
            $contx = $ctx && isset(self::$__ctx[$ctx]) ? self::$__ctx[$ctx] : self::$__context;
            $contx->plugins[ $name ] = $pluginCode;
        }
    }
    
    public static function plg_( $plg ) 
    {
        $args = func_get_args( ); array_shift( $args );
        if ( isset( self::$__context->plugins[ $plg ] ) && is_callable( self::$__context->plugins[ $plg ] ) ) 
        {
            return call_user_func_array(self::$__context->plugins[ $plg ], $args);
        } 
        elseif ( isset( self::$__global->plugins[ $plg ] ) && is_callable( self::$__global->plugins[ $plg ] ) ) 
        {
            return call_user_func_array(self::$__global->plugins[ $plg ], $args);
        }
        return '';
    }
    
    public static function setPrefixCode( $preCode=null, $ctx='global' )
    {
        $contx = $ctx && isset(self::$__ctx[$ctx]) ? self::$__ctx[$ctx] : self::$__context;
        if ( $preCode ) $contx->prefix = (string)$preCode;
    }
    
    public static function setEncoding( $encoding, $ctx='global' )
    {
        $contx = $ctx && isset(self::$__ctx[$ctx]) ? self::$__ctx[$ctx] : self::$__context;
        $contx->encoding = $encoding;
    }
    
    public static function setLocales( $locales, $ctx='global' ) 
    { 
        if ( $locales && (is_callable($locales) || is_array($locales)) )
        {
            $contx = $ctx && isset(self::$__ctx[$ctx]) ? self::$__ctx[$ctx] : self::$__context;
            $contx->locale = is_callable($locales) ? $locales : self::merge($contx->locale, (array)$locales);
        }
    }
    
    public static function setXLocales( $xlocales, $ctx='global' ) 
    { 
        if ( $xlocales && (is_callable($xlocales) || is_array($xlocales)) )
        {
            $contx = $ctx && isset(self::$__ctx[$ctx]) ? self::$__ctx[$ctx] : self::$__context;
            $contx->xlocale = is_callable($xlocales) ? $xlocales : self::merge($contx->xlocale, (array)$xlocales);
        }
    }
    
    public static function clearLocales( $ctx='global' ) 
    { 
        $contx = $ctx && isset(self::$__ctx[$ctx]) ? self::$__ctx[$ctx] : self::$__context;
        $contx->locale = array(); 
    }
    
    public static function clearXLocales( $ctx='global' ) 
    { 
        $contx = $ctx && isset(self::$__ctx[$ctx]) ? self::$__ctx[$ctx] : self::$__context;
        $contx->xlocale = array(); 
    }
    
    public static function setCacheDir( $dir, $ctx='global' ) 
    {  
        $contx = $ctx && isset(self::$__ctx[$ctx]) ? self::$__ctx[$ctx] : self::$__context;
        $contx->cacheDir = rtrim($dir,'/').'/'; 
    }
    
    public static function setCacheMode( $mode, $ctx='global' ) 
    { 
        $contx = $ctx && isset(self::$__ctx[$ctx]) ? self::$__ctx[$ctx] : self::$__context;
        $contx->cacheMode = $mode; 
    }
    
    public static function clearCache( $all=false, $ctx='global' ) 
    { 
        $contx = $ctx && isset(self::$__ctx[$ctx]) ? self::$__ctx[$ctx] : self::$__context;
        $contx->cache = array(); 
        if ( $all ) $contx->partials = array(); 
    }
    
    public static function hasTpl( $tpl, $ctx='global' ) 
    {
        $contx = $ctx && isset(self::$__ctx[$ctx]) ? self::$__ctx[$ctx] : self::$__context;
        return !empty($tpl) && (isset($contx->templates[ $tpl ]) || isset(self::$__global->templates[ $tpl ]));
    }
    
    public static function add( $tpls, $ctx='global' ) 
    { 
        if ( $tpls && is_array($tpls) )
        {
            $contx = $ctx && isset(self::$__ctx[$ctx]) ? self::$__ctx[$ctx] : self::$__context;
            foreach ($tpls as $tplID=>$tplData)
            {
                if ( is_array( $tplData ) )
                {
                    // unified way to add tpls both as reference and inline
                    // inline tpl, passed as array
                    if ( isset($tplData[ 0 ]) )
                        $contx->templates[ $tplID ] = array($tplData[ 0 ], true);
                }
                else
                {
                    $contx->templates[ $tplID ] = array($tpls[ $tplID ], false); 
                }
            }
        }
    }
    
    public static function getTemplateContents( $id, $ctx='global' )
    {
        $contx = $ctx && isset(self::$__ctx[$ctx]) ? self::$__ctx[$ctx] : self::$__context;
        return self::get_template_contents( $id, $contx );
    }
    
    public static function parseTpl( $tpl, $options=array() ) 
    {
        // see what context this template may use
        $contx = null;
        if ( is_string($options) )
        {
            if ( isset(self::$__ctx[$options]) )
                $contx = self::$__ctx[$options]; // preset context
            else
                $contx = self::$__global; // global context
            $options = array();
        }
        
        $options = array_merge(array(
            'separators'=> null
        ), (array)$options);
        
        if ( isset($options['context']) )
        {
            if ( isset(self::$__ctx[$options['context']]) )
                $contx = self::$__ctx[$options['context']]; // preset context
            else if ( !$contx )
                $contx = self::$__global; // global context
            unset($options['context']);
        }
        if ( !$contx ) $contx = self::$__global; // global context
        
        $leftSep = self::$__leftTplSep; $rightSep = self::$__rightTplSep;
        $separators = $options && !empty($options['separators']) ? $options['separators'] : null;
        if ( $separators ) { $leftSep = $separators[ 0 ]; $rightSep = $separators[ 1 ]; }
        
        $_ctx = self::$__context;
        self::$__context = $contx;
        self::reset_state( );
        $parsed = self::parse( $tpl, $leftSep, $rightSep );
        self::clear_state( );
        self::$__context = $_ctx;
        
        return $parsed;
    }
        
    //
    // Main Template functions
    //
    
    public static function tpl( $tpl, $data=null, $options=array() )
    {
        if ( $tpl instanceof ContemplateTemplate )
        {
            $tmpl = $tpl;
        }
        else
        {
            // see what context this template may use
            $contx = null;
            if ( is_string($options) )
            {
                if ( isset(self::$__ctx[$options]) )
                    $contx = self::$__ctx[$options]; // preset context
                else
                    $contx = self::$__context; // current context
                $options = array();
            }
            
            $options = array_merge(array(
                 'separators'=> null
                ,'autoUpdate'=> false
                ,'refresh'=> false
                ,'escape'=> true
                ,'standalone'=> false
            ), (array)$options);
            
            if ( isset($options['context']) )
            {
                if ( isset(self::$__ctx[$options['context']]) )
                    $contx = self::$__ctx[$options['context']]; // preset context
                else if ( !$contx )
                    $contx = self::$__context; // current context
                unset($options['context']);
            }
            if ( !$contx ) $contx = self::$__context; // current context
            
            self::$__escape = false === $options['escape'] ? false : true;
            
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.
            if ( $options['refresh'] || (!isset($contx->cache[ $tpl ]) && !isset(self::$__global->cache[ $tpl ])) ) 
            {
                // load/parse required tpl (and any associated tpl)
                $_ctx = self::$__context;
                self::$__context = $contx;
                $contx->cache[ $tpl ] = self::get_cached_template( $tpl, $contx, $options );
                self::$__context = $_ctx;
            }
            
            $tmpl = isset($contx->cache[ $tpl ]) ? $contx->cache[ $tpl ] : self::$__global->cache[ $tpl ];
            $tmpl->autonomus( $options['standalone'] );
        }
        
        // Provide some basic currying to the user
        return is_array( $data ) ? $tmpl->render( $data ) : $tmpl;
    }
    
    public static function inline( $tpl, $reps=array(), $compiled=false )
    {
        if ( $tpl && ($tpl instanceof ContemplateInlineTemplate) ) return $tpl->render( (array)$reps );
        return new ContemplateInlineTemplate( $tpl, $reps, $compiled );
    }
    
    public static function is_array( $v, $strict=false ) 
    {
        return $strict ? is_array($v) && $v === array_values($v) : is_array($v);
    }
        
    public static function haskey( $v/*, key1, key2, etc.. */ ) 
    {
        if (!$v || !is_array($v)) return false;
        $args = func_get_args();
        $argslen = count($args);
        $tmp = $v;
        for ($i=1; $i<$argslen; $i++)
        {
            if (!array_key_exists($args[$i], $tmp)) return false;
            $tmp = $tmp[$args[$i]];
        }
        return true;
    }
        
    /*public static function iif( $cond, $then, $else=null ) 
    {
        return $cond ? $then : $else;
    }*/
        
    public static function e( $s, $entities=true ) 
    {
        return str_replace(
            array('&', '<', '>', '"', '\''),
            $entities
            ? array('&amp;', '&lt;', '&gt;', '&quot;', '&apos;')
            : array('&#38;', '&#60;', '&#62;', '&#34;', '&#39;'),
            $s
        );
    }
        
    public static function url( $s ) 
    { 
        return urlencode($s); 
    }
    
    public static function trim( $s, $charlist=null ) 
    { 
        return $charlist ? trim($s, $charlist) : trim($s); 
    }
    
    public static function ltrim( $s, $charlist=null ) 
    { 
        return $charlist ? ltrim($s, $charlist) : ltrim($s); 
    }
    
    public static function rtrim( $s, $charlist=null ) 
    { 
        return $charlist ? rtrim($s, $charlist) : rtrim($s); 
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
    
    public static function addslashes( $s )
    {
        return addslashes($s);
    }
    
    public static function stripslashes( $s )
    {
        return stripslashes($s);
    }
    
    public static function concat( ) 
    { 
        $args = func_get_args(); 
        return implode('', $args); 
    }
    
    //
    //  Localization functions
    //
    
    public static function time( ) 
    { 
        return time(); 
    }
    
    public static function date( $format, $timestamp=null ) 
    { 
        if ( null===$timestamp ) $timestamp = time(); 
        return date( $format, $timestamp ); 
    }
    
    public static function ldate( $format, $timestamp=null ) 
    { 
        if ( null===$timestamp ) $timestamp = time(); 
        return self::localized_date( $format, $timestamp );  
    }
    
    public static function locale( $s ) 
    { 
        $locale = is_callable(self::$__context->locale) || isset(self::$__context->locale[$s])
            ? self::$__context->locale
            : (is_callable(self::$__global->locale) || isset(self::$__global->locale[$s])
            ? self::$__global->locale
            : null); 
        if ( null === $locale ) return $s;
        if ( is_callable($locale) )
        {
            $args = func_get_args( );
            return call_user_func_array($locale, $args);
        }
        return $locale[$s];
    }
    
    public static function xlocale( $s, $l_ctx=null ) 
    { 
        $xlocale = is_callable(self::$__context->xlocale) || ($l_ctx && isset(self::$__context->xlocale[$l_ctx]) && isset(self::$__context->xlocale[$l_ctx][$s]))
            ? self::$__context->xlocale
            : (is_callable(self::$__global->xlocale) || ($l_ctx && isset(self::$__global->xlocale[$l_ctx]) && isset(self::$__global->xlocale[$l_ctx][$s]))
            ? self::$__global->xlocale
            : null); 
        if ( null === $xlocale ) return $s;
        if ( is_callable($xlocale) )
        {
            $args = func_get_args( );
            return call_user_func_array($xlocale, $args);
        }
        return $xlocale[$l_ctx][$s];
    }
    
    public static function nlocale( $n, $singular, $plural ) 
    { 
        $locale = is_callable(self::$__context->locale) || isset(self::$__context->locale[$singular])
            ? self::$__context->locale
            : (is_callable(self::$__global->locale) || isset(self::$__global->locale[$singular])
            ? self::$__global->locale
            : null); 
        if ( null === $locale ) return 1 == $n ? $singular : $plural;
        if ( is_callable($locale) )
        {
            $args = func_get_args( );
            array_splice($args, 0, 3, array(1 == $n ? $singular : $plural));
            return call_user_func_array($locale, $args);
        }
        return 1 == $n ? $locale[$singular] : (isset($locale[$plural]) ? $locale[$plural] : $plural);
    }
    
    public static function nxlocale( $n, $singular, $plural, $l_ctx=null ) 
    { 
        $xlocale = is_callable(self::$__context->xlocale) || ($l_ctx && isset(self::$__context->xlocale[$l_ctx]) && isset(self::$__context->xlocale[$l_ctx][$singular]))
            ? self::$__context->xlocale
            : (is_callable(self::$__global->xlocale) || ($l_ctx && isset(self::$__global->xlocale[$l_ctx]) && isset(self::$__global->xlocale[$l_ctx][$singular]))
            ? self::$__global->xlocale
            : null); 
        if ( null === $xlocale ) return 1 == $n ? $singular : $plural;
        if ( is_callable($xlocale) )
        {
            $args = func_get_args( );
            array_splice($args, 0, 3, array(1 == $n ? $singular : $plural));
            return call_user_func_array($xlocale, $args);
        }
        return 1 == $n ? $xlocale[$l_ctx][$singular] : (isset($xlocale[$l_ctx][$plural]) ? $xlocale[$l_ctx][$plural] : $plural);
    }
    
    public static function uuid( $namespace='UUID' ) 
    {
        return implode('_', array($namespace, ++self::$__uuid, time()));
    }
    
    public static function count( $a ) 
    { 
        return count($a); 
    }
    
    public static function keys( $o ) 
    {
        if ( $o ) return array_keys( $o );
        return null;
    }
    
    public static function values( $o ) 
    { 
        if ( $o ) return array_values( $o );
        return null;
    }
        
    public static function items( $o ) 
    { 
        if ( $o ) return $o;
        return null;
    }
        
    public static function merge( )
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
    
    public static function data( $d )
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
    
    public static function local_variable( $variable=null, $block=null )
    {
        if ( null === $variable )
        {
            return '$_loc_' . (++self::$__idcnt);
        }
        else
        {
            if ( null === $block ) $block = self::$__currentblock;
            self::$__locals[$block][self::$__variables[$block][$variable]] = 1; 
            return $variable;
        }
    }
    
    public static function is_local_variable( $variable, $block=null )
    {
        if ( null === $block ) $block = self::$__currentblock;
        return '$_loc_' === substr($variable, 0, 6) || !empty(self::$__locals[$block][self::$__variables[$block][$variable]]);
    }
    
    //
    // Control structures
    //
    
    private static function t_include( $id ) 
    { 
        $id = trim( $id );
        if ( self::$__strings && isset(self::$__strings[$id]) ) $id = self::$__strings[$id];
        $ch = $id[0];
        if ( '"' === $ch || "'" === $ch ) $id = substr($id,1,-1); // quoted id
        
        $contx = self::$__context;
        /* cache it */ 
        if ( !isset($contx->partials[$id]) /*&& !isset(self::$__global->partials[$id])*/ )
        {
            $state = self::push_state( );
            self::reset_state( );
            $tpl = self::get_template_contents( $id, $contx );
            $tpl = self::get_separators( $tpl );
            $contx->partials[$id]=" " . self::parse( $tpl, self::$__leftTplSep, self::$__rightTplSep, false ) . "';" . self::$__TEOL;
            self::pop_state( $state );
        }
        return self::pad_lines( /*isset($contx->partials[$id]) ?*/ $contx->partials[$id] /*: self::$__global->partials[$id]*/ );
    }
    
    private static function t_block( $block ) 
    { 
        $block = explode(',', $block);
        $echoed = !(isset($block[1]) ? "false"===trim($block[1]) : false);
        $block = trim($block[0]);
        if ( self::$__strings && isset(self::$__strings[$block]) ) $block = self::$__strings[$block];
        $ch = $block[0];
        if ( '"' === $ch || "'" === $ch ) $block = substr($block,1,-1); // quoted block
        
        array_push(self::$__allblocks, array($block, -1, -1, 0, self::$__openblocks[ 0 ][ 1 ], $echoed));
        self::$__allblockscnt[ $block ] = isset(self::$__allblockscnt[ $block ]) ? (self::$__allblockscnt[ $block ]+1) : 1;
        self::$__blockptr = count(self::$__allblocks);
        array_unshift(self::$__openblocks, array($block, self::$__blockptr-1));
        self::$__startblock = $block;
        self::$__endblock = null;
        self::$__currentblock = $block;
        if ( !isset(self::$__locals[self::$__currentblock]) ) self::$__locals[self::$__currentblock] = array();
        if ( !isset(self::$__variables[self::$__currentblock]) ) self::$__variables[self::$__currentblock] = array();
        return "' .  #BLOCK_" . $block . "#";
    }
    
    private static function t_endblock( ) 
    { 
        if ( 1 < count(self::$__openblocks) ) 
        {
            $block = array_shift(self::$__openblocks);
            self::$__endblock = $block[0];
            self::$__blockptr = $block[1]+1;
            self::$__startblock = null;
            self::$__currentblock = empty(self::$__openblocks) ? '_' : self::$__openblocks[0][0];
            return "#/BLOCK_" . $block[0] . "#";
        }
        else
        {
            self::$__currentblock = '_';
        }
        return '';  
    }

    //
    // auxilliary parsing methods
    //
    private static function parse_constructs( $match )
    {
        $parse_constructs = array(__CLASS__, 'parse_constructs');
        $re_controls = self::$re_controls;
        
        $prefix = !empty($match[1]) ? $match[1] : '';
        $ctrl = !empty($match[4]) ? $match[4] : (!empty($match[7]) ? $match[7] : '');
        $rest = !empty($match[9]) ? $match[9] : '';
        $startParen = !empty($match[8]) ? $match[8] : false;
        $args = '';
        $out = '';
        
        // parse parentheses and arguments, accurately
        if ( $startParen && strlen($startParen) )
        {
            $paren = 1; $l = strlen($rest); $i = 0;
            while ( $i < $l && $paren > 0 )
            {
                $ch = $rest[$i++];
                if ( '(' === $ch ) $paren++;
                else if ( ')' === $ch ) $paren--;
                if ( $paren > 0 ) $args .= $ch;
            }
            $rest = substr($rest, strlen($args)+1);
        }
        $args = trim($args);
        
        if ( isset(self::$__directive_aliases[$ctrl]) ) $ctrl = self::$__directive_aliases[$ctrl];
        $m = array_search($ctrl, self::$__directives);
        if ( false !== $m )
        {
            switch( $m )
            {
                case 0 /*'set'*/:
                case 20 /*'local_set'*/:
                    $args = preg_replace_callback( $re_controls, $parse_constructs, $args );
                    $args = self::split_arguments($args, ',');
                    $varname = trim(array_shift($args));
                    $expr = trim(implode(',', $args));
                    if ( 20 === $m && !self::is_local_variable($varname) ) self::local_variable( $varname ); // make it a local variable
                    $out = "';" . self::$__TEOL . self::pad_lines( "$varname = ($expr);" ) . self::$__TEOL;
                    break;
                case 1 /*'unset'*/:
                    $args = preg_replace_callback( $re_controls, $parse_constructs, $args );
                    $varname = $args;
                    if ( $varname && strlen($varname) )
                    {
                        $varname = trim( $varname );
                        $out = "';" . self::$__TEOL . self::pad_lines( "if (isset($varname)) unset( $varname );" ) . self::$__TEOL;
                    }
                    else
                    {
                        $out = "';" . self::$__TEOL; 
                    }
                    break;
                case 2 /*'isset'*/:
                    $args = preg_replace_callback( $re_controls, $parse_constructs, $args );
                    $varname = $args;
                    $out = '(isset(' . $varname . '))';
                    break;
                case 3 /*'if'*/:
                    $args = preg_replace_callback( $re_controls, $parse_constructs, $args );
                    $out = "';" . self::pad_lines(implode(self::$__TEOL, array(
                                    ""
                                    ,"if ({$args})"
                                    ,"{"
                                    ,""
                                )));
                    self::$__ifs++;  
                    self::$__level++;
                    break;
                case 4 /*'elseif'*/:
                    $args = preg_replace_callback( $re_controls, $parse_constructs, $args );
                    self::$__level--;
                    $out = "';" . self::pad_lines(implode(self::$__TEOL, array(
                                    ""
                                    ,"}"
                                    ,"elseif ({$args})"
                                    ,"{"
                                    ,""
                                )));
                    self::$__level++;
                    break;
                case 5 /*'else'*/:
                    self::$__level--;
                    $out = "';" . self::pad_lines(implode(self::$__TEOL, array(
                                    ""
                                    ,"}"
                                    ,"else"
                                    ,"{"
                                    ,""
                                )));
                    self::$__level++;
                    break;
                case 6 /*'endif'*/:
                    self::$__ifs--;  
                    self::$__level--;
                    $out = "';" . self::pad_lines(implode(self::$__TEOL, array(
                                    ""
                                    ,"}"
                                    ,""
                                )));
                    break;
                case 7 /*'for'*/:
                    $args = preg_replace_callback( $re_controls, $parse_constructs, $args );
                    $for_expr = $args;
                    $is_php_style = strpos($for_expr, ' as ');
                    $is_python_style = strpos($for_expr, ' in ');
                    
                    if ( false !== $is_python_style )
                    {
                        $for_expr = array(substr($for_expr, 0, $is_python_style), substr($for_expr, $is_python_style+4));
                        $o = trim($for_expr[1]); 
                        $_o = self::local_variable( );
                        $kv = explode(',', $for_expr[0]); 
                    }
                    else /*if ( false !== $is_php_style )*/
                    {
                        $for_expr = array(substr($for_expr, 0, $is_php_style), substr($for_expr, $is_php_style+4));
                        $o = trim($for_expr[0]); 
                        $_o = self::local_variable( );
                        $kv = explode('=>', $for_expr[1]); 
                    }
                    $isAssoc = (count($kv) >= 2);
                    
                    if ( $isAssoc )
                    {
                        $k = trim($kv[0]); $v = trim($kv[1]); 
                        self::local_variable( $k ); self::local_variable( $v );
                        
                        $out = "';" . self::pad_lines(implode(self::$__TEOL, array(
                                        ""
                                        ,"{$_o} = {$o};"
                                        ,"if (!empty({$_o}))"
                                        ,"{"
                                        ,"    foreach ({$_o} as {$k}=>{$v})"
                                        ,"    {"
                                        ,""
                                    )));
                        self::$__level+=2;
                    }
                    else
                    {
                        $v = trim($kv[0]); 
                        self::local_variable( $v );
                        
                        $out = "';" . self::pad_lines(implode(self::$__TEOL, array(
                                        ""
                                        ,"{$_o} = {$o};"
                                        ,"if (!empty({$_o}))"
                                        ,"{"
                                        ,"    foreach ({$_o} as {$v})"
                                        ,"    {"
                                        ,""
                                    )));
                        self::$__level+=2;
                    }
                    self::$__loops++;  self::$__loopifs++;
                    break;
                case 8 /*'elsefor'*/:
                    /* else attached to  for loop */ 
                    self::$__loopifs--;  
                    self::$__level+=-2;
                    $out = "';" . self::pad_lines(implode(self::$__TEOL, array(
                                    ""
                                    ,"    }"
                                    ,"}"
                                    ,"else"
                                    ,"{"
                                    ,""
                                )));
                    self::$__level+=1;
                    break;
                case 9 /*'endfor'*/:
                    if ( self::$__loopifs === self::$__loops ) 
                    { 
                        self::$__loops--; self::$__loopifs--;  
                        self::$__level+=-2;
                        $out = "';" . self::pad_lines(implode(self::$__TEOL, array(
                                        ""
                                        ,"    }"
                                        ,"}"
                                        ,""
                                    )));
                    }
                    else
                    {
                        self::$__loops--;  
                        self::$__level+=-1;
                        $out = "';" . self::pad_lines(implode(self::$__TEOL, array(
                                        ""
                                        ,"}"
                                        ,""
                                    )));
                    }
                    break;
                case 10 /*'extends'*/:
                    $id = trim( $args );
                    if ( self::$__strings && isset(self::$__strings[$id]) ) $id = self::$__strings[$id];
                    $ch = $id[0];
                    if ( '"' === $ch || "'" === $ch ) $id = substr($id,1,-1); // quoted id
                    self::$__extends = $id;
                    $out = "';" . self::$__TEOL; 
                    break;
                case 11 /*'block'*/:
                    $out = self::t_block($args); 
                    break;
                case 12 /*'endblock'*/:
                    $out = self::t_endblock(); 
                    break;
                case 13 /*'include'*/:
                    $out = self::t_include($args); 
                    break;
                case 14 /*'super'*/:
                    $args = preg_replace_callback( $re_controls, $parse_constructs, $args );
                    $out = $prefix . '$self->sprblock(' . $args . ', $data)';
                    break;
                case 15 /*'getblock'*/:
                    $args = preg_replace_callback( $re_controls, $parse_constructs, $args );
                    $out = $prefix . '$__i__->block(' . $args . ', $data)';
                    break;
                case 16 /*'iif'*/:
                    $args = self::split_arguments(preg_replace_callback( $re_controls, $parse_constructs, $args ),',');
                    $out = $prefix . "(({$args[0]})?({$args[1]}):({$args[2]}))";
                    break;
                case 17 /*'empty'*/:
                    $args = preg_replace_callback( $re_controls, $parse_constructs, $args );
                    $out = $prefix . "empty($args)";
                    break;
                case 18 /*'continue'*/:
                case 19 /*'break'*/:
                    $out = "';" . self::$__TEOL . self::pad_lines( 18===$m ? 'continue;' : 'break;' ) . self::$__TEOL;
                    break;
            }
            return $out . preg_replace_callback( $re_controls, $parse_constructs, $rest );
        }
        
        if ( isset(self::$__context->plugins[$ctrl]) || isset(self::$__global->plugins[$ctrl]) ) 
        {
            // allow custom plugins as template functions
            $pl = isset(self::$__context->plugins[$ctrl]) ? self::$__context->plugins[$ctrl] : self::$__global->plugins[$ctrl];
            $args = preg_replace_callback( $re_controls, $parse_constructs, $args );
            $out = $pl instanceof ContemplateInlineTemplate ? $pl->render(array_merge(array($args),self::split_arguments($args,','))) : 'Contemplate::plg_("' . $ctrl . '"' . (empty($args) ? '' : ',' . $args) . ')';
            return $prefix . $out . preg_replace_callback( $re_controls, $parse_constructs, $rest );
        }
        
        if ( isset(self::$__aliases[$ctrl]) ) $ctrl = self::$__aliases[$ctrl];
        $m = array_search($ctrl, self::$__funcs);
        if ( false !== $m )
        {
            $args = preg_replace_callback( $re_controls, $parse_constructs, $args );
            // aliases and builtin functions
            switch( $m )
            {
                case 0: case 5: $out = 'strval(' . $args . ')'; break;
                case 1: $out = 'intval(' . $args . ')'; break;
                case 2: $out = 'floatval(' . $args . ')'; break;
                case 3: $out = '"\'".(' . $args . ')."\'"'; break;
                case 4: $out = '\'"\'.(' . $args . ').\'"\''; break;
                case 6: $out = 'time()'; break;
                case 7: $out = 'count(' . $args . ')'; break;
                case 8: $out = 'strtolower(' . $args . ')'; break;
                case 9: $out = 'strtoupper(' . $args . ')'; break;
                case 10: $out = 'ucfirst(' . $args . ')'; break;
                case 11: $out = 'lcfirst(' . $args . ')'; break;
                case 12: $out = 'sprintf(' . $args . ')'; break;
                case 13: $out = 'date(' . $args . ')'; break;
                case 21: $out = '('.implode(').(',self::split_arguments($args,',')).')'; break;
                case 22: $out = 'ltrim(' . $args . ')'; break;
                case 23: $out = 'rtrim(' . $args . ')'; break;
                case 24: $out = 'trim(' . $args . ')'; break;
                case 25: $out = 'addslashes(' . $args . ')'; break;
                case 26: $out = 'stripslashes(' . $args . ')'; break;
                case 27: 
                    $args = self::split_arguments($args,',');
                    if ( isset($args[1]) )
                        $out = "(({$args[1]})?is_array({$args[0]})&&({$args[0]})===array_values({$args[0]}):is_array({$args[0]}))";
                    else
                        $out = "is_array({$args[0]})";
                    break;
                default: $out = 'Contemplate::' . $ctrl . '(' . $args . ')';
            }
            return $prefix . $out . preg_replace_callback( $re_controls, $parse_constructs, $rest );
        }
        
        return /*$match[0]*/ $prefix . $ctrl . ($startParen ? '('.preg_replace_callback( $re_controls, $parse_constructs, $args ).')' : '') . preg_replace_callback( $re_controls, $parse_constructs, $rest );
    }
    
    private static function split_arguments( $args, $delim=',' )
    {
        $args = trim( $args );
        $l = strlen($args);
        if ( !$l ) return array('');
        $i = 0;
        $a = array();
        $paren = array();
        $s = '';
        while ($i < $l)
        {
            $c = $args[$i++];
            if ( $delim === $c && empty($paren) )
            {
                $a[] = trim($s);
                $s = '';
                continue;
            }
            $s .= $c;
            if ( '(' === $c )
            {
                array_unshift($paren, ')');
            }
            elseif ( '{' === $c )
            {
                array_unshift($paren, '}');
            }
            elseif ( '[' === $c )
            {
                array_unshift($paren, ']');
            }
            elseif ( ')' === $c || '}' === $c || ']' === $c )
            {
                if ( empty($paren) || $paren[0] !== $c ) break;
                array_shift($paren);
            }
        }
        if ( strlen($s) ) $a[] = trim($s);
        if ( $i < $l ) $a[] = trim(substr($args, $i));
        return $a;
    }
    
    private static function parse_blocks( $s ) 
    {
        $blocks = array(); 
        $bl = count(self::$__allblocks);
        $EOL = self::$__TEOL;
        while ($bl--)
        {
            $delims = self::$__allblocks[ $bl ];
            
            $block = $delims[ 0 ];
            $pos1 = $delims[ 1 ];
            $pos2 = $delims[ 2 ];
            $off = $delims[ 3 ];
            $containerblock = $delims[ 4 ];
            $echoed = $delims[ 5 ];
            $tag = "#BLOCK_" . $block . "#";
            $rep = $echoed ? "\$__i__->block('" . $block . "', \$data);" : "'';";
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
                array_push($blocks, array($block, self::$TT_BLOCK->render(array(
                 'BLOCKCODE'        => substr($s, $pos1+$tl, $pos2-$tl-1-$pos1-$tl) ."';"
                ,'EOL'              => $EOL
                ))));
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
        //self::$__allblocks = null; self::$__allblockscnt = null; self::$__openblocks = null;
        return array($s, $blocks);
    }

    private static function parse_variable( $s, $i, $l )
    {
        if ( preg_match(self::$ALPHA, $s[$i], $m) )
        {
            $strings = array();
            $variables = array();
            $hasStrings = false;
            
            // main variable
            $variable = $s[$i++];
            while ( $i < $l && preg_match(self::$ALPHANUM, $s[$i], $m) )
            {
                $variable .= $s[$i++];
            }
            
            $variable_raw = $variable;
            // transform into tpl variable
            $variable_main = "\$data['" . $variable_raw . "']";
            $variable_rest = "";
            self::$__idcnt++;
            $id = "#VAR_" . self::$__idcnt . "#";
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
                        $variable_rest .= "['" . $property . "']";
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
                        //$property = self::parse_string( $s, $ch, $i+1, $l );
                        $str_ = $q = $ch;
                        $si = $i+1;
                        $escaped = false;
                        while ( $si < $l )
                        {
                            $ch = $s[$si++];
                            $str_ .= $ch;
                            if ( $q == $ch && !$escaped )  break;
                            $escaped = (!$escaped && '\\' == $ch);
                        }
                        $property = $str_;
                        self::$__idcnt++;
                        $strid = "#STR_" .self::$__idcnt . "#";
                        $strings[$strid] = $property;
                        $variable_rest .= $delim . $strid;
                        $lp = strlen($property);
                        $i += $lp;
                        $len += $space + 1 + $lp;
                        $space = 0;
                        $hasStrings = true;
                    }
                    
                    // numeric array property
                    elseif ( preg_match(self::$NUM, $ch, $m) )
                    {
                        $property = $s[$i++];
                        while ( $i < $l && preg_match(self::$NUM, $s[$i], $m) )
                        {
                            $property .= $s[$i++];
                        }
                        $variable_rest .= $delim . $property;
                        $lp = strlen($property);
                        $len += $space + 1 + $lp;
                        $space = 0;
                    }
                    
                    // sub-variable property
                    elseif ( '$' == $ch )
                    {
                        $sub = substr($s, $i+1);
                        $subvariables = self::parse_variable($sub, 0, strlen($sub));
                        if ( $subvariables )
                        {
                            // transform into tpl variable property
                            $property = end($subvariables);
                            $variable_rest .= $delim . $property[0];
                            $lp = $property[4];
                            $i += $lp + 1;
                            $len += $space + 2 + $lp;
                            $space = 0;
                            $variables = array_merge($variables, $subvariables);
                            $hasStrings = $hasStrings || $property[5];
                        }
                    }
                    
                    // close bracket
                    elseif ( ']' == $ch )
                    {
                        if ( $bracketcnt > 0 )
                        {
                            $bracketcnt--;
                            $variable_rest .= $delim . $s[$i++];
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
                            $variable_rest .= $s[$i++];
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
            
            $variables[] = array($id, $variable_raw, $variable_main, $variable_rest, $len, $hasStrings, $strings);
            return $variables;
        }
        return null;
    }
    
    private static function parse( $tpl, $leftTplSep, $rightTplSep, $withblocks=true ) 
    {
        static $str_re = '/#STR_\\d+#/';
        $re_controls = self::$re_controls;
        $ALPHA = self::$ALPHA;
        $ALPHANUM = self::$ALPHANUM;
        $non_compatibility_mode = !self::$__compatibility;
        $parse_constructs = array(__CLASS__, 'parse_constructs');
        
        $t1 = $leftTplSep; $l1 = strlen($t1);
        $t2 = $rightTplSep; $l2 = strlen($t2);
        $parsed = '';
        while ( !empty($tpl) )
        {
            $p1 = strpos( $tpl, $t1 );
            if ( false === $p1 )
            {
                $s = $tpl;
                if ( self::$__escape ) $s = str_replace( "\\", "\\\\", $s );  // escape escapes
                $s = str_replace( "'", "\\'", $s );  // escape single quotes accurately (used by parse function)
                $s = preg_replace( "/[\n]/", self::$__preserveLines, $s ); // preserve lines
                $parsed .= $s;
                break;
            }
            $p2 = strpos( $tpl, $t2, $p1+$l1 );
            if ( false === $p2 ) $p2 = strlen($tpl);
            
            $s = substr($tpl, 0, $p1);
            if ( self::$__escape ) $s = str_replace( "\\", "\\\\", $s );  // escape escapes
            $s = str_replace( "'", "\\'", $s );  // escape single quotes accurately (used by parse function)
            $s = preg_replace( "/[\n]/", self::$__preserveLines, $s ); // preserve lines
            $parsed .= $s;
            
            // template TAG
            $s = substr($tpl, $p1+$l1, $p2-$p1-$l1); $tpl = substr($tpl, $p2+$l2);
        
            // parse each template tag section accurately
            // refined parsing of strings and variables
            $count = strlen( $s );
            $index = 0;
            $ch = '';
            $out = '';
            $variables = array();
            $strings = array();
            $hasVariables = false;
            $hasStrings = false;
            $hasBlock = false;
            $space = 0;
            
            while ( $index < $count )
            {
                $ch = $s[$index++];
                
                // variable
                if ( '$' == $ch )
                {
                    if ( $space > 0 )
                    {
                        $out .= " ";
                        $space = 0;
                    }
                    $tok = self::parse_variable($s, $index, $count);
                    if ( $tok )
                    {
                        foreach ($tok as $tokv)
                        {
                            $id = $tokv[ 0 ];
                            self::$__variables[self::$__currentblock][ $id ] = $tokv[ 1 ];
                            if ( $tokv[ 5 ] ) $strings = array_merge( $strings, $tokv[ 6 ] );
                        }
                        $out .= $id;
                        $index += $tokv[ 4 ];
                        $variables = array_merge( $variables, $tok );
                        $hasVariables = true;
                        $hasStrings = $hasStrings || $tokv[ 5 ];
                    }
                    else
                    {
                        $out .= '$';
                    }
                }
                // literal string
                elseif ( '"' == $ch || "'" == $ch )
                {
                    if ( $space > 0 )
                    {
                        $out .= " ";
                        $space = 0;
                    }
                    //$tok = self::parse_string($s, $ch, $index, $count);
                    $str_ = $q = $ch;
                    $si = $index;
                    $escaped = false;
                    while ( $si < $count )
                    {
                        $ch = $s[$si++];
                        $str_ .= $ch;
                        if ( $q == $ch && !$escaped )  break;
                        $escaped = (!$escaped && '\\' == $ch);
                    }
                    $tok = $str_;
                    self::$__idcnt++;
                    $id = "#STR_" . self::$__idcnt . "#";
                    $strings[ $id ] = $tok;
                    $out .= $id;
                    $index += strlen($tok)-1;
                    $hasStrings = true;
                }
                // spaces
                elseif ( " " === $ch || "\n" === $ch || "\r" === $ch || "\t" === $ch || "\v" === $ch )
                {
                    $space++;
                }
                // directive or identifier or atom in compatibility mode
                elseif ( '%' === $ch )
                {
                    if ( $space > 0 )
                    {
                        $out .= " ";
                        $space = 0;
                    }
                    $q = $ch;
                    if ( $non_compatibility_mode || $index >= $count )
                    {
                        $out .= $q;
                        continue;
                    }
                    $ch = $s[$index];
                    if ( preg_match($ALPHA, $ch, $m) )
                    {
                        $tok = $ch;
                        $index++;
                        while ( $index < $count )
                        {
                            
                            $ch = $s[$index];
                            if ( preg_match($ALPHANUM, $ch, $m) )
                            {
                                $index ++;
                                $tok .= $ch;
                            }
                            else break;
                        }
                        $tok = '#ID_'.$tok.'#';
                        $out .= $tok;
                    }
                    else
                    {
                        $out .= $q;
                    }
                }
                // directive or identifier or atom
                elseif ( $non_compatibility_mode && preg_match($ALPHA, $ch, $m) )
                {
                    if ( $space > 0 )
                    {
                        $out .= " ";
                        $space = 0;
                    }
                    $tok = $ch;
                    while ( $index < $count )
                    {
                        
                        $ch = $s[$index];
                        if ( preg_match($ALPHANUM, $ch, $m) )
                        {
                            $index ++;
                            $tok .= $ch;
                        }
                        else break;
                    }
                    if ( 'as' !== $tok && 'in' !== $tok && 'null' !== $tok && 'false' !== $tok && 'true' !== $tok )
                    {
                        $tok = '#ID_'.$tok.'#';
                    }
                    $out .= $tok;
                }
                // rest, bypass
                else
                {
                    if ( $space > 0 )
                    {
                        $out .= " ";
                        $space = 0;
                    }
                    $out .= $ch;
                }
            }
            
            // fix literal data notation
            $out = str_replace(array('{', '}', '[', ']', ':'), array('array(', ')','array(', ')', '=>'), $out);
            
            $tag = "\t" . $out . "\v";
            
            self::$__startblock = null;  self::$__endblock = null; self::$__blockptr = -1;
            self::$__strings =& $strings;
            
            // directives and control constructs, functions, etc..
            $tag = preg_replace_callback( $re_controls, $parse_constructs, $tag );
            
            // check for blocks
            if ( self::$__startblock )
            {
                self::$__startblock = "#BLOCK_".self::$__startblock."#";
                $hasBlock = true;
            }
            elseif ( self::$__endblock )
            {
                self::$__endblock = "#/BLOCK_".self::$__endblock."#";
                $hasBlock = true;
            }
            $notFoundBlock = $hasBlock;
                
            // other replacements
            if ( "\t" === $tag[0] && "\v" === $tag[strlen($tag)-1] ) 
                $tag = '\' . (' . trim(substr($tag,1,-1)) . ') . \'';
            
            if ( $hasVariables )
            {
                // replace variables
                $lr = count($variables);
                for($v=$lr-1; $v>=0; $v--)
                {
                    $id = $variables[ $v ][ 0 ]; $varname = $variables[ $v ][ 1 ];
                    $tag = str_replace( $id.'__RAW__', $varname, $tag );
                    if ( isset(self::$__locals[self::$__currentblock][$varname]) ) /* local (loop) variable */
                        $tag = str_replace( $id, '$_loc_' . $varname . $variables[ $v ][ 3 ], $tag );
                    else /* default (data) variable */
                        $tag = str_replace( $id, $variables[ $v ][ 2 ] . $variables[ $v ][ 3 ], $tag );
                }
            }
            
            if ( $hasStrings )
            {
                // replace strings (accurately)
                $tagTpl = ContemplateInlineTemplate::multisplit_re($tag, $str_re);
                $tag = '';
                foreach ($tagTpl as $v)
                {
                    if ( $v[0] )
                    {
                        // and replace blocks (accurately)
                        if ( $notFoundBlock )
                        {
                            if ( self::$__startblock )
                            {
                                $blockTag = strpos($v[1], self::$__startblock);
                                if ( false !== $blockTag )
                                {
                                    self::$__allblocks[ self::$__blockptr-1 ][ 1 ] = $blockTag + strlen($parsed) + strlen($tag);
                                    $notFoundBlock = false;
                                }
                            }
                            else //if ( self::$__endblock )
                            {
                                $blockTag = strpos($v[1], self::$__endblock);
                                if ( false !== $blockTag )
                                {
                                    self::$__allblocks[ self::$__blockptr-1 ][ 2 ] = $blockTag + strlen($parsed) + strlen($tag) + strlen(self::$__endblock);
                                    $notFoundBlock = false;
                                }
                            }
                        }
                        $tag .= $v[1];
                    }
                    else
                    {
                        $tag .= $strings[ $v[1] ];
                    }
                }
            }
            elseif ( $hasBlock )
            {
                // replace blocks (accurately)
                if ( self::$__startblock )
                    self::$__allblocks[ self::$__blockptr-1 ][ 1 ] = strlen($parsed) + strpos($tag, self::$__startblock );
                else //if ( self::$__endblock )
                    self::$__allblocks[ self::$__blockptr-1 ][ 2 ] = strlen($parsed) + strpos($tag, self::$__endblock ) + strlen(self::$__endblock);
            }
            
            // replace tpl separators
            if ( "\v" === $tag[strlen($tag)-1] ) 
            {
                $tag = substr($tag,0,-1) . self::pad_lines( self::$__tplEnd );
            }
            if ( "\t" === $tag[0] ) 
            {
                $tag = self::$__tplStart . substr($tag,1);
                if ( $hasBlock )
                {
                    // update blocks (accurately)
                    $blockTag = strlen(self::$__tplStart)-1;
                    if ( self::$__startblock )
                        self::$__allblocks[ self::$__blockptr-1 ][ 1 ] += $blockTag;
                    else //if ( self::$__endblock )
                        self::$__allblocks[ self::$__blockptr-1 ][ 2 ] += $blockTag;
                }
            }
                
            $parsed .= $tag;
        }
        return false !== $withblocks ? (!empty(self::$__allblocks) ? self::parse_blocks($parsed) : array($parsed, array())) : $parsed;
    }
    
    private static function get_separators( $text, $separators=null )
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
            $l = strlen( $text ); $i = 0; $pos = -1; $line = "";
            while ( $i < $l && false !== $pos && empty($line) )
            {
                $i = $pos+1;
                $pos = strpos( $text, "\n", $i );
                $line = false !== $pos ? trim(substr($text, $i, $pos+1-$i)) : "";
            }
            if ( !empty($line) )
            {
                $seps = explode( " ", $line );
                self::$__leftTplSep = trim( $seps[ 0 ] );
                self::$__rightTplSep = trim( $seps[ 1 ] );
                $text = substr( $text, $pos+1 );
            }
        }
        return $text;
    }
    
    private static function get_cached_template_name( $id, $ctx, $cacheDir ) 
    { 
        return $cacheDir . preg_replace('/[\\W]+/', '_', $id) . '_tpl__' . preg_replace('/[\\W]+/', '_', $ctx) .'.php'; 
    }
    
    private static function get_cached_template_class( $id, $ctx ) 
    { 
        return 'Contemplate_' .  preg_replace('/[\\W]+/', '_', $id) . '__' . preg_replace('/[\\W]+/', '_', $ctx);  
    }
    
    private static function get_template_contents( $id, $contx )
    {
        if ( isset($contx->templates[$id]) ) $template = $contx->templates[$id];
        elseif ( isset(self::$__global->templates[$id]) ) $template = self::$__global->templates[$id];
        else return '';
        
        if ( $template[1] ) return $template[0]; // inline tpl
        elseif ( is_file($template[0]) ) return file_get_contents( $template[0] );
        return '';
    }
    
    private static function create_template_render_function( $id, $contx, $seps=null )
    {
        self::reset_state( );
        $tpl = self::get_template_contents( $id, $contx );
        $tpl = self::get_separators( $tpl, $seps );
        $blocks = self::parse( $tpl, self::$__leftTplSep, self::$__rightTplSep );
        self::clear_state( );
        
        $renderf = $blocks[0];
        $blocks = $blocks[1];
        $bl = count($blocks);
        
        $EOL = self::$__TEOL;
        
        $func = self::$TT_FUNC->render(array(
         'FCODE'        => self::$__extends ? "" : "\$__p__ .= '" . $renderf . "';"
        ,'EOL'          => $EOL
        ));
        
        $fn = create_function('&$data,$self,$__i__', $func);
        
        $blockfns = array();  
        for($b=0; $b<$bl; $b++) 
        {
            $blockfns[$blocks[$b][0]] = create_function('&$data,$self,$__i__', $blocks[$b][1]);
        }
        return array($fn, $blockfns);
    }
    
    private static function create_cached_template( $id, $contx, $filename, $classname, $seps=null )
    {
        self::reset_state( );
        $tpl = self::get_template_contents( $id, $contx );
        $tpl = self::get_separators( $tpl, $seps );
        $blocks = self::parse( $tpl, self::$__leftTplSep, self::$__rightTplSep );
        self::clear_state( );
        
        $renderf = $blocks[0];
        $blocks = $blocks[1];
        $bl = count($blocks);
        
        $EOL = self::$__TEOL;
        
        // tpl-defined blocks
        $sblocks = '';
        for($b=0; $b<$bl; $b++) 
            $sblocks .= $EOL . self::$TT_BlockCode->render(array(
             'BLOCKNAME'            => $blocks[$b][0]
            ,'BLOCKMETHODNAME'      => "_blockfn_" . $blocks[$b][0]
            ,'BLOCKMETHODCODE'      => self::pad_lines($blocks[$b][1], 1)
            ,'EOL'                  => $EOL
            ));
        
        $renderCode = self::$TT_RCODE->render(array(
         'RCODE'                => self::$__extends ? "\$__p__ = '';" : "\$__p__ .= '" . $renderf . "';"
        ,'EOL'                  => $EOL
        ));
        $extendCode = self::$__extends ? "\$self->extend('".self::$__extends."');" : '';
        $prefixCode = $contx->prefix ? $contx->prefix : '';
            
        // generate tpl class
        $class = '<?php ' . $EOL . self::$TT_ClassCode->render(array(
         'PREFIXCODE'           => $prefixCode
        ,'TPLID'                => $id
        ,'CLASSNAME'            => $classname
        ,'EXTENDCODE'           => self::pad_lines($extendCode, 1)
        ,'BLOCKS'               => $sblocks
        ,'RENDERCODE'           => self::pad_lines($renderCode, 2)
        ,'EOL'                  => $EOL
        ));
        
        return file_put_contents( $filename, $class );
    }
    
    private static function get_cached_template( $id, $contx, $options=array() )
    {
        if ( isset($contx->templates[$id]) ) $template = $contx->templates[$id];
        elseif ( isset(self::$__global->templates[$id]) ) $template = self::$__global->templates[$id];
        else $template = null;
        if ( $template )
        {
            // inline templates saved only in-memory
            if ( $template[1] )
            {
                // dynamic in-memory caching during page-request
                //return new Contemplate($id, self::create_template_render_function($id));
                $tpl = new ContemplateTemplate( $id ); $tpl->ctx( $contx );
                if ( isset($options['parsed']) && is_string($options['parsed']) )
                {
                    // already parsed code was given
                    $tpl->setRenderFunction( create_function('&$data,$self,$__i__', $options['parsed']) ); 
                }
                else
                {
                    $fns = self::create_template_render_function( $id, $contx, $options['separators'] );
                    $tpl->setRenderFunction( $fns[0] )->setBlocks( $fns[1] );
                }
                $sprTpl = self::$__extends;
                if ( $sprTpl ) $tpl->extend( self::tpl($sprTpl, null, $contx->id) );
                return $tpl;
            }
            
            else
            {
                if ( true !== $options['autoUpdate'] && self::CACHE_TO_DISK_NOUPDATE === $contx->cacheMode )
                {
                    $cachedTplFile = self::get_cached_template_name( $id, $contx->id, $contx->cacheDir );
                    $cachedTplClass = self::get_cached_template_class( $id, $contx->id );
                    if ( !is_file( $cachedTplFile ) )
                    {
                        // if not exist, create it
                        self::create_cached_template( $id, $contx, $cachedTplFile, $cachedTplClass, $options['separators'] );
                    }
                    if ( is_file( $cachedTplFile ) )
                    {
                        include( $cachedTplFile );
                        $tpl = new $cachedTplClass( );
                        $tpl->setId( $id )->ctx( $contx );
                        return $tpl;
                    }
                    return null;
                }
                
                elseif ( true === $options['autoUpdate'] || self::CACHE_TO_DISK_AUTOUPDATE === $contx->cacheMode )
                {
                    $cachedTplFile = self::get_cached_template_name( $id, $contx->id, $contx->cacheDir );
                    $cachedTplClass = self::get_cached_template_class( $id, $contx->id );
                    if ( !is_file( $cachedTplFile ) || (filemtime( $cachedTplFile ) <= filemtime( $template[0] )) )
                    {
                        // if tpl not exist or is out-of-sync (re-)create it
                        self::create_cached_template( $id, $contx, $cachedTplFile, $cachedTplClass, $options['separators'] );
                    }
                    if ( is_file( $cachedTplFile ) )
                    {
                        include( $cachedTplFile );
                        $tpl = new $cachedTplClass( );
                        $tpl->setId( $id )->ctx( $contx );
                        return $tpl;
                    }
                    return null;
                }
                
                else
                {
                    // dynamic in-memory caching during page-request
                    $fns = self::create_template_render_function( $id, $contx, $options['separators'] );
                    $tpl = new ContemplateTemplate( $id );
                    $tpl->ctx( $contx )->setRenderFunction( $fns[0] )->setBlocks( $fns[1] );
                    $sprTpl = self::$__extends;
                    if ( $sprTpl ) $tpl->extend( self::tpl($sprTpl, null, $contx->id) );
                    return $tpl;
                }
            }
        }
        return null;
    }
    
    private static function reset_state( ) 
    {
        self::$__loops = 0; self::$__ifs = 0; self::$__loopifs = 0; self::$__level = 0;
        self::$__allblocks = array(); self::$__allblockscnt = array(); self::$__openblocks = array(array(null, -1));  
        self::$__extends = null; self::$__locals = array(); self::$__variables = array(); self::$__currentblock = '_';
        if ( !isset(self::$__locals[self::$__currentblock]) ) self::$__locals[self::$__currentblock] = array();
        if ( !isset(self::$__variables[self::$__currentblock]) ) self::$__variables[self::$__currentblock] = array();
        //self::$__escape = true;
    }
    
    private static function clear_state( ) 
    {
        self::$__loops = 0; self::$__ifs = 0; self::$__loopifs = 0; self::$__level = 0;
        self::$__allblocks = null; self::$__allblockscnt = null; self::$__openblocks = null;
        /*self::$__extends = null;*/ self::$__locals = null; self::$__variables = null; self::$__currentblock = null;
        self::$__idcnt = 0; self::$__strings = null;
    }
    
    private static function push_state( ) 
    {
        return array(self::$__loops, self::$__ifs, self::$__loopifs, self::$__level,
        self::$__allblocks, self::$__allblockscnt, self::$__openblocks, self::$__extends, self::$__locals, self::$__variables, self::$__currentblock);
    }
    
    private static function pop_state( $state ) 
    {
        self::$__loops = $state[0]; self::$__ifs = $state[1]; self::$__loopifs = $state[2]; self::$__level = $state[3];
        self::$__allblocks = $state[4]; self::$__allblockscnt = $state[5]; self::$__openblocks = $state[6];
        self::$__extends = $state[7]; self::$__locals = $state[8]; self::$__variables = $state[9]; self::$__currentblock = $state[10];
    }
    
    private static function localized_date( $format, $timestamp ) 
    {
        $F = array('d','D','j','l','N','S','w','z','W','F','m','M','t','L','o','Y','y','a','A','B','g','G','h','H','i','s','u','e','I','O','P','T','Z','U');
        $D = array( );
        $DATE = explode( "\n", date( implode( "\n", $F ), $timestamp ) );
        foreach($F as $i=>$f) $D[$f] = $DATE[$i];
        
        // localise specific formats
        $D['D'] = self::locale( $D['D'] );
        $D['l'] = self::locale( $D['l'] );
        $D['S'] = self::locale( $D['S'] );
        $D['F'] = self::locale( $D['F'] );
        $D['M'] = self::locale( $D['M'] );
        $D['a'] = self::locale( $D['a'] );
        $D['A'] = self::locale( $D['A'] );
        
        // full date/time formats, constructed from localised parts
        $D['c'] = $D['Y'].'-'.$D['m'].'-'.$D['d'].'\\'.$D['T'].$D['H'].':'.$D['i'].':'.$D['s'].$D['P'];
        $D['r'] = $D['D'].', '.$D['d'].' '.$D['M'].' '.$D['Y'].' '.$D['H'].':'.$D['i'].':'.$D['s'].' '.$D['O'];
        
        // return localized date
        $localised_datetime = ''; $l = strlen($format);
        for($i=0; $i<$l; $i++)
        {
            $f = $format[$i];
            $localised_datetime .= isset($D[$f]) ? $D[$f] : $f;
        }
        return $localised_datetime;
    }
    
    private static function pad_lines( $lines, $level=null )
    {
        if ( null === $level )  $level = self::$__level;
        
        if ($level>=0)
        {
            $pad = str_repeat(self::$__pad, $level);
            $lines = $pad . (implode( self::$__TEOL . $pad, preg_split(self::$NEWLINE, $lines) ));
        }
        
        return $lines;
    }
}

// init the engine on first load
Contemplate::init( );
}
