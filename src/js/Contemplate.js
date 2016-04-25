/**
*  Contemplate
*  Light-weight Template Engine for PHP, Python, Node, client-side and XPCOM/SDK JavaScript
*
*  @version: 1.1.5
*  https://github.com/foo123/Contemplate
*
*  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed
*  http://ejohn.org/blog/javascript-micro-templating/
*
**/
!function( root, name, factory ) {
"use strict";
var m;
if ( ('undefined'!==typeof Components)&&('object'===typeof Components.classes)&&('object'===typeof Components.classesByID)&&Components.utils&&('function'===typeof Components.utils['import']) ) /* XPCOM */
    (root.EXPORTED_SYMBOLS = [ name ]) && (root[ name ] = factory.call( root ));
else if ( ('object'===typeof module)&&module.exports ) /* CommonJS */
    module.exports = factory.call( root );
else if ( ('function'===typeof(define))&&define.amd&&('function'===typeof(require))&&('function'===typeof(require.specified))&&require.specified(name) ) /* AMD */
    define(name,['require','exports','module'],function( ){return factory.call( root );});
else if ( !(name in root) ) /* Browser/WebWorker/.. */
    (root[ name ] = (m=factory.call( root )))&&('function'===typeof(define))&&define.amd&&define(function( ){return m;} );
}(  /* current root */          this, 
    /* module name */           "Contemplate",
    /* module factory */        function( undef ) {
"use strict";
/////////////////////////////////////////////////////////////////////////////////////
//
//  Contemplate Engine Main Class
//
//////////////////////////////////////////////////////////////////////////////////////

// private vars
var __version__ = "1.1.5", Contemplate,

    PROTO = 'prototype', HAS = 'hasOwnProperty',
    Obj = Object, Arr = Array, toString = Obj[PROTO].toString,
    NOP = function( ){ },
    
    isXPCOM = ("undefined" !== typeof Components) && ("object" === typeof Components.classes) && ("object" === typeof Components.classesByID) && Components.utils && ("function" === typeof Components.utils['import']),
    isNode = "undefined" !== typeof(global) && '[object global]' === toString.call(global),
    
    $Scope = this,
    
    Cu = isXPCOM ? Components.utils : null,
    Cc = isXPCOM ? Components.classes : null,
    Ci = isXPCOM ? Components.interfaces : null,
    import_ = isXPCOM ? Cu['import'] : (isNode ? require : NOP),
    fs = isNode ? import_('fs') : null,
    import_module = isXPCOM
    ? function import_module( name, path ){ import_( path, $Scope ); return $Scope[ name ]; }
    : (isNode
    ? function import_module( name, path ){ return import_( path ); }
    : NOP),
    XHR = function( ) {
    return window.XMLHttpRequest
        // code for IE7+, Firefox, Chrome, Opera, Safari
        ? new XMLHttpRequest( )
        // code for IE6, IE5
        : new ActiveXObject("Microsoft.XMLHTTP") // or ActiveXObject("Msxml2.XMLHTTP"); ??
    ;
    },
    
    $__isInited = false, $__async = false, 
    
    $__leftTplSep = "<%", $__rightTplSep = "%>", $__tplStart = "", $__tplEnd = "",
    // https://nodejs.org/api/os.html#os_os_eol
    // 
    $__EOL = "\n", $__TEOL = isNode ? import_('os').EOL : "\n", $__escape = true,
    $__preserveLinesDefault = "' + \"\\n\" + '", $__preserveLines = '',  $__compatibility = false,
    
    $__level = 0, $__pad = "    ", $__idcnt = 0,
    $__locals, $__variables, $__loops = 0, $__ifs = 0, $__loopifs = 0, $__forType = 2,
    $__allblocks = null, $__allblockscnt = null,  $__openblocks = null,
    $__currentblock, $__startblock = null, $__endblock = null, $__blockptr = -1,
    $__extends = null, $__strings = null,
    $__ctx, $__global, $__context, $__uuid = 0,
    
    UNDERLN = /[\W]+/g, NEWLINE = /\n\r|\r\n|\n|\r/g, SQUOTE = /'/g,
    ALPHA = /^[a-zA-Z_]/, NUM = /^[0-9]/, ALPHANUM = /^[a-zA-Z0-9_]/i, SPACE = /^\s/,
    re_controls = /(\t|\s?)\s*((#ID_(continue|endblock|elsefor|endfor|endif|break|else|fi)#(\s*\(\s*\))?)|(#ID_([^#]+)#\s*(\()))(.*)$/g,
    
    $__directives = [
    'set', 'unset', 'isset',
    'if', 'elseif', 'else', 'endif',
    'for', 'elsefor', 'endfor',
    'extends', 'block', 'endblock',
    'include', 'super', 'getblock', 'iif', 'empty', 'continue', 'break', 'local_set'
    ],
    $__directive_aliases = {
     'elif'     : 'elseif'
    ,'fi'       : 'endif'
    },
    $__funcs = [ 
    's', 'n', 'f', 'q', 'qq', 
    'echo', 'time', 'count',
    'lowercase', 'uppercase', 'ucfirst', 'lcfirst', 'sprintf',
    'date', 'ldate', 'locale', 'xlocale',
    'inline', 'tpl', 'uuid', 'haskey',
    'concat', 'ltrim', 'rtrim', 'trim', 'addslashes', 'stripslashes',
    'is_array', 'in_array', 'json_encode', 'json_decode',
    'camelcase', 'snakecase', 'e', 'url', 'nlocale', 'nxlocale'
    ],
    $__aliases = {
     'l'        : 'locale'
    ,'xl'       : 'xlocale'
    ,'nl'       : 'nlocale'
    ,'nxl'      : 'nxlocale'
    ,'cc'       : 'concat'
    ,'dq'       : 'qq'
    ,'now'      : 'time'
    ,'template' : 'tpl'
    },
    // generated cached tpl class code as a "heredoc" template (for Node cached templates)
    TT_ClassCode,   
    // generated cached tpl block method code as a "heredoc" template (for Node cached templates)
    TT_BlockCode, TT_BLOCK,
    TT_FUNC, TT_RCODE
;

if ( isXPCOM )
{
    // do some necessary imports
    import_("resource://gre/modules/NetUtil.jsm");
    import_("resource://gre/modules/FileUtils.jsm");
}

function reset_state( )
{
    $__loops = 0; $__ifs = 0; $__loopifs = 0; $__forType = 2; $__level = 0;
    $__allblocks = []; $__allblockscnt = {}; $__openblocks = [[null, -1]];
    $__extends = null; $__locals = {}; $__variables = {}; $__currentblock = '_';
    $__locals[$__currentblock] = $__locals[$__currentblock] || {};
    $__variables[$__currentblock] = $__variables[$__currentblock] || {};
}
function clear_state( )
{
    $__loops = 0; $__ifs = 0; $__loopifs = 0; $__forType = 2; $__level = 0;
    $__allblocks = null; $__allblockscnt = null; $__openblocks = null;
    $__locals = null; $__variables = null; $__currentblock = null;
    $__idcnt = 0; $__strings = null;
    /*$__extends = null;*/
}
function push_state( )
{
    return [$__loops, $__ifs, $__loopifs, $__forType, $__level,
    $__allblocks, $__allblockscnt, $__openblocks, $__extends, $__locals, $__variables, $__currentblock];
}
function pop_state( state )
{
    $__loops = state[0]; $__ifs = state[1]; $__loopifs = state[2]; $__forType = state[3]; $__level = state[4];
    $__allblocks = state[5]; $__allblockscnt = state[6]; $__openblocks = state[7];
    $__extends = state[8]; $__locals = state[9]; $__variables = state[10]; $__currentblock = state[11];
}
function pad_lines( lines, level )
{
    // pad lines to generate formatted code
    if ( 2 > arguments.length ) level = $__level;
    if ( level >= 0 )
    {
        // needs one more additional level due to array.length
        var pad = 0===level ? "" : new Arr(level+1).join($__pad);
        lines = pad + lines.split( NEWLINE ).join( $__TEOL + pad );
    }
    return lines;
}
function merge( )
{
    var args = arguments, l = args.length;
    if ( l < 1 ) return;
    var merged = args[0], i, k, o;
    for (i=1; i<l; i++)
    { 
        o = args[ i ]; 
        if ( o ) for (k in o) if ( o[HAS](k) ) merged[ k ] = o[ k ]; 
    }
    return merged;
}
function get_separators( text, separators )
{
    var line, seps, pos, i, l;
    if ( separators )
    {
        seps = trim( separators ).split( " " );
        $__leftTplSep = trim( seps[ 0 ] );
        $__rightTplSep = trim( seps[ 1 ] );
    }
    else
    {
        // tpl separators are defined on 1st (non-empty) line of tpl content
        l = text.length; i = 0; pos = 0; line = "";
        while ( i < l && -1 < pos && !line.length )
        {
            pos = text.indexOf( "\n", i );
            line = -1 < pos ? trim( text.slice(i, pos+1) ) : "";
            i = pos+1;
        }
        if ( line.length )
        {
            seps = line.split( " " );
            $__leftTplSep = trim( seps[ 0 ] );
            $__rightTplSep = trim( seps[ 1 ] );
            text = text.slice( pos+1 );
        }
    }
    return text;
}

function split_arguments( args, delim )
{
    args = trim(args);
    if ( !args.length ) return [''];
    if ( arguments.length < 2 ) delim = ',';
    var a = [], paren = [], s = '', i = 0, l = args.length, c;
    while (i < l)
    {
        c = args.charAt(i++);
        if ( delim === c && !paren.length )
        {
            a.push(trim(s));
            s = '';
            continue;
        }
        s += c;
        if ( '(' === c )
        {
            paren.unshift(')');
        }
        else if ( '{' === c )
        {
            paren.unshift('}');
        }
        else if ( '[' === c )
        {
            paren.unshift(']');
        }
        else if ( ')' === c || '}' === c || ']' === c )
        {
            if ( !paren.length || paren[0] !== c ) break;
            paren.shift();
        }
    }
    if ( s.length ) a.push(trim(s));
    if ( i < l ) a.push(trim(args.slice(i)));
    return a;
}    

function local_variable( variable, block )
{
    if ( null == variable )
    {
        return '_loc_' + (++$__idcnt);
    }
    else
    {
        if ( null == block ) block = $__currentblock;
        $__locals[block][$__variables[block][variable]] = 1;
        return variable;
    }
}

function is_local_variable( variable, block )
{
    if ( null == block ) block = $__currentblock;
    return '_loc_' === variable.slice(0, 5) || !!$__locals[block][$__variables[block][variable]];
}
    
//
// Control structures
//

function t_include( id/*, asyncCB*/ )
{
    var tpl, state, ch, contx = $__context;
    id = trim( id );
    if ( $__strings && $__strings[HAS](id) ) id = $__strings[id];
    ch = id.charAt(0);
    if ( '"' === ch || "'" === ch ) id = id.slice(1,-1); // quoted id
    
    // cache it
    if ( !contx.partials[id] /*&& !$__global.partials[id]*/ )
    {
        state = push_state( );
        reset_state( );
        tpl = get_template_contents( id, contx );
        tpl = get_separators( tpl );
        contx.partials[id] = " " + parse( tpl, $__leftTplSep, $__rightTplSep, false ) + "';" + $__TEOL;
        pop_state( state );
    }
    return pad_lines( contx.partials[id] /*|| $__global.partials[id]*/ );
}
function t_block( block )
{ 
    block = block.split(',');
    var echoed = !(block.length>1 ? "false"===trim(block[1]) : false);
    block = trim(block[0]);
    if ( $__strings && $__strings[HAS](block) ) block = $__strings[block];
    var ch = block.charAt(0);
    if ( '"' === ch || "'" === ch ) block = block.slice(1,-1); // quoted block
    
    $__allblocks.push( [block, -1, -1, 0, $__openblocks[ 0 ][ 1 ], echoed] );
    $__allblockscnt[ block ] = $__allblockscnt[ block ] ? ($__allblockscnt[ block ]+1) : 1;
    $__blockptr = $__allblocks.length;
    $__openblocks.unshift( [block, $__blockptr-1] );
    $__startblock = block;
    $__endblock = null;
    $__currentblock = block;
    $__locals[$__currentblock] = $__locals[$__currentblock] || {};
    $__variables[$__currentblock] = $__variables[$__currentblock] || {};
    return "' +  #BLOCK_" + block + "#";
}
function t_endblock( )
{ 
    if ( 1 < $__openblocks.length ) 
    {
        var block = $__openblocks.shift( );
        $__endblock = block[0];
        $__blockptr = block[1]+1;
        $__startblock = null;
        $__currentblock = $__openblocks.length ? $__openblocks[0][0] : '_';
        return "#/BLOCK_" + block[0] + "#";
    }
    else
    {
        $__currentblock = '_';
    }
    return '';  
}

//
// auxilliary parsing methods
function parse_constructs( match0, match1, match2, match3, match4, match5, match6, match7, match8, match9 )
{
    var prefix = match1 || '',
        ctrl = match4 || match7 || '',
        rest = match9 || '',
        startParen = match8 || false,
        args = '',  out = '', paren = 0, l, i, ch, m,
        varname, expr;
    
    // parse parentheses and arguments, accurately
    if ( startParen && startParen.length )
    {
        paren = 1; l = rest.length; i = 0;
        while ( i < l && paren > 0 )
        {
            ch = rest.charAt(i++);
            if ( '(' === ch ) paren++;
            else if ( ')' === ch ) paren--;
            if ( paren > 0 ) args += ch;
        }
        rest = rest.slice(args.length+1);
    }
    args = trim(args);
    
    if ( $__directive_aliases[HAS](ctrl) ) ctrl = $__directive_aliases[ctrl];
    m = $__directives.indexOf( ctrl );
    if ( -1 < m )
    {
        switch ( m )
        {
            case 0 /*'set'*/: 
            case 20 /*'local_set'*/: 
                args = args.replace( re_controls, parse_constructs );
                args = split_arguments(args, ',');
                varname = trim(args.shift());
                expr = trim(args.join( ',' ));
                if ( 20 === m && !is_local_variable(varname) )
                {
                    local_variable( varname ); // make it a local variable
                    varname = 'var '+varname;
                }
                out = "';" + $__TEOL + pad_lines( varname + ' = ('+ expr +');' ) + $__TEOL;
                break;
            case 1 /*'unset'*/: 
                args = args.replace( re_controls, parse_constructs );
                varname = args;
                if ( varname && varname.length )
                {
                    varname = trim( varname );
                    out = "';" + $__TEOL + pad_lines( 'if ("undefined" !== typeof(' + varname + ')) delete ' + varname + ';' ) + $__TEOL;
                }
                else
                {
                    out = "';" + $__TEOL; 
                }
                break;
            case 2 /*'isset'*/: 
                args = args.replace( re_controls, parse_constructs );
                varname = args;
                out = '("undefined" !== typeof(' + varname + ') && null !== ' + varname + ')';
                break;
            case 3 /*'if'*/: 
                args = args.replace( re_controls, parse_constructs );
                out = "';" + pad_lines([
                                ""
                                ,"if ("+args+")"
                                ,"{"
                                ,""
                            ].join( $__TEOL ));
                $__ifs++; 
                $__level++;
                break;
            case 4 /*'elseif'*/:  
                args = args.replace( re_controls, parse_constructs );
                $__level--;
                out = "';" + pad_lines([
                                ""
                                ,"}"
                                ,"else if ("+args+")"
                                ,"{"
                                ,""
                            ].join( $__TEOL ));
                $__level++;
                break;
            case 5 /*'else'*/: 
                $__level--;
                out = "';" + pad_lines([
                                ""
                                ,"}"
                                ,"else"
                                ,"{"
                                ,""
                            ].join( $__TEOL ));
                $__level++;
                break;
            case 6 /*'endif'*/: 
                $__ifs--; 
                $__level--;
                out = "';" + pad_lines([
                                ""
                                ,"}"
                                ,""
                            ].join( $__TEOL ));
                break;
            case 7 /*'for'*/: 
                args = args.replace( re_controls, parse_constructs );
                var for_expr = args, is_php_style = for_expr.indexOf(' as '),
                    is_python_style = for_expr.indexOf(' in '),
                    o, _o, kv, isAssoc
                ;
                
                if ( -1 < is_python_style )
                {
                    for_expr = [for_expr.slice(0, is_python_style), for_expr.slice(is_python_style+4)];
                    o = trim(for_expr[1]);
                    _o = local_variable( );
                    kv = for_expr[0].split(',');
                }
                else /*if ( -1 < is_php_style )*/
                {
                    for_expr = [for_expr.slice(0, is_php_style), for_expr.slice(is_php_style+4)];
                    o = trim(for_expr[0]);
                    _o = local_variable( );
                    kv = for_expr[1].split('=>');
                }
                isAssoc = kv.length >= 2
                
                // http://jsperf.com/values-extraction/5
                // raw 'in' loop with .hasOwnProperty is faster than looping over Object.keys
                if ( isAssoc )
                {
                    var k = trim(kv[0]),
                        v = trim(kv[1]),
                        _oK = '_loc_' + (++$__idcnt),
                        _k = '_loc_' + (++$__idcnt),
                        _l = '_loc_' + (++$__idcnt)
                    ;
                    local_variable( k ); local_variable( v );
                    out = "';" + pad_lines([
                                    ""
                                    ,"var "+_o+" = "+o+", "+_oK+" = "+_o+" ? Object.keys("+_o+") : null,"
                                    ,"    "+_k+", "+k+", "+v+", "+_l+" = "+_o+" ? "+_oK+".length : 0;"
                                    ,"if ("+_l+")"
                                    ,"{"
                                    ,"    for ("+_k+"=0; "+_k+"<"+_l+"; "+_k+"++)"
                                    ,"    {"
                                    ,"        "+k+" = "+_oK+"["+_k+"]; "+v+" = "+_o+"["+k+"];"
                                    ,"        "
                                    ,""
                                ].join( $__TEOL ));
                    $__forType = 2;
                    $__level+=2;
                }
                else
                {
                    var v = trim(kv[0]),
                        _oV = '_loc_' + (++$__idcnt),
                        _arr = '_loc_' + (++$__idcnt),
                        _k = '_loc_' + (++$__idcnt),
                        _kk = '_loc_' + (++$__idcnt),
                        _l = '_loc_' + (++$__idcnt)
                    ;
                    local_variable( v );
                    out = "';" + pad_lines([
                                    ""
                                    ,"var "+_o+" = "+o+", "+_arr+" = !!"+_o+".forEach," 
                                    ,"    "+_oV+" = "+_o+" ? ("+_arr+" ? "+_o+" : Object.keys("+_o+")) : null,"
                                    ,"    "+_k+", "+_kk+", "+v+", "+_l+" = "+_oV+" ? "+_oV+".length : 0;"
                                    ,"if ("+_l+")"
                                    ,"{"
                                    ,"    for ("+_k+"=0; "+_k+"<"+_l+"; "+_k+"++)"
                                    ,"    {"
                                    ,"        "+_kk+" = "+_oV+"["+_k+"];"
                                    ,"        "+v+" = "+_arr+" ? "+_kk+" : "+_o+"["+_kk+"];"
                                    ,"        "
                                    ,""
                                ].join( $__TEOL ));
                    $__forType = 1;
                    $__level+=2;
                }
                $__loops++;  $__loopifs++;
                break;
            case 8 /*'elsefor'*/: 
                /* else attached to  for loop */ 
                if ( 2 === $__forType )
                {
                    $__loopifs--;  
                    $__level+=-2;
                    out = "';" + pad_lines([
                                    ""
                                    ,"    }"
                                    ,"}"
                                    ,"else"
                                    ,"{  "
                                    ,""
                                ].join( $__TEOL ));
                    $__level+=1;
                }
                else
                {
                    $__loopifs--;  
                    $__level+=-2;
                    out = "';" + pad_lines([
                                    ""
                                    ,"    }"
                                    ,"}"
                                    ,"else"
                                    ,"{  "
                                    ,""
                                ].join( $__TEOL ));
                    $__level+=1;
                }
                break;
            case 9 /*'endfor'*/:  
                if ( $__loopifs === $__loops ) 
                { 
                    if ( 2 === $__forType )
                    {
                        $__loops--; $__loopifs--;  
                        $__level+=-2;
                        out = "';" + pad_lines([
                                        ""
                                        ,"    }"
                                        ,"}"
                                        ,""
                                    ].join( $__TEOL ));
                    }
                    else
                    {
                        $__loops--; $__loopifs--;  
                        $__level+=-2;
                        out = "';" + pad_lines([
                                        ""
                                        ,"    }"
                                        ,"}"
                                        ,""
                                    ].join( $__TEOL ));
                    }
                }
                else
                {
                    $__loops--; 
                    $__level+=-1;
                    out = "';" + pad_lines([
                                    ""
                                    ,"}"
                                    ,""
                                ].join( $__TEOL ));
                }
                break;
            case 10 /*'extends'*/:  
                var id = trim( args );
                if ( $__strings && $__strings[HAS](id) ) id = $__strings[id];
                var ch = id.charAt(0);
                if ( '"' === ch || "'" === ch ) id = id.slice(1,-1); // quoted id
                $__extends = id;
                out = "';" + $__TEOL;
                break;
            case 11 /*'block'*/:  
                out = t_block( args );
                break;
            case 12 /*'endblock'*/:  
                out = t_endblock();
                break;
            case 13 /*'include'*/:  
                out = t_include( args );
                break;
            case 14 /*'super'*/:  
                args = args.replace( re_controls, parse_constructs );
                out = prefix + 'self.sprblock(' + args + ', data)';
                break;
            case 15 /*'getblock'*/:  
                args = args.replace( re_controls, parse_constructs );
                out = prefix + '__i__.block(' + args + ', data)';
                break;
            case 16 /*'iif'*/:
                args = split_arguments(args.replace( re_controls, parse_constructs ),',');
                out = prefix + "(("+args[0]+")?("+args[1]+"):("+args[2]+"))";
                break;
            case 17 /*'empty'*/:
                args = args.replace( re_controls, parse_constructs );
                out = prefix + '(("undefined" === typeof(' + args + ')) || (null === ' + args + ') || Contemplate.empty(' + args + '))';
                break;
            case 18 /*'continue'*/:
            case 19 /*'break'*/:
                out = "';" + $__TEOL + pad_lines( 18===m ? 'continue;' : 'break;' ) + $__TEOL;
                break;
        }
        return out + rest.replace( re_controls, parse_constructs );
    }
    
    if ( $__context.plugins[HAS](ctrl) || $__global.plugins[HAS](ctrl) )
    {
        // allow custom plugins as template functions
        var pl = $__context.plugins[ ctrl ] || $__global.plugins[ ctrl ];
        args = args.replace( re_controls, parse_constructs );
        out = pl instanceof Contemplate.InlineTemplate ? pl.render([args].concat(split_arguments(args,','))) : 'Contemplate.plg_("' + ctrl + '"' + (!args.length ? '' : ','+args) + ')';
        return prefix + out + rest.replace( re_controls, parse_constructs );
    }
    
    if ( $__aliases[HAS](ctrl) ) ctrl = $__aliases[ctrl];
    m = $__funcs.indexOf( ctrl );
    if ( -1 < m )
    {
        args = args.replace( re_controls, parse_constructs );
        // aliases and builtin functions
        switch( m )
        {
            case 0: case 5: out = 'String(' + args + ')'; break;
            case 1: out = 'parseInt(' + args + ')'; break;
            case 2: out = 'parseFloat(' + args + ')'; break;
            case 3: out = '"\'"+(' + args + ')+"\'"'; break;
            case 4: out = '\'"\'+(' + args + ')+\'"\''; break;
            case 6: out = 'Contemplate.time()'; break;
            case 7: out = 'Contemplate.count(' + args + ')'; break;
            case 8: out = '(' + args + ').toLowerCase()'; break;
            case 9: out = '(' + args + ').toUpperCase()'; break;
            case 10: out = 'Contemplate.ucfirst(' + args + ')'; break;
            case 11: out = 'Contemplate.lcfirst(' + args + ')'; break;
            case 12: out = 'Contemplate.sprintf(' + args + ')'; break;
            case 21: out = 'String('+split_arguments(args,',').join(')+String(')+')'; break;
            case 27: 
                args = split_arguments(args,',');
                if ( args.length > 1 )
                    out = "(("+args[1]+")?'[object Array]'===Object.prototype.toString.call("+args[0]+"):'[object Array]'===Object.prototype.toString.call("+args[0]+")||'[object Object]'===Object.prototype.toString.call("+args[0]+"))";
                else
                    out = "('[object Array]'===Object.prototype.toString.call("+args[0]+")||'[object Object]'===Object.prototype.toString.call("+args[0]+"))";
                break;
            case 28:
                args = split_arguments(args,',');
                out = '(-1<('+args[1]+').indexOf('+args[0]+'))';
                break;
            case 29: out = 'JSON.stringify('+args+')'; break;
            case 30: out = 'JSON.parse('+args+')'; break;
            default: out = 'Contemplate.' + ctrl + '(' + args + ')';
        }
        return prefix + out + rest.replace( re_controls, parse_constructs );
    }
    
    return /*match0*/ prefix + ctrl + (startParen ? '('+args.replace( re_controls, parse_constructs )+')' : '') + rest.replace( re_controls, parse_constructs );
}
function parse_blocks( s )
{
    var blocks = [], bl = $__allblocks.length, 
        block, delims, tag, rep, tl, rl,
        pos1, pos2, off, containerblock, echoed, EOL = $__TEOL
    ;
    
    while ( bl-- )
    {
        delims = $__allblocks[ bl ];
        
        block = delims[ 0 ];
        pos1 = delims[ 1 ];
        pos2 = delims[ 2 ];
        off = delims[ 3 ];
        containerblock = delims[ 4 ];
        echoed = delims[ 5 ];
        tag = "#BLOCK_" + block + "#";
        rep = echoed ? "__i__.block('" + block + "', data);" : "'';";
        tl = tag.length; rl = rep.length;
        
        if ( -1 < containerblock )
        {
            // adjust the ending position of the container block (if nested)
            // to compensate for the replacements in this (nested) block
            $__allblocks[ containerblock ][ 3 ] += rl - (pos2-pos1+1);
        }
        // adjust the ending position of this block (if nested)
        // to compensate for the replacements of any (nested) block(s)
        pos2 += off;
        
        if ( 1 === $__allblockscnt[ block ] )
        {
            // 1st occurance, block definition
            blocks.push([ block, TT_BLOCK.render({
             'BLOCKCODE'    : s.slice( pos1+tl, pos2-tl-1 ) + "';"
            ,'EOL'          : EOL
            })]);
        }
        s = s.slice(0, pos1) + rep + s.slice(pos2+1);
        if ( 1 <= $__allblockscnt[ block ] ) $__allblockscnt[ block ]--;
    }
    //$__allblocks = null; $__allblockscnt = null; $__openblocks = null;
    
    return [s, blocks];
}
function parse_variable( s, i, l )
{
    if ( ALPHA.test(s[i]) )
    {
        var strings = {}, variables = [], subvariables,
            id, variable, property, variable_raw, variable_main, variable_rest,
            len, lp, bracketcnt, delim, ch, 
            str_, q, escaped, si,
            strid, sub, space = 0, hasStrings = false
        ;
        
        // main variable
        variable = s.charAt(i++);
        while ( i < l && ALPHANUM.test(ch=s.charAt(i)) )
        {
            variable += ch;
            i++;
        }
        
        variable_raw = variable;
        // transform into tpl variable
        //variable_main = "data['"+variable_raw+"']";
        variable_main = "data."+variable_raw;
        variable_rest = '';
        $__idcnt++;
        id = "#VAR_"+$__idcnt+"#";
        len = variable_raw.length;
        
        // extra space
        space = 0;
        while ( i < l && SPACE.test(s.charAt(i)) )
        {
            space++;
            i++;
        }
        
        bracketcnt = 0;
        
        // optional properties
        while ( i < l && ('.' === s.charAt(i) || '[' === s.charAt(i)) )
        {
            delim = s.charAt(i++);
            
            // extra space
            while ( i < l && SPACE.test(s.charAt(i)) )
            {
                space++;
                i++;
            }
        
            // alpha-numeric dot property
            if ( '.' === delim )
            {
                // property
                property = '';
                while ( i < l && ALPHANUM.test(s.charAt(i)) )
                {
                    property += s.charAt(i++);
                }
                lp = property.length;
                if ( lp )
                {
                    // transform into tpl variable bracketed property
                    //variable_rest += "['" + property + "']";
                    variable_rest += "." + property;
                    len += space + 1 + lp;
                    space = 0;
                }
                else
                {
                    break;
                }
            }
            
            // bracketed property
            else if ( '[' === delim )
            {
                bracketcnt++;
                
                ch = s.charAt(i);
                
                // literal string property
                /*'"' === ch || "'" === ch*/
                if ( '"' === ch || "'" === ch )
                {
                    //property = parse_string(s, ch, i+1, l);
                    str_ = q = ch; escaped = false; si = i+1;
                    while ( si < l )
                    {
                        str_ += (ch=s.charAt(si++));
                        if ( q === ch && !escaped )  break;
                        escaped = (!escaped && '\\' === ch);
                    }
                    property = str_;
                    $__idcnt++;
                    strid = "#STR_"+$__idcnt+"#";
                    strings[strid] = property;
                    variable_rest += delim + strid;
                    lp = property.length;
                    i += lp;
                    len += space + 1 + lp;
                    space = 0;
                    hasStrings = true;
                }
                
                // numeric array property
                else if ( NUM.test( ch ) )
                {
                    property = s.charAt(i++);
                    while ( i < l && NUM.test(s.charAt(i)) )
                    {
                        property += s.charAt(i++);
                    }
                    variable_rest += delim + property;
                    lp = property.length;
                    len += space + 1 + lp;
                    space = 0;
                }
                
                // sub-variable property
                else if ( '$' === ch )
                {
                    sub = s.slice(i+1);
                    subvariables = parse_variable(sub, 0, sub.length);
                    if ( subvariables )
                    {
                        // transform into tpl variable property
                        property = subvariables[subvariables.length-1];
                        variable_rest += delim + property[0];
                        lp = property[4];
                        i += lp + 1;
                        len += space + 2 + lp;
                        space = 0;
                        variables = variables.concat(subvariables);
                        hasStrings = hasStrings || property[5];
                    }
                }
                
                // close bracket
                else if ( ']' === ch )
                {
                    if ( bracketcnt > 0 )
                    {
                        bracketcnt--;
                        variable_rest += delim + s.charAt(i++);
                        len += space + 2;
                        space = 0;
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
                while ( i < l && SPACE.test( s.charAt(i) ) )
                {
                    space++;
                    i++;
                }
        
                // close bracket
                if ( ']' === s.charAt(i) )
                {
                    if ( bracketcnt > 0 )
                    {
                        bracketcnt--;
                        variable_rest += s.charAt(i++);
                        len += space + 1;
                        space = 0;
                    }
                    else
                    {
                        break;
                    }
                }
            }
            
            // extra space
            while ( i < l && SPACE.test(s.charAt(i)) )
            {
                space++;
                i++;
            }
        }
        
        variables.push( [id, variable_raw, variable_main, variable_rest, len, hasStrings, strings] );
        return variables
    }
    return null;
}
var str_re = /#STR_\d+#/g;
function parse( tpl, leftTplSep, rightTplSep, withblocks )
{
    var t1, t2, p1, p2, l1, l2, len, parsed, s, i,
        tag, tagTpl, strings, variables, hasVariables, hasStrings, varname, id,
        countl, index, ch, out, tok, v, tokv, 
        multisplit_re = InlineTemplate.multisplit_re,
        ind, q, str_, escaped, si, space,
        blockTag, hasBlock, notFoundBlock,
        special_chars = "$'\" \n\r\t\v%",
        non_compatibility_mode = !$__compatibility
    ;
    
    t1 = leftTplSep; l1 = t1.length;
    t2 = rightTplSep; l2 = t2.length;
    parsed = '';
    while ( tpl.length )
    {
        p1 = tpl.indexOf( t1 );
        if ( -1 === p1 )
        {
            s = tpl;
            if ( $__escape ) s = s.split( "\\" ).join( "\\\\" ); // escape escapes
            parsed += s
                .split( "'" ).join( "\\'" )  // escape single quotes accurately (used by parse function)
                .split( /*"\n"*/ /\n/ ).join( $__preserveLines ) // preserve lines
            ;
            break;
        }
        p2 = tpl.indexOf( t2, p1+l1 );
        if ( -1 === p2 ) p2 = tpl.length;
        
        s = tpl.slice( 0, p1 );
        if ( $__escape ) s = s.split( "\\" ).join( "\\\\" ); // escape escapes
        parsed += s
            .split( "'" ).join( "\\'" )  // escape single quotes accurately (used by parse function)
            .split( /*"\n"*/ /\n/ ).join( $__preserveLines ) // preserve lines
        ;
        
        // template TAG
        s = tpl.slice(p1+l1, p2); tpl = tpl.slice(p2+l2);
        
        // parse each template tag section accurately
        // refined parsing
        countl = s.length;
        variables = [];
        strings = {};
        hasVariables = false; 
        hasStrings = false;
        hasBlock = false;
        index = 0; 
        space = 0;
        ch = ''; 
        out = ''; 
        
        while ( index < countl )
        {
            ch = s.charAt( index++ );
            ind = special_chars.indexOf( ch );
            
            if ( -1 < ind )
            {
                // variable
                if ( 0 === ind )
                {
                    if ( space > 0 )
                    {
                        out += " ";
                        space = 0;
                    }
                    tok = parse_variable(s, index, countl);
                    if ( tok )
                    {
                        for (v=0,len=tok.length; v<len; v++)
                        {
                            tokv = tok[ v ];
                            id = tokv[ 0 ];
                            $__variables[$__currentblock][ id ] = tokv[ 1 ];
                            if ( tokv[ 5 ] ) strings = merge( strings, tokv[ 6 ] );
                        }
                        out += id;
                        index += tokv[ 4 ];
                        variables = variables.concat( tok );
                        hasVariables = true; 
                        hasStrings = hasStrings || tokv[ 5 ];
                    }
                    else
                    {
                        out += '$';
                    }
                }
                // literal string
                else if ( 3 > ind )
                {
                    if ( space > 0 )
                    {
                        out += " ";
                        space = 0;
                    }
                    //tok = parse_string(s, ch, index, countl);
                    str_ = q = ch; escaped = false; si = index;
                    while ( si < countl )
                    {
                        str_ += (ch=s.charAt(si++));
                        if ( q === ch && !escaped )  break;
                        escaped = (!escaped && '\\' === ch);
                    }
                    tok = str_;
                    $__idcnt++;
                    id = "#STR_"+$__idcnt+"#";
                    strings[id] = tok;
                    out += id;
                    index += tok.length-1;
                    hasStrings = true;
                }
                // spaces
                else if ( 8 > ind )
                {
                    space++;
                }
                // directive or identifier or atom in compatibility mode
                else //if ( 8 === ind )  
                {
                    if ( space > 0 )
                    {
                        out += " ";
                        space = 0;
                    }
                    q = ch;
                    if ( non_compatibility_mode || index >= countl || !ALPHA.test(ch=s.charAt(index)) )
                    {
                        out += q;
                        continue;
                    }
                    index ++;
                    tok = ch;
                    while ( index < countl && ALPHANUM.test(ch = s.charAt(index)) )
                    {
                        index ++;
                        tok += ch;
                    }
                    tok = '#ID_'+tok+'#';
                    out += tok;
                }
            }
            // directive or identifier or atom
            else if ( non_compatibility_mode && ALPHA.test(ch) )
            {
                if ( space > 0 )
                {
                    out += " ";
                    space = 0;
                }
                tok = ch;
                while ( index < countl && ALPHANUM.test(ch=s.charAt(index)) )
                {
                    index ++;
                    tok += ch;
                }
                if ( 'as' !== tok && 'in' !== tok && 'null' !== tok && 'false' !== tok && 'true' !== tok )
                {
                    tok = '#ID_'+tok+'#';
                }
                out += tok;
            }
            // rest, bypass
            else
            {
                if ( space > 0 )
                {
                    out += " ";
                    space = 0;
                }
                out += ch;
            }
        }
        
        // fix literal data notation, not needed here
        //out = str_replace(array('{', '}', '[', ']', ':'), array('array(', ')','array(', ')', '=>'), out);
    
        tag = "\t" + out + "\v";
    
        $__startblock = null;  $__endblock = null; $__blockptr = -1;
        $__strings = strings;
        
        // replace constructs, functions, etc..
        tag = tag.replace( re_controls, parse_constructs );
        
        // check for blocks
        if ( $__startblock )
        {
            $__startblock = "#BLOCK_"+$__startblock+"#";
            hasBlock = true;
        }
        else if ( $__endblock )
        {
            $__endblock = "#/BLOCK_"+$__endblock+"#";
            hasBlock = true;
        }
        notFoundBlock = hasBlock;
        
        // replacements
        /*.replace( re_repls, "' + ($1) + '" );*/
        if ( 9 === tag.charCodeAt(0) && 11 === tag.charCodeAt(tag.length-1) ) 
            tag = "' + ("+trim(tag.slice(1,-1))+") + '";
        
        if ( hasVariables )
        {
            // replace variables
            for (v=variables.length-1; v>=0; v--)
            {
                id = variables[ v ][ 0 ]; varname = variables[ v ][ 1 ];
                tag = tag
                    .split( id+'__RAW__' ).join( varname )
                    .split( id ).join(( 
                        $__locals[$__currentblock][HAS](varname) 
                        ? ('_loc_' + varname) /* local (loop) variable */
                        : (variables[ v ][ 2 ]) /* default (data) variable */
                        ) + variables[ v ][ 3 ])
                ;
            }
        }
        
        if ( hasStrings )
        {
            // replace strings (accurately)
            tagTpl = multisplit_re(tag, str_re);
            tag = '';
            for (v=0,len=tagTpl.length; v<len; v++)
            {
                if ( tagTpl[v][0] )
                {
                    // and replace blocks (accurately)
                    if ( notFoundBlock )
                    {
                        if ( $__startblock )
                        {
                            blockTag = tagTpl[v][1].indexOf( $__startblock );
                            if ( -1 !== blockTag )
                            {
                                $__allblocks[ $__blockptr-1 ][ 1 ] = blockTag + parsed.length + tag.length;
                                notFoundBlock = false;
                            }
                        }
                        else //if ( $__endblock )
                        {
                            blockTag = tagTpl[v][1].indexOf( $__endblock );
                            if ( -1 !== blockTag )
                            {
                                $__allblocks[ $__blockptr-1 ][ 2 ] = blockTag + parsed.length + tag.length + $__endblock.length;
                                notFoundBlock = false;
                            }
                        }
                    }
                    tag += tagTpl[v][1];
                }
                else
                {
                    tag += strings[ tagTpl[v][1] ];
                }
            }
        }
        else if ( hasBlock )
        {
            // replace blocks (accurately)
            if ( $__startblock )
                $__allblocks[ $__blockptr-1 ][ 1 ] = parsed.length + tag.indexOf( $__startblock );
            else //if ( $__endblock )
                $__allblocks[ $__blockptr-1 ][ 2 ] = parsed.length + tag.indexOf( $__endblock ) + $__endblock.length;
        }
        
        // replace tpl separators
        if ( /*"\v"*/11 === tag.charCodeAt(tag.length-1) ) 
        {
            tag = tag.slice(0,-1) + pad_lines($__tplEnd);
        }
        if ( /*"\t"*/9 === tag.charCodeAt(0) ) 
        {
            tag = $__tplStart + tag.slice(1);
            if ( hasBlock )
            {
                // update blocks (accurately)
                blockTag = $__tplStart.length-1;
                if ( $__startblock )
                    $__allblocks[ $__blockptr-1 ][ 1 ] += blockTag;
                else //if ( $__endblock )
                    $__allblocks[ $__blockptr-1 ][ 2 ] += blockTag;
            }
        }
        
        parsed += tag;
    }
    return false !== withblocks ? ($__allblocks.length>0 ? parse_blocks( parsed ) : [parsed, []]) : parsed;
}
function get_cached_template_name( id, ctx, cacheDir )
{ 
    return cacheDir + id.replace(UNDERLN, '_') + '_tpl__' + ctx.replace(UNDERLN, '_') + '.js'; 
}
function get_cached_template_class( id, ctx )
{ 
    return 'Contemplate_' + id.replace(UNDERLN, '_') + '__' + ctx.replace(UNDERLN, '_'); 
}
function get_template_contents( id, contx, asyncCB )
{
    var template = contx.templates[id] || $__global.templates[id] || null;
    if ( template )
    {
        if ( template[1] ) //inline tpl
        {
            if ( $__async && asyncCB )
            {
                // async
                asyncCB( template[0] );
                return '';
            }
            else
            {
                // sync
                return template[0];
            }
        }
        else
        {
            // nodejs, xpcom
            if ( isNode || isXPCOM ) 
            { 
                if ( $__async && asyncCB )
                {
                    // async
                    fread_async(template[0], contx.encoding, function(err, data){
                        if ( err ) asyncCB( '' );
                        else asyncCB( data );
                    }); 
                    return '';
                }
                else
                {
                    // sync
                    return fread( template[0], contx.encoding );
                }
            }
            // client-side js and #id of DOM script-element given as template holder
            else if ( '#'===template[0].charAt(0) ) 
            { 
                if ( $__async && asyncCB )
                {
                    // async
                    asyncCB( window.document.getElementById(template[0].slice(1)).innerHTML || '' );
                    return '';
                }
                else
                {
                    // sync
                    return window.document.getElementById(template[0].slice(1)).innerHTML || '';
                }
            }
            // client-side js and url given as template location
            else 
            { 
                if ( $__async && asyncCB )
                {
                    // async
                    fread_async(template[0], contx.encoding, function(err, data){
                        if ( err ) asyncCB( '' );
                        else asyncCB( data );
                    }); 
                    return '';
                }
                else
                {
                    // sync
                    return fread( template[0], contx.encoding );
                }
            }
        }
    }
    return '';
}
function create_template_render_function( id, contx, seps )
{
    var tpl, blocks, funcs = {}, b, bl, func, renderf, EOL = $__TEOL;
    
    reset_state( );
    tpl = get_template_contents( id, contx );
    tpl = get_separators( tpl, seps );
    blocks = parse( tpl, $__leftTplSep, $__rightTplSep );
    clear_state( );
    
    renderf = blocks[0];
    blocks = blocks[1];
    bl = blocks.length;
    
   // Convert the template into pure JavaScript
    func = TT_FUNC.render({
     'FCODE'         : $__extends ? "__p__ = '';" : "__p__ = '" + renderf + "';"
    ,'EOL'           : EOL
    });
    
    // defined blocks
    for (b=0; b<bl; b++) funcs[blocks[b][0]] = FUNC("Contemplate,data,self,__i__", blocks[b][1]);
    
    return [FUNC("Contemplate", func), funcs];
}
function create_cached_template( id, contx, filename, classname, seps )
{
    var tpl, funcs = {}, prefixCode, extendCode, renderCode,
        b, bl, sblocks, blocks, renderf, EOL = $__TEOL;
    
    reset_state( );
    tpl = get_template_contents( id, contx );
    tpl = get_separators( tpl, seps );
    blocks = parse( tpl, $__leftTplSep, $__rightTplSep );
    clear_state( );
    
    renderf = blocks[0];
    blocks = blocks[1];
    bl = blocks.length;
    
    // tpl-defined blocks
    sblocks = [];
    for (b=0; b<bl; b++) 
        sblocks.push(EOL + TT_BlockCode.render({
         'BLOCKNAME'            : blocks[b][0]
        ,'BLOCKMETHODNAME'      : blocks[b][0]
        ,'BLOCKMETHODCODE'      : pad_lines(blocks[b][1], 1)
        ,'EOL'                  : EOL
        }));
    sblocks = sblocks.length ? EOL + "self._blocks = {" + EOL + sblocks.join(',' + EOL) + EOL + "};" + EOL : '';
    
    renderCode = TT_RCODE.render({
     'RCODE'                : $__extends ? "__p__ = '';" : "__p__ += '" + renderf + "';"
    ,'EOL'                  : EOL
    });
    extendCode = $__extends ? "self.extend('" + $__extends + "');" : '';
    prefixCode = contx.prefix ? contx.prefix : '';
    
  // generate tpl class
    var classCode = TT_ClassCode.render({
     'CLASSNAME'            : classname
    ,'TPLID'                : id
    ,'PREFIXCODE'           : prefixCode
    ,'EXTENDCODE'           : pad_lines(extendCode, 1)
    ,'BLOCKS'               : pad_lines(sblocks, 1)
    ,'RENDERCODE'           : pad_lines(renderCode, 1)
    ,'EOL'                  : EOL
    });
    return fwrite( filename, classCode, contx.encoding );
}
function get_cached_template( id, contx, options )
{
    var template, tplclass, tpl, sprTpl, funcs, cachedTplFile, cachedTplClass, stat, stat2;
    template = contx.templates[id] || $__global.templates[id] || null;
    if ( template )
    {
        // inline templates saved only in-memory
        if ( template[1] )
        {
            // dynamic in-memory caching during page-request
            tpl = new Contemplate.Template( id ).ctx( contx );
            if ( options && options.parsed )
            {
                // already parsed code was given
                tpl.setRenderFunction( FUNC("Contemplate", options.parsed) );
            }
            else
            {
                // parse code and create template class
                funcs = create_template_render_function( id, contx, options.separators ); 
                tpl.setRenderFunction( funcs[ 0 ] ).setBlocks( funcs[ 1 ] );
            }
            sprTpl = $__extends;
            if ( sprTpl ) tpl.extend( Contemplate.tpl(sprTpl, null, contx.id) );
            return tpl;
        }
        
        else
        {
            if ( !isNode && !isXPCOM ) contx.cacheMode = Contemplate.CACHE_TO_DISK_NONE;
            
            if ( true !== options.autoUpdate && Contemplate.CACHE_TO_DISK_NOUPDATE === contx.cacheMode )
            {
                cachedTplFile = get_cached_template_name( id, contx.id, contx.cacheDir );
                cachedTplClass = get_cached_template_class( id, contx.id );
                if ( !fexists( cachedTplFile ) )
                {
                    create_cached_template( id, contx, cachedTplFile, cachedTplClass, options.separators );
                }
                if ( fexists( cachedTplFile ) )
                {
                    tplclass = import_module( cachedTplClass, cachedTplFile )( Contemplate );
                    tpl = new tplclass( id )/*.setId( id )*/.ctx( contx );
                    return tpl;
                }
                return null;
            }
            
            else if ( true === options.autoUpdate || Contemplate.CACHE_TO_DISK_AUTOUPDATE === contx.cacheMode )
            {    
                cachedTplFile = get_cached_template_name( id, contx.id, contx.cacheDir );
                cachedTplClass = get_cached_template_class( id, contx.id );
                if ( !fexists( cachedTplFile ) )
                {
                    // if tpl not exist create it
                    create_cached_template( id, contx, cachedTplFile, cachedTplClass, options.separators );
                }
                else
                {
                    stat = fstat( cachedTplFile ); stat2 = fstat( template[0] );
                    if ( stat.mtime.getTime() <= stat2.mtime.getTime() )
                    {
                        // is out-of-sync re-create it
                        create_cached_template( id, contx, cachedTplFile, cachedTplClass, options.separators );
                    }
                }
                if ( fexists( cachedTplFile ) )
                {
                    tplclass = import_module( cachedTplClass, cachedTplFile )( Contemplate );
                    tpl = new tplclass( id )/*.setId( id )*/.ctx( contx );
                    return tpl;
                }
                return null;
            }
                    
            else
            {    
                // dynamic in-memory caching during page-request
                funcs = create_template_render_function( id, contx, options.separators );
                tpl = new Contemplate.Template( id ).ctx( contx ).setRenderFunction( funcs[ 0 ] ).setBlocks( funcs[ 1 ] );
                sprTpl = $__extends;
                if ( sprTpl ) tpl.extend( Contemplate.tpl(sprTpl, null, contx.id) );
                return tpl;
            }
        }
    }
    return null;
}


// can use inline templates for plugins etc.. to enable non-linear plugin compile-time replacement
function InlineTemplate( tpl, replacements, compiled )
{
    var self = this;
    if ( !(self instanceof InlineTemplate) ) return new InlineTemplate(tpl, replacements, compiled);
    self.id = null;
    self._renderer = null;
    self._parsed = false; // lazy init, only if needed, as and when needed
    self._args = [tpl, replacements, compiled];
    self.tpl = null;
}
InlineTemplate.multisplit = function multisplit( tpl, reps, as_array ) {
    var r, sr, s, i, j, a, b, c, al, bl/*, as_array = is_array(reps)*/;
    as_array = !!as_array;
    a = [ [1, tpl] ];
    for ( r in reps )
    {
        if ( !reps.hasOwnProperty( r ) ) continue;
        c = [ ]; sr = as_array ? reps[ r ] : r; s = [0, reps[ r ]];
        for (i=0,al=a.length; i<al; i++)
        {
            if ( 1 === a[ i ][ 0 ] )
            {
                b = a[ i ][ 1 ].split( sr ); bl = b.length;
                c.push( [1, b[0]] );
                if ( bl > 1 )
                {
                    for (j=0; j<bl-1; j++)
                    {
                        c.push( s );
                        c.push( [1, b[j+1]] );
                    }
                }
            }
            else
            {
                c.push( a[ i ] );
            }
        }
        a = c;
    }
    return a;
};
InlineTemplate.multisplit_re = function multisplit_re( tpl, re ) {
    re = re.global ? re : new RegExp(re.source, re.ignoreCase?"gi":"g"); /* make sure global flag is added */
    var a = [ ], i = 0, m;
    while ( m = re.exec( tpl ) )
    {
        a.push([1, tpl.slice(i, re.lastIndex - m[0].length)]);
        a.push([0, m[1] ? m[1] : m[0]]);
        i = re.lastIndex;
    }
    a.push([1, tpl.slice(i)]);
    return a;
};
InlineTemplate.compile = function( tpl ) {
    var l = tpl.length, 
        i, notIsSub, s, out = '"use strict";' + "\n" + 'return (';
    ;
    
    for (i=0; i<l; i++)
    {
        notIsSub = tpl[ i ][ 0 ]; s = tpl[ i ][ 1 ];
        if ( notIsSub ) out += "'" + s.replace(SQUOTE, "\\'").replace(NEWLINE, "' + \"\\n\" + '") + "'";
        else out += " + String(args['" + s + "']) + ";
    }
    out += ');';
    return FUNC('args', out);
};
InlineTemplate[PROTO] = {
    constructor: InlineTemplate
    
    ,id: null
    ,tpl: null
    ,_renderer: null
    ,_parsed: false
    ,_args: null
    
    ,dispose: function( ) {
        var self = this;
        self.id = null;
        self.tpl = null;
        self._renderer = null;
        self._parsed = null;
        self._args = null;
        return self;
    }
    ,render: function( args ) {
        var self = this;
        args = args || [ ];
        
        if ( !self._parsed ) // lazy init, only if needed, as and when needed
        {
            var tpl = self._args[0], replacements = self._args[1], compiled = self._args[2];
            self.tpl = replacements instanceof RegExp 
                ? InlineTemplate.multisplit_re(tpl||'', replacements) 
                : InlineTemplate.multisplit(tpl||'', replacements||{});
            if ( true === compiled )
            {
                self._renderer = InlineTemplate.compile( self.tpl );
                self.render = self._renderer;
            }
            self._args = null;
            self._parsed = true;
        }
        if ( self._renderer ) return self._renderer( args );
        
        var tpl = self.tpl, l = tpl.length,
            i, notIsSub, s, out = ''
        ;
        
        for (i=0; i<l; i++)
        {
            notIsSub = tpl[ i ][ 0 ]; s = tpl[ i ][ 1 ];
            out += (notIsSub ? s : args[ s ]);
        }
        return out;
    }
};


function Template( id )
{
    var self = this;
    if ( !(self instanceof Template) ) return new Template( id );
    self._renderer = null;
    self._blocks = null;
    self._extends = null;
    self._ctx = null;
    self._autonomus = false;
    self.id = null;
    if ( id ) self.id = id; 
}
Template.spr = function( data, __i__ ) {
    var self = this, r, __ctx = false;
    !__i__&&(__i__=self)&&(self._autonomus||(__ctx=Contemplate._set_ctx( self._ctx )));
    r = self._extends.render( data, __i__ );
    __ctx&&Contemplate._set_ctx( __ctx );
    return r;
};
Template.fixr = function( tpl ) { 
    tpl.render = tpl._extends instanceof Template
                ? Template.spr
                : ('function'===typeof tpl._renderer
                ? tpl._renderer
                : tpl.constructor[PROTO].render);
    return tpl;
};
Template[PROTO] = {
    constructor: Template
    ,id: null
    
    ,_renderer: null 
    ,_blocks: null
    ,_extends: null
    ,_ctx: null
    ,_autonomus: false
    
    // public methods
    ,dispose: function( ) {
        var self = this;
        self._renderer = null;
        self._blocks = null;
        self._extends = null;
        self._ctx = null;
        self._autonomus = null;
        self.id = null;
        return self;
    }
    
    ,setId: function( id ) { 
        if ( id ) this.id = id;  
        return this; 
    }
    
    ,ctx: function( ctx ) { 
        this._ctx = ctx;
        return this; 
    }
    
    ,autonomus: function( enable ) {
        this._autonomus = !arguments.length ? true : !!enable;
        return this;
    }
    
    ,extend: function( tpl ) { 
        var self = this;
        self._extends = tpl && tpl.substr
                    ? Contemplate.tpl( tpl )
                    : (tpl instanceof Template
                    ? tpl
                    : null);
        Template.fixr( self );
        return self;
    }
    
    ,setRenderFunction: function( renderfunc ) { 
        var self = this;
        self._renderer = 'function'===typeof renderfunc
                    ? renderfunc( Contemplate )
                    : null;
        Template.fixr( self );
        return self;
    }
    
    ,setBlocks: function( blocks ) { 
        var self = this;
        if ( 'object' === typeof blocks )
            self._blocks = merge(self._blocks||{}, blocks); 
        return self; 
    }
    
    ,sprblock: function( block, data/*, __i__*/ ) {
        var self = this;
        //__i__ = __i__ || self;
        if ( self._extends ) return self._extends.block(block, data, self._extends);
        return '';
    }
    
    ,block: function( block, data, __i__ ) {
        var self = this, r = '', __ctx = false, blocks = self._blocks;
        !__i__&&(__i__=self)&&(self._autonomus||(__ctx=Contemplate._set_ctx( self._ctx )));
        if ( blocks && blocks[HAS](block) ) r = blocks[block](Contemplate, data, self, __i__);
        else if ( self._extends ) r = self._extends.block(block, data, __i__);
        __ctx&&Contemplate._set_ctx( __ctx );
        return r;
    }
    
    ,render: function( data, __i__ ) {
        return '';
    }
}
// aliases
Template[PROTO].renderBlock = Template[PROTO].block;
Template[PROTO].renderSuperBlock = Template[PROTO].sprblock;

function Ctx( id )
{
    var self = this;
    self.id               = id;
    self.cacheDir         = './';
    self.cacheMode        = 0;
    self.cache            = { };
    self.templates        = { };
    self.partials         = { };
    self.locale           = { };
    self.xlocale          = { };
    self.plugins          = { };
    self.prefix           = '';
    self.encoding         = isXPCOM ? 'UTF-8' : 'utf8';
}
Ctx[PROTO] = {
    constructor: Ctx
    
    ,id: null
    ,cacheDir: null
    ,cacheMode: null
    ,cache: null
    ,templates: null
    ,partials: null
    ,locale: null
    ,xlocale: null
    ,plugins: null
    ,prefix: null
    ,encoding: null
    
    ,dispose: function( ) {
        var self = this;
        self.id = null;
        self.cacheDir = null;
        self.cacheMode = null;
        self.templates = null;
        self.partials = null;
        self.locale = null;
        self.xlocale = null;
        self.plugins = null;
        self.prefix = null;
        self.encoding = null;
        if ( self.cache )
        {
            for(var tpl in self.cache)
                if ( self.cache[HAS](tpl) )
                    self.cache[tpl].dispose( );
        }
        self.cache = null;
    }
};


Contemplate = {

    // constants
    VERSION: __version__
    
    ,CACHE_TO_DISK_NONE: 0
    ,CACHE_TO_DISK_AUTOUPDATE: 2
    ,CACHE_TO_DISK_NOUPDATE: 4
    
    ,Template: Template
    ,InlineTemplate: InlineTemplate
    ,Ctx: Ctx
    
    ,init: function( ) {
        if ( $__isInited ) return;
        
        // a default global context
        $__global = new Ctx('global');
        $__ctx = {
        'global'  : $__global
        };
        $__context = $__global;
        
        // pre-compute the needed regular expressions
        $__preserveLines = $__preserveLinesDefault;
        $__tplStart = "';" + $__TEOL;
        $__tplEnd = $__TEOL + "__p__ += '";
        
        // make compilation templates
        TT_ClassCode = new InlineTemplate([
            "#PREFIXCODE#"
            ,"!function (root,name,factory){"
            ,"'use strict';"
            ,"var m;"
            ,"if ( ('undefined'!==typeof Components)&&('object'===typeof Components.classes)&&('object'===typeof Components.classesByID)&&Components.utils&&('function'===typeof Components.utils['import']) ) /* XPCOM */"
            ,"    (root.EXPORTED_SYMBOLS = [ name ]) && (root[ name ] = factory( ));"
            ,"else if ( ('object'===typeof module)&&module.exports ) /* CommonJS */"
            ,"    module.exports = factory( );"
            ,"else if ( ('function'===typeof(define))&&define.amd&&('function'===typeof(require))&&('function'===typeof(require.specified))&&require.specified(name) ) /* AMD */"
            ,"    define(name,['require','exports','module'],factory);"
            ,"else if ( !(name in root) ) /* Browser/Worker/.. */"
            ,"    (root[ name ] = (m=factory( )))&&('function'===typeof(define))&&define.amd&&define(function( ){return m;} );"
            ,"}(this,'#CLASSNAME#',function( ){"
            ,"'use strict';"
            ,"return function( Contemplate ) {"
            ,"/* Contemplate cached template '#TPLID#', constructor */"
            ,"function #CLASSNAME#( id )"
            ,"{"
            ,"    var self = this;"
            ,"    Contemplate.Template.call( self, id );"
            ,"    /* tpl-defined blocks render code starts here */"
            ,"#BLOCKS#"
            ,"    /* tpl-defined blocks render code ends here */"
            ,"    /* extend tpl assign code starts here */"
            ,"#EXTENDCODE#"
            ,"    /* extend tpl assign code ends here */"
            ,"}"
            ,"/* extends main Contemplate.Template class */"
            ,"#CLASSNAME#.prototype = Object.create(Contemplate.Template.prototype);"
            ,"/* render method */"
            ,"#CLASSNAME#.prototype.render = function( data, __i__ ) {"
            ,"    \"use strict\";"
            ,"    var self = this, __p__ = '', __ctx = false;"
            ,"    !__i__&&(__i__=self)&&(self._autonomus||(__ctx=Contemplate._set_ctx( self._ctx )));"
            ,"    /* tpl main render code starts here */"
            ,"#RENDERCODE#"
            ,"    /* tpl main render code ends here */"
            ,"    __ctx&&Contemplate._set_ctx( __ctx );"
            ,"    return __p__;"
            ,"};"
            ,"// export it"
            ,"return #CLASSNAME#;"
            ,"};"
            ,"});"
            ,""
        ].join( '#EOL#' ), {
             "#PREFIXCODE#"         : "PREFIXCODE"
            ,"#CLASSNAME#"          : "CLASSNAME"
            ,"#TPLID#"              : "TPLID"
            ,"#BLOCKS#"             : "BLOCKS"
            ,"#EXTENDCODE#"         : "EXTENDCODE"
            ,"#RENDERCODE#"         : "RENDERCODE"
            ,"#EOL#"                : "EOL"
        }, true);
    
        TT_BlockCode = new InlineTemplate([
            ""
            ,"/* tpl block render method for block '#BLOCKNAME#' */"
            ,"'#BLOCKMETHODNAME#': function( Contemplate, data, self, __i__ ) {"
            ,"#BLOCKMETHODCODE#"
            ,"}"
            ,""
        ].join( '#EOL#' ), {
             "#BLOCKNAME#"          : "BLOCKNAME"
            ,"#BLOCKMETHODNAME#"    : "BLOCKMETHODNAME"
            ,"#BLOCKMETHODCODE#"    : "BLOCKMETHODCODE"
            ,"#EOL#"                : "EOL"
        }, true);

        TT_BLOCK = new InlineTemplate([
            "\"use strict\";"
            ,"var __p__ = '';"
            ,"#BLOCKCODE#"
            ,"return __p__;"
            ,""
        ].join( '#EOL#' ), {
             "#BLOCKCODE#"          : "BLOCKCODE"
            ,"#EOL#"                : "EOL"
        }, true);

    
        TT_FUNC = new InlineTemplate([
            "return function( data, __i__ ){"
            ,"\"use strict\";"
            ,"var self = this, __p__ = '', __ctx = false;"
            ,"!__i__&&(__i__=self)&&(self._autonomus||(__ctx=Contemplate._set_ctx( self._ctx )));"
            ,"#FCODE#"
            ,"__ctx&&Contemplate._set_ctx( __ctx );"
            ,"return __p__;"
            ,"};"
        ].join( '#EOL#' ), {
             "#FCODE#"              : "FCODE"
            ,"#EOL#"                : "EOL"
        }, true);
        
        TT_RCODE = new InlineTemplate([
            ""
            ,"#RCODE#"
            ,""
        ].join( '#EOL#' ), {
             "#RCODE#"              : "RCODE"
            ,"#EOL#"                : "EOL"
        }, true);
        
        clear_state( );
        $__isInited = true;
    }
    
    ,_set_ctx: function( ctx ) {
        var contx = $__context;
        /*if ( ctx instanceof Ctx ) $__context = ctx;
        else if ( ctx && $__ctx[HAS](ctx) ) $__context = $__ctx[ctx];
        else $__context = $__global;*/
        $__context = ctx ? ctx : $__global;
        return contx;
    }
    
    //
    // Main API methods
    //
    
    ,createCtx: function( ctx ) {
        if ( ctx && 'global' !== ctx && !$__ctx[HAS](ctx) ) $__ctx[ctx] = new Ctx( ctx );
    }
    
    ,disposeCtx: function( ctx ) {
        if ( ctx && 'global' !== ctx && $__ctx[HAS](ctx) )
        {
            $__ctx[ctx].dispose( );
            delete $__ctx[ctx];
        }
    }
    
    ,setCompatibilityMode: function( enable ) { 
        if ( arguments.length < 1 ) enable = true; 
        $__compatibility = !!enable;
    }
    
    ,setTemplateSeparators: function( seps ) {
        if ( seps )
        {
            if ( seps['left'] )  $__leftTplSep = ''+seps['left'];
            if ( seps['right'] ) $__rightTplSep = ''+seps['right'];
        }
    }
    
    ,setPreserveLines: function( enable ) { 
        if ( arguments.length < 1 ) enable = true; 
        $__preserveLines = !!enable ? $__preserveLinesDefault : '';
    }
    
    ,hasPlugin: function( name, ctx ) {
        var contx;
        if ( arguments.length < 2 ) ctx = 'global';
        contx = ctx && $__ctx[HAS](ctx) ? $__ctx[ctx] : $__context;
        return !!name && (contx.plugins[HAS](name) || $__global.plugins[HAS](name));
    }
    
    ,addPlugin: function( name, pluginCode, ctx ) {
        var contx;
        if ( name && pluginCode )
        {
            if ( arguments.length < 2 ) ctx = 'global';
            contx = ctx && $__ctx[HAS](ctx) ? $__ctx[ctx] : $__context;
            contx.plugins[ name ] = pluginCode;
        }
    }

    ,plg_: function( plg ) {
        var args = arguments;
        if ( $__context.plugins[HAS]( plg ) && "function" === typeof $__context.plugins[ plg ] ) 
        {
            return $__context.plugins[ plg ].apply( null, slice.call(args, 1) );
        } 
        else if ( $__global.plugins[HAS]( plg ) && "function" === typeof $__global.plugins[ plg ] ) 
        {
            return $__global.plugins[ plg ].apply( null, slice.call(args, 1) );
        }
        return '';
    }
    
    ,setPrefixCode: function( preCode, ctx ) {
        var contx;
        if ( arguments.length < 2 ) ctx = 'global';
        contx = ctx && $__ctx[HAS](ctx) ? $__ctx[ctx] : $__context;
        if ( preCode ) contx.prefix = '' + preCode;
    }

    ,setEncoding: function( encoding, ctx ) {
        var contx;
        if ( arguments.length < 2 ) ctx = 'global';
        contx = ctx && $__ctx[HAS](ctx) ? $__ctx[ctx] : $__context;
        contx.encoding = encoding;
    }
    
    ,setLocales: function( locales, ctx ) { 
        var contx;
        if ( locales && ("function" === typeof locales || "object"===typeof locales) )
        {
            if ( arguments.length < 2 ) ctx = 'global';
            contx = ctx && $__ctx[HAS](ctx) ? $__ctx[ctx] : $__context;
            contx.locale = "function" === typeof locales ? locales : merge(contx.locale, locales);
        }
    }
    
    ,setXLocales: function( xlocales, ctx ) { 
        var contx;
        if ( xlocales && ("function" === typeof xlocales || "object"===typeof xlocales) )
        {
            if ( arguments.length < 2 ) ctx = 'global';
            contx = ctx && $__ctx[HAS](ctx) ? $__ctx[ctx] : $__context;
            contx.xlocale = "function" === typeof xlocales ? xlocales : merge(contx.xlocale, xlocales);
        }
    }
    
    ,clearLocales: function( ctx ) { 
        var contx;
        if ( arguments.length < 2 ) ctx = 'global';
        contx = ctx && $__ctx[HAS](ctx) ? $__ctx[ctx] : $__context;
        contx.locale = { }; 
    }
    
    ,clearXLocales: function( ctx ) { 
        var contx;
        if ( arguments.length < 2 ) ctx = 'global';
        contx = ctx && $__ctx[HAS](ctx) ? $__ctx[ctx] : $__context;
        contx.xlocale = { }; 
    }
    
    ,setCacheDir: function( dir, ctx ) { 
        var contx;
        if ( arguments.length < 2 ) ctx = 'global';
        contx = ctx && $__ctx[HAS](ctx) ? $__ctx[ctx] : $__context;
        contx.cacheDir = rtrim(dir, '/') + '/';  
    }
    
    ,setCacheMode: function( mode, ctx ) { 
        var contx;
        if ( arguments.length < 2 ) ctx = 'global';
        contx = ctx && $__ctx[HAS](ctx) ? $__ctx[ctx] : $__context;
        contx.cacheMode = isNode || isXPCOM ? mode : Contemplate.CACHE_TO_DISK_NONE; 
    }
    
    ,clearCache: function( all, ctx ) { 
        var contx;
        if ( arguments.length < 2 ) ctx = 'global';
        contx = ctx && $__ctx[HAS](ctx) ? $__ctx[ctx] : $__context;
        contx.cache = { }; 
        if ( all ) contx.partials = { }; 
    }
    
    ,add: function( tpls, ctx ) { 
        var contx, tplID;
        if ( tpls && "object"===typeof tpls )
        {
            if ( arguments.length < 2 ) ctx = 'global';
            contx = ctx && $__ctx[HAS](ctx) ? $__ctx[ctx] : $__context;
            for (tplID in tpls)
            {
                if ( !tpls[HAS](tplID) ) continue;
                if ( is_array( tpls[ tplID ] ) )
                {
                    // unified way to add tpls both as reference and inline
                    // inline tpl, passed as array
                    if ( tpls[ tplID ][ 0 ] )
                        contx.templates[ tplID ] = [tpls[ tplID ][ 0 ], true];
                }
                else
                {
                    contx.templates[ tplID ] = [tpls[ tplID ], false];
                }
            }
        }
    }

    ,hasTpl: function( tpl, ctx ) { 
        var contx;
        if ( arguments.length < 2 ) ctx = 'global';
        contx = ctx && $__ctx[HAS](ctx) ? $__ctx[ctx] : $__context;
        return !!tpl && (contx.templates[HAS](tpl) || $__global.templates[HAS](tpl));
    }

    ,getTemplateContents: function( id, ctx ) {
        var contx;
        if ( arguments.length < 2 ) ctx = 'global';
        contx = ctx && $__ctx[HAS](ctx) ? $__ctx[ctx] : $__context;
        return get_template_contents( id, contx );
    }
    
    ,parseTpl: function( tpl, options ) {
        var parsed, leftSep, rightSep, separators, _ctx, contx = null;
        
        // see what context this template may use
        if ( options && options.substr )
        {
            if ( $__ctx[HAS](options) )
                contx = $__ctx[options]; // preset context
            else
                contx = $__global; // global context
            options = {};
        }
        
        options = merge({
            'separators': null
        }, options);
        
        if ( options.context )
        {
            if ( $__ctx[HAS](options.context) )
                contx = $__ctx[options.context]; // preset context
            else if ( !contx )
                contx = $__global; // global context
            delete options.context;
        }
        if ( !contx ) contx = $__global; // global context
        
        leftSep = $__leftTplSep; rightSep = $__rightTplSep;
        separators = options && options.separators ? options.separators : null;
        if ( separators ) { leftSep = separators[ 0 ];  rightSep = separators[ 1 ]; }
        
        _ctx = $__context;
        $__context = contx;
        reset_state( );
        parsed = parse( tpl, leftSep, rightSep );
        clear_state( );
        $__context = _ctx;
        
        return parsed;
    }
    
    //
    // Main Template functions
    //
    
    ,tpl: function( tpl, data, options ) {
        var tmpl, contx, _ctx;
        if ( tpl instanceof Contemplate.Template )
        {
            tmpl = tpl;
        }
        else
        {
            // see what context this template may use
            contx = null;
            if ( options && options.substr )
            {
                if ( $__ctx[HAS](options) )
                    contx = $__ctx[options]; // preset context
                else
                    contx = $__context; // current context
                options = {};
            }
            
            options = merge({
                 'separators': null
                ,'autoUpdate': false
                ,'refresh': false
                ,'escape': true
                ,'standalone': false
            }, options);
            
            if ( options.context )
            {
                if ( $__ctx[HAS](options.context) )
                    contx = $__ctx[options.context]; // preset context
                else if ( !contx )
                    contx = $__context; // current context
                delete options.context;
            }
            if ( !contx ) contx = $__context; // current context
            
            $__escape = false !== options.escape;
            
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.
            if ( !!options.refresh || (!contx.cache[ tpl ] && !$__global.cache[ tpl ]) )
            {
                _ctx = $__context;
                $__context = contx;
                contx.cache[ tpl ] = get_cached_template( tpl, contx, options );
                $__context = _ctx;
            }
            
            tmpl = contx.cache[ tpl ] || $__global.cache[ tpl ];
            tmpl.autonomus( options.standalone );
        }
        
        // Provide some basic currying to the user
        return data && "object"===typeof data ? tmpl.render( data ) : tmpl;
    }
    
    
    ,inline: function( tpl, reps, compiled ) {
        return (tpl instanceof Contemplate.InlineTemplate) 
            ? tpl.render( reps ) 
            : Contemplate.InlineTemplate(tpl, reps, compiled);
    }
    
    ,is_array: function( v, strict ) {
        var to_string = toString.call( v );
        return strict ? '[object Array]' === to_string : ('[object Array]' === to_string) || ('[object Object]' === to_string);
    }
        
    ,in_array: function( v, a ) {
        return -1 < a.indexOf( v );
    }
        
    ,json_encode: function( v ) {
        return JSON.stringify( v );
    }
        
    ,json_decode: function( v ) {
        return JSON.parse( v );
    }
        
    ,haskey: function( v/*, key1, key2, etc.. */ ) {
        var to_string = toString.call( v ), args, i, tmp;
        if (!v || "[object Array]" !== to_string && "[object Object]" !== to_string) return false;
        args = arguments; tmp = v;
        for (i=1; i<args.length; i++)
        {
            if ( !tmp || !tmp[HAS](args[i]) ) return false;
            tmp = tmp[ args[i] ];
        }
        return true;
    }
    ,empty: empty
    //,iif: iif
    
    ,e: function( s, entities ) {
        // http://jsperf.com/split-join-vs-regex-replace/10
        var i = 0, l = s.length, r = '', c, cd;
        if ( entities )
        {
            while ( i < l ) 
            {
                c = s.charAt( i++ ); cd = c.charCodeAt( 0 );
                switch( cd )
                {
                    case 34: r += "&quot;"; break;
                    case 38: r += "&amp;"; break;
                    case 39: r += "&apos;"; break;
                    case 60: r += "&lt;"; break;
                    case 62: r += "&gt;"; break;
                    default: r += c;
                }
            }
        }
        else
        {
            while ( i < l ) 
            {
                c = s.charAt( i++ ); cd = c.charCodeAt( 0 );
                switch( cd )
                {
                    case 34: case 38: case 39: case 60: case 62:
                        r += "&#"+cd+";"; break;
                    default:
                        r += c;
                }
            }
        }
        return r;
    }
    ,url: urlencode
    
    ,trim: trim
    ,ltrim: ltrim
    ,rtrim: rtrim
    ,ucfirst: function( s ) {
        return s[0].toUpperCase( ) + s.substr(1);//.toLowerCase();
    }
    ,lcfirst: function( s ) {
        return s[0].toLowerCase( ) + s.substr(1);//.toUpperCase();
    }
    ,camelcase: function( s, sep, capitalizeFirst ) {
        sep = sep || "_";
        if ( capitalizeFirst )
            return s.split( sep ).map( Contemplate.ucfirst ).join( "" );
        else
            return Contemplate.lcfirst( s.split( sep ).map( Contemplate.ucfirst ).join( "" ) );
    }
    ,snakecase: function( s, sep ) {
        sep = sep || "_";
        return s.replace( /([A-Z])/g, sep + '$1' ).toLowerCase( );
    }
    ,addslashes: function( str ) {
        // http://kevin.vanzonneveld.net
        // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: Ates Goral (http://magnetiq.com)
        // +   improved by: marrtins
        // +   improved by: Nate
        // +   improved by: Onno Marsman
        // +   input by: Denny Wardhana
        // +   improved by: Brett Zamir (http://brett-zamir.me)
        // +   improved by: Oskar Larsson Högfeldt (http://oskar-lh.name/)
        // *     example 1: addslashes("kevin's birthday");
        // *     returns 1: 'kevin\'s birthday'
        return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
    }
    ,stripslashes: function( str ) {
        // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: Ates Goral (http://magnetiq.com)
        // +      fixed by: Mick@el
        // +   improved by: marrtins
        // +   bugfixed by: Onno Marsman
        // +   improved by: rezna
        // +   input by: Rick Waldron
        // +   reimplemented by: Brett Zamir (http://brett-zamir.me)
        // +   input by: Brant Messenger (http://www.brantmessenger.com/)
        // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
        // *     example 1: stripslashes('Kevin\'s code');
        // *     returns 1: "Kevin's code"
        // *     example 2: stripslashes('Kevin\\\'s code');
        // *     returns 2: "Kevin\'s code"
        return (str + '').replace(/\\(.?)/g, function (s, n1) {
            switch (n1) 
            {
                case '\\': return '\\';
                case '0': return '\u0000';
                case '': return '';
                default: return n1;
            }
        });
    }
    ,concat: function( ) { 
        return join.call( arguments, '' ); 
    }
    ,sprintf: sprintf
    
    //
    //  Localization functions
    //
    
    ,time: php_time
    ,date: function( format, timestamp ) { 
        if ( arguments.length < 2  ) timestamp = php_time( ); 
        return php_date( format, timestamp ); 
    }
    ,ldate: function( format, timestamp ) { 
        if ( arguments.length < 2  ) timestamp = php_time( ); 
        return localized_date( format, timestamp ); 
    }
    
    ,locale: function( s ) { 
        var locale = ('function' === typeof $__context.locale) || $__context.locale[HAS](s)
            ? $__context.locale
            : (('function' === typeof $__global.locale) || $__global.locale[HAS](s)
            ? $__global.locale
            : null); 
        if ( null === locale ) return s;
        if ( 'function' === typeof locale ) return locale.apply(null, arguments);
        return locale[s];
    }
    ,xlocale: function( s, l_ctx ) { 
        var xlocale = ('function' === typeof $__context.xlocale) || (l_ctx && $__context.xlocale[HAS](l_ctx) && $__context.xlocale[l_ctx][HAS](s))
            ? $__context.xlocale
            : (('function' === typeof $__global.xlocale) || (l_ctx && $__global.xlocale[HAS](l_ctx) && $__global.xlocale[l_ctx][HAS](s))
            ? $__global.xlocale
            : null); 
        if ( null === xlocale ) return s;
        if ( 'function' === typeof xlocale ) return xlocale.apply(null, arguments);
        return xlocale[l_ctx][s];
    }
    ,nlocale: function( n, singular, plural ) { 
        var locale = ('function' === typeof $__context.locale) || $__context.locale[HAS](singular)
            ? $__context.locale
            : (('function' === typeof $__global.locale) || $__global.locale[HAS](singular)
            ? $__global.locale
            : null); 
        if ( null === locale ) return 1 == n ? singular : plural;
        if ( 'function' === typeof locale )
        {
            var args = Array.prototype.splice.call(arguments, 0, 3, 1 == n ? singular : plural);
            return locale.apply(null, args);
        }
        return 1 == n ? locale[singular] : (locale[HAS](plural) ? locale[plural] : plural);
    }
    ,nxlocale: function( n, singular, plural, l_ctx ) { 
        var xlocale = ('function' === typeof $__context.xlocale) || (l_ctx && $__context.xlocale[HAS](l_ctx) && $__context.xlocale[l_ctx][HAS](singular))
            ? $__context.xlocale
            : (('function' === typeof $__global.xlocale) || (l_ctx && $__global.xlocale[HAS](l_ctx) && $__global.xlocale[l_ctx][HAS](singular))
            ? $__global.xlocale
            : null); 
        if ( null === xlocale ) return 1 == n ? singular : plural;
        if ( 'function' === typeof xlocale )
        {
            var args = Array.prototype.splice.call(arguments, 0, 3, 1 == n ? singular : plural);
            return xlocale.apply(null, args);
        }
        return 1 == n ? xlocale[l_ctx][singular] : (xlocale[l_ctx][HAS](plural) ? xlocale[l_ctx][plural] : plural);
    }
    
    ,uuid: function( namespace ) {
        return [namespace||'UUID', ++$__uuid, php_time()].join('_');
    }
    ,count: count
    ,keys: function( o ) {
        return o ? Keys( o ) : null;
    }
    ,values: function( o ) { 
        if ( o )
        {
            if ( o.push/*o instanceof Arr*/ ) 
            {
                return o;
            }
            else
            {
                var a = [], k;
                for (k in o) if ( o[HAS](k) ) a.push( o[k] );
                return a;
            }
        }
        return null;
    }
    ,items: function( o ) {
        return o ? o : null;
    }
    ,merge: merge
    ,data: function( o ) {
        if ( is_array(o) ) return o.slice();
        var c = {}, key, newkey;
        // shallow clone the data
        for (key in o) if (o[HAS](key)) c[key] = o[key]; 
        return c;
    }
    ,local_variable: local_variable
    ,is_local_variable: is_local_variable
};

// Template Engine end here
//
//

var default_date_locale = {
     meridian: { am:'am', pm:'pm', AM:'AM', PM:'PM' }
    ,ordinal: { ord:{1:'st',2:'nd',3:'rd'}, nth:'th' }
    ,timezone: [ 'UTC','EST','MDT' ]
    ,timezone_short: [ 'UTC','EST','MDT' ]
    ,day: [ 'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday' ]
    ,day_short: [ 'Sun','Mon','Tue','Wed','Thu','Fri','Sat' ]
    ,month: [ 'January','February','March','April','May','June','July','August','September','October','November','December' ]
    ,month_short: [ 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec' ]
    },
    Keys = Obj.keys, join = Arr[PROTO].join, slice = Arr[PROTO].slice, floor = Math.floor, round = Math.round, abs = Math.abs,
    re_1 = /([\s\S]*?)(&(?:#\d+|#x[\da-f]+|[a-zA-Z][\da-z]*);|$)/g,
    re_2 = /!/g, re_3 = /'/g, re_4 = /\(/g, re_5 = /\)/g, re_6 = /\*/g, re_7 = /%20/g,
    re_8 = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g,
    re_9 = /([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g,
    rtrim_re = /[ \s\u00A0]+$/g,
    ltrim_re = /^[ \s\u00A0]+/g,
    trim_re = /^[ \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]+|[ \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]+$/g,
    
    fileurl_2_nsfile = function( file_uri ) {
        // NetUtil.newURI(file_uri).QueryInterface(Ci.nsIFileURL).file
        // http://stackoverflow.com/q/24817347/3591273
        /*var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService),
            url = ios.newURI(file_uri, null, null), // url is a nsIURI
            // file is a nsIFile    
            file = url.QueryInterface(Ci.nsIFileURL).file;*/
        return Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService).newURI(file_uri, null, null).QueryInterface(Ci.nsIFileURL).file;
    },
    
    fexists = isXPCOM
    ? function fexists( file ) {
        // file is URI, i.e file://...
        return fileurl_2_nsfile( file ).exists( );
    }
    : (isNode
    ? function fexists( file ) {
        return fs.existsSync(file);
    }
    : function fexists( file ) {
        return true;
    }),
    fexists_async = isXPCOM
    ? function fexists_async( file, cb ) {
        // file is URI, i.e file://...
        if ( cb ) cb ( fexists(file) );
    }
    : (isNode
    ? function fexists_async( file, cb ) {
        fs.exists(file, cb);
    }
    : function fexists_async( file, cb ) {
        if ( cb ) cb ( true );
    }),
    
    fstat = isXPCOM
    ? function fstat( file ) {
        // file is URI, i.e file://...
        var mtime = fileurl_2_nsfile( file ).lastModifiedTime;
        return {mtime: !!mtime ? new Date(mtime) : false};
    }
    : (isNode
    ? function fstat( file ) {
        return fs.statSync(file);
    }
    : function fstat( file ) {
        // http://stackoverflow.com/a/5748207/3591273
        var xhr = XHR( ), mtime, stats = {mtime: false};
        xhr.open('HEAD', file, false);  // 'false' makes the request synchronous
        xhr.send(null);
        if ( 200 === xhr.status )
        {
            mtime = new Date(xhr.getResponseHeader('Last-Modified'));
            if ( xhr.toString() === 'Invalid Date' ) mtime = false;
            stats.mtime = mtime;
        }
        return stats;
    }),
    fstat_async = isXPCOM
    ? function fstat_async( file, cb ) {
        if ( cb ) cb( fstat(file) );
    }
    : (isNode
    ? function fstat_async( file, cb ) {
        fs.stat(file, cb);
    }
    : function fstat_async( file, cb ) {
        // http://stackoverflow.com/a/5748207/3591273
        var xhr = XHR( ), mtime, stats = {mtime: false};
        xhr.open('HEAD', file, true);  // 'true' makes the request asynchronous
        xhr.onload = function( ) {
            if ( 200 === xhr.status )
            {
                mtime = new Date(xhr.getResponseHeader('Last-Modified'));
                if ( mtime.toString() === 'Invalid Date' ) mtime = false;
                stats.mtime = mtime;
            }
            if ( cb ) cb( stats );
        };
        xhr.send(null);
    }),
    
    fread = isXPCOM
    ? function fread( file, enc ) {
        // file is URI, i.e file://...
        var data = '', stream, conv, len, str = {value:''}, read = 0;
        // https://developer.mozilla.org/en-US/Add-ons/Code_snippets/File_I_O
        stream = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream);
        conv = Cc["@mozilla.org/intl/converter-input-stream;1"].createInstance(Ci.nsIConverterInputStream);
        stream.init(fileurl_2_nsfile( file ), -1, 0, 0);
        conv.init(stream, enc||'UTF-8', 0, 0);
        do { 
            // read as much as we can and put it in str.value
            read = conv.readString(0xffffffff, str);
            data += str.value;
        } while (0 != read);
        conv.close(); // this closes stream
        return data;
    }
    : (isNode
    ? function fread( file, enc ) {
        return fs.readFileSync(file, {encoding:enc||'utf8'})/*.toString()*/;
    }
    : function fread( file, enc ) {
        var xhr = XHR( );
        // plain text with enc encoding format
        xhr.open('GET', file, false);  // 'false' makes the request synchronous
        // http://stackoverflow.com/questions/9855127/setting-xmlhttprequest-responsetype-forbidden-all-of-a-sudden
        xhr.setRequestHeader("Content-Type", "text/plain; charset="+(enc||'utf8')+"");
        xhr.overrideMimeType("text/plain; charset="+(enc||'utf8')+"");
        xhr.send( null );
        return 200 === xhr.status ? xhr.responseText : '';
    }),
    fread_async = isXPCOM
    ? function fread_async( file, enc, cb ) {
        // file is URI, i.e file://...
        // https://developer.mozilla.org/en-US/Add-ons/Code_snippets/File_I_O
        NetUtil.asyncFetch(fileurl_2_nsfile( file ), function( stream, status ) {
            var err = !Components.isSuccessCode( status ),
                data = err
                ? ''
                : NetUtil.readInputStreamToString( stream, stream.available(), {charset:enc||'UTF-8'} );
            if ( cb ) cb( err, data );
        });
    }
    : (isNode
    ? function fread_async( file, enc, cb ) {
        fs.readFile(file, {encoding:enc||'utf8'}, cb);
    }
    : function fread_async( file, enc, cb ) {
        var xhr = XHR( );
        // plain text with enc encoding format
        xhr.open('GET', file, true);  // 'true' makes the request asynchronous
        xhr.responseType = "text";
        xhr.setRequestHeader("Content-Type", "text/plain; charset="+(enc||'utf8')+"");
        xhr.overrideMimeType("text/plain; charset="+(enc||'utf8')+"");
        xhr.onload = function( ) {
            var err = 200 !== xhr.status,
                data = err ? '' : xhr.responseText;
            if ( cb ) cb( err, data );
        };
        xhr.send( null );
    }),
    
    fwrite = isXPCOM
    ? function fwrite( file, data, enc ) {
        // file is URI, i.e file://...
        var stream = Cc["@mozilla.org/network/file-output-stream;1"].createInstance(Ci.nsIFileOutputStream),
            conv = Cc["@mozilla.org/intl/converter-output-stream;1"].createInstance(Ci.nsIConverterOutputStream);
        // use 0x02 | 0x10 to open file for appending.
        // write, create, truncate
        // In a c file operation, we have no need to set file mode with or operation,
        // directly using "r" or "w" usually.
        // if you are sure there will never ever be any non-ascii text in data you can 
        // also call foStream.write(data, data.length) directly
        // https://bugzilla.mozilla.org/show_bug.cgi?id=572890
        stream.init(fileurl_2_nsfile( file ), 0x02|0x08|0x20, 0x1B6/*0666*/, 0); 
        conv.init(stream, enc||"UTF-8", 0, 0);
        conv.writeString( data );
        conv.close( ); // this closes stream
    }
    : (isNode
    ? function fwrite( file, data, enc ) {
        fs.writeFileSync(file, data, {encoding:enc||'utf8'})/*.toString()*/;
    }
    : function fwrite( file, data, enc ) {
    }),
    fwrite_async = isXPCOM
    ? function fwrite_async( file, data, enc, cb ) {
        // file is URI, i.e file://...
        // http://stackoverflow.com/questions/9777773/reading-writing-file-on-local-machine
        var istream, ostream, conv;
        ostream = FileUtils.openSafeFileOutputStream( fileurl_2_nsfile( file ) );
        conv = Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);
        conv.charset = enc||"UTF-8";
        istream = conv.convertToInputStream( data );
        NetUtil.asyncCopy(istream, ostream, function( status ) {
            if ( cb  ) cb ( Components.isSuccessCode(status) )
        });
    }
    : (isNode
    ? function fwrite_async( file, data, enc, cb ) {
        fs.writeFile(file, data, {encoding: enc||'utf8'}, cb);
    }
    : function fwrite_async( file, data, enc, cb ) {
        if ( cb ) cb( );
    }),
    FUNC = isXPCOM
    ? function FUNC( a, f ) {
        // create new sandbox instance
        // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Language_Bindings/Components.utils.Sandbox
        /*system principal*/ /*null*/ /*null principal*/
        var principal = Cc["@mozilla.org/systemprincipal;1"].createInstance(Ci.nsIPrincipal),
            sandbox = new Cu.Sandbox(principal, {
                sandboxName: 'contemplate_sandbox_' + $__context.id,
                sameZoneAs: Contemplate,
                wantComponents: false,
                wantExportHelpers: false,
                wantXrays: true,
                wantGlobalProperties: []
            }), fn_uuid = Contemplate.uuid('dyna_func');
        sandbox.Contemplate = Contemplate;
        /*return */Cu.evalInSandbox(';function '+fn_uuid+'('+a+'){'+f+'};', sandbox);
        return sandbox[fn_uuid];
    }
    : function FUNC( a, f ) {
        return new Function( a, f );
    }
;



// utilities
function RE( r, f )
{
    return new RegExp( r, f||'' );
}
function empty( o )
{
    if ( !o || !Boolean(o) ) return true;
    var to_string = toString.call(o);
    if ( (o instanceof Array || o instanceof String || '[object Array]' === to_string || '[object String]' === to_string) && !o.length ) return true;
    if ( (o instanceof Object || '[object Object]' === to_string) && !Keys(o).length ) return true;
    return false;
}
/*function iif( cond_, then_, else_ )
{
    if ( arguments.length < 3 ) else_ = null;
    return cond_ ? then_ : else_;
}*/
// php-like functions, mostly adapted and optimised from phpjs project, https://github.com/kvz/phpjs
// http://jsperf.com/instanceof-array-vs-array-isarray/6
function is_array( o )
{ 
    return o && ((o.constructor === Arr)/*(o instanceof Arr)*/ || ('[object Array]' === toString.call(o))); 
}
function is_object( o )
{ 
    return o && ((o.constructor === Obj)/*(o instanceof Obj)*/ || ('[object Object]' === toString.call(o))); 
}
function count( mixed_var )
{
    return null == mixed_var
    ? 0
    : (is_array(mixed_var)
    ? mixed_var.length
    : (is_object(mixed_var)
    ? Keys(mixed_var).length
    : 1));
}
function ltrim( str, charlist ) 
{
    return (str+'').replace(
        !charlist ? ltrim_re : RE('^[' + (charlist+'').replace(re_9, '\\$1') + ']+', 'g'),
    '');
}
function rtrim( str, charlist ) 
{
    return (str+'').replace(
        !charlist ? rtrim_re : RE('[' + (charlist+'').replace(re_9, '\\$1') + ']+$', 'g'),
    '');
}
function trim( str, charlist ) 
{
    return (str+'').replace(
        !charlist ? trim_re : RE('^[' + (charlist=(charlist+'').replace(re_9, '\\$1')) + ']+|[' + charlist + ']+$', 'g'),
    '');
}
function pad( s, len, ch )
{
    var sp = s.toString( ), n = len-sp.length;
    return n > 0 ? new Array(n+1).join(ch||' ')+sp : sp;
}
function rawurlencode( str )
{
    // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
    // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
    return encodeURIComponent('' + str).replace(re_2, '%21').replace(re_3, '%27').replace(re_4, '%28').
    replace(re_5, '%29').replace(re_6, '%2A');
}
function urlencode( str )
{
    // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
    // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
    return encodeURIComponent('' + str).replace(re_2, '%21').replace(re_3, '%27').replace(re_4, '%28').
    replace(re_5, '%29').replace(re_6, '%2A').replace(re_7, '+');
}
function php_time( )
{
    return floor(new Date().getTime() / 1000);
}
function php_date( format, timestamp )
{
    var formatted_datetime, f, i, l, jsdate,
        locale = default_date_locale
    ;
    
    // JS Date
    if ( timestamp instanceof Date ) jsdate = new Date( timestamp );
    // UNIX timestamp (auto-convert to int)
    else if ( "number" === typeof timestamp ) jsdate = new Date(timestamp * 1000);
    // undefined
    else/*if ( null === timestamp  || undef === timestamp )*/ jsdate = new Date( );
    
    var D = { }, tzo = jsdate.getTimezoneOffset( ), atzo = abs(tzo), m = jsdate.getMonth( ), jmod10;
    // 24-Hours; 0..23
    D.G = jsdate.getHours( );
    // Day of month; 1..31
    D.j = jsdate.getDate( ); jmod10 = D.j%10;
    // Month; 1...12
    D.n = m + 1;
    // Full year; e.g. 1980...2010
    D.Y = jsdate.getFullYear( );
    // Day of week; 0[Sun]..6[Sat]
    D.w = jsdate.getDay( );
    // ISO-8601 day of week; 1[Mon]..7[Sun]
    D.N = D.w || 7;
    // Day of month w/leading 0; 01..31
    D.d = pad(D.j, 2, '0');
    // Shorthand day name; Mon...Sun
    D.D = locale.day_short[ D.w ];
    // Full day name; Monday...Sunday
    D.l = locale.day[ D.w ];
    // Ordinal suffix for day of month; st, nd, rd, th
    D.S = locale.ordinal.ord[ D.j ] ? locale.ordinal.ord[ D.j ] : (locale.ordinal.ord[ jmod10 ] ? locale.ordinal.ord[ jmod10 ] : locale.ordinal.nth);
    // Day of year; 0..365
    D.z = round((new Date(D.Y, m, D.j) - new Date(D.Y, 0, 1)) / 864e5);
    // ISO-8601 week number
    D.W = pad(1 + round((new Date(D.Y, m, D.j - D.N + 3) - new Date(D.Y, 0, 4)) / 864e5 / 7), 2, '0');
    // Full month name; January...December
    D.F = locale.month[ m ];
    // Month w/leading 0; 01...12
    D.m = pad(D.n, 2, '0');
    // Shorthand month name; Jan...Dec
    D.M = locale.month_short[ m ];
    // Days in month; 28...31
    D.t = (new Date(D.Y, m+1, 0)).getDate( );
    // Is leap year?; 0 or 1
    D.L = D.Y % 4 === 0 & D.Y % 100 !== 0 | D.Y % 400 === 0;
    // ISO-8601 year
    D.o = D.Y + (11 === m && D.W < 9 ? 1 : (0 === m && D.W > 9 ? -1 : 0));
    // Last two digits of year; 00...99
    D.y = D.Y.toString( ).slice(-2);
    // am or pm
    D.a = D.G > 11 ? locale.meridian.pm : locale.meridian.am;
    // AM or PM
    D.A = D.G > 11 ? locale.meridian.PM : locale.meridian.AM;
    // Swatch Internet time; 000..999
    D.B = pad(floor((jsdate.getUTCHours( ) * 36e2 + jsdate.getUTCMinutes( ) * 60 + jsdate.getUTCSeconds( ) + 36e2) / 86.4) % 1e3, 3, '0');
    // 12-Hours; 1..12
    D.g = (D.G % 12) || 12;
    // 12-Hours w/leading 0; 01..12
    D.h = pad(D.g, 2, '0');
    // 24-Hours w/leading 0; 00..23
    D.H = pad(D.G, 2, '0');
    // Minutes w/leading 0; 00..59
    D.i = pad(jsdate.getMinutes( ), 2, '0');
    // Seconds w/leading 0; 00..59
    D.s = pad(jsdate.getSeconds( ), 2, '0');
    // Microseconds; 000000-999000
    D.u = pad(jsdate.getMilliseconds( ) * 1000, 6, '0');
    // Timezone identifier; e.g. Atlantic/Azores, ...
    // The following works, but requires inclusion of the very large
    // timezone_abbreviations_list() function.
    /*              return that.date_default_timezone_get();
    */
    D.e = '';
    // DST observed?; 0 or 1
    D.I = ((new Date(D.Y, 0) - Date.UTC(D.Y, 0)) !== (new Date(D.Y, 6) - Date.UTC(D.Y, 6))) ? 1 : 0;
    // Difference to GMT in hour format; e.g. +0200
    D.O = (tzo > 0 ? "-" : "+") + pad(floor(atzo / 60) * 100 + atzo % 60, 4, '0');
    // Difference to GMT w/colon; e.g. +02:00
    D.P = (D.O.substr(0, 3) + ":" + D.O.substr(3, 2));
    // Timezone abbreviation; e.g. EST, MDT, ...
    D.T = 'UTC';
    // Timezone offset in seconds (-43200...50400)
    D.Z = -tzo * 60;
    // Seconds since UNIX epoch
    D.U = jsdate / 1000 | 0;
    // ISO-8601 date. 'Y-m-d\\TH:i:sP'
    D.c = D.Y+'-'+D.m+'-'+D.d+'\\'+D.T+D.H+':'+D.i+':'+D.s+D.P;
    // RFC 2822 'D, d M Y H:i:s O'
    D.r = D.D+', '+D.d+' '+D.M+' '+D.Y+' '+D.H+':'+D.i+':'+D.s+' '+D.O;
        
    formatted_datetime = '';
    for (i=0,l=format.length; i<l; i++)
    {
        f = format.charAt( i );
        formatted_datetime += D[HAS](f) ? D[ f ] : f;
    }
    return formatted_datetime;
}
function localized_date( format, timestamp )
{
    var F = ['d','D','j','l','N','S','w','z','W','F','m','M','t','L','o','Y','y','a','A','B','g','G','h','H','i','s','u','e','I','O','P','T','Z','U'],
        D = { }, DATE = php_date( F.join( "\n" ), timestamp ).split( "\n" ), i, l, f,
        localised_datetime, locale = Contemplate.locale
    ;
    
    for (i=0,l=F.length; i<l; i++) D[ F[i] ] = DATE[ i ];
        
    // localise specific formats
    D.D = locale( D.D );
    D.l = locale( D.l );
    D.S = locale( D.S );
    D.F = locale( D.F );
    D.M = locale( D.M );
    D.a = locale( D.a );
    D.A = locale( D.A );
    
    // full date/time formats, constructed from localised parts
    D.c = D.Y+'-'+D.m+'-'+D.d+'\\'+D.T+D.H+':'+D.i+':'+D.s+D.P;
    D.r = D.D+', '+D.d+' '+D.M+' '+D.Y+' '+D.H+':'+D.i+':'+D.s+' '+D.O;
    
    localised_datetime = '';
    for (i=0,l=format.length; i<l; i++)
    {
        f = format.charAt( i );
        localised_datetime += D[HAS](f) ? D[ f ] : f;
    }
    return localised_datetime
}
function pad_( s, n, c, right )
{
    if ( null == c ) c = ' ';
    var str = String(s), l = str.length, p = l < n ? new Array(n-l+1).join(c) : '';
    return !!right ? str+p : p+str;
}
function justify( value, prefix, leftJustify, minWidth, zeroPad, customPadChar )
{
    var sv = String(value), diff = minWidth - sv.length;
    if ( diff > 0 )
    {
        if ( leftJustify || !zeroPad )
            sv = pad_(sv, minWidth, customPadChar, leftJustify);
        else
            sv = sv.slice(0, prefix.length) + pad_('', diff, '0', true) + sv.slice(prefix.length);
    }
    return sv;
}
function formatBaseX( value, base, prefix, leftJustify, minWidth, precision, zeroPad )
{
    // Note: casts negative numbers to positive ones
    var number = value >>> 0;
    prefix = prefix && number && {
    '2': '0b',
    '8': '0',
    '16': '0x'
    }[base] || '';
    value = prefix + pad_(number.toString(base), precision||0, '0', false);
    return justify(value, prefix, leftJustify, minWidth, zeroPad);
}
function formatString( value, leftJustify, minWidth, precision, zeroPad, customPadChar )
{
    if ( null != precision ) value = value.slice(0, precision);
    return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
}
function sprintf( )
{
    /* 
     * More info at: http://phpjs.org
     * 
     * This is version: 3.24
     * php.js is copyright 2011 Kevin van Zonneveld.
     */
    // http://kevin.vanzonneveld.net
    // +   original by: Ash Searle (http://hexmen.com/blog/)
    // + namespaced by: Michael White (http://getsprink.com)
    // +    tweaked by: Jack
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Paulo Freitas
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Dj
    // +   improved by: Allidylls
    // *     example 1: sprintf("%01.2f", 123.1);
    // *     returns 1: 123.10
    // *     example 2: sprintf("[%10s]", 'monkey');
    // *     returns 2: '[    monkey]'
    // *     example 3: sprintf("[%'#10s]", 'monkey');
    // *     returns 3: '[####monkey]'
    // *     example 4: sprintf("%d", 123456789012345);
    // *     returns 4: '123456789012345'
    var i = 1, fmt = arguments[0], a = arguments;
    var do_format = function do_format( substring, valueIndex, flags, minWidth, _, precision, type ) {
        var number, prefix, method, textTransform, value;
        if ( '%%' == substring ) return '%';

        // parse flags
        var leftJustify = false, positivePrefix = '', zeroPad = false, prefixBaseX = false,
            j, customPadChar = ' ', flagsl = flags.length;
        for (j=0; flags && j < flagsl; j++)
        {
            switch( flags.charAt(j) )
            {
                case ' ':
                    positivePrefix = ' ';
                    break;
                case '+':
                    positivePrefix = '+';
                    break;
                case '-':
                    leftJustify = true;
                    break;
                case "'":
                    customPadChar = flags.charAt(j + 1);
                    break;
                case '0':
                    zeroPad = true;
                    break;
                case '#':
                    prefixBaseX = true;
                    break;
            }
        }

        // parameters may be null, undefined, empty-string or real valued
        // we want to ignore null, undefined and empty-string values
        if ( !minWidth ) minWidth = 0;
        else if ( '*' == minWidth ) minWidth = +a[i++];
        else if ( '*' == minWidth.charAt(0) ) minWidth = +a[minWidth.slice(1, -1)];
        else minWidth = +minWidth;

        // Note: undocumented perl feature:
        if ( 0 > minWidth )
        {
            minWidth = -minWidth;
            leftJustify = true;
        }

        if ( !isFinite(minWidth) )
        {
            throw new Error('sprintf: (minimum-)width must be finite');
        }

        if ( !precision ) precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : undefined;
        else if ( '*' == precision ) precision = +a[i++];
        else if ( '*' == precision.charAt(0) ) precision = +a[precision.slice(1, -1)];
        else precision = +precision;

        // grab value using valueIndex if required?
        value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

        switch( type )
        {
            case 's':
                return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
            case 'c':
                return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
            case 'b':
                return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'o':
                return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'x':
                return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'X':
                return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
            case 'u':
                return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'i':
            case 'd':
                number = +value || 0;
                number = Math.round(number - number % 1); // Plain Math.round doesn't just truncate
                prefix = number < 0 ? '-' : positivePrefix;
                value = prefix + pad_(String(Math.abs(number)), precision, '0', false);
                return justify(value, prefix, leftJustify, minWidth, zeroPad);
            case 'e':
            case 'E':
            case 'f': // Should handle locales (as per setlocale)
            case 'F':
            case 'g':
            case 'G':
                number = +value;
                prefix = number < 0 ? '-' : positivePrefix;
                method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
                textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
                value = prefix + Math.abs(number)[method](precision);
                return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
            default:
                return substring;
        }
    };
    return fmt.replace( sprintf.format_re, do_format );
}
sprintf.format_re = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;


// init the engine on load
Contemplate.init( );

// export it
return Contemplate;
});