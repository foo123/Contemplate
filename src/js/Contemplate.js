/**
*  Contemplate
*  Light-weight Template Engine for PHP, Python, Node and client-side JavaScript
*
*  @version: 1.0.0
*  https://github.com/foo123/Contemplate
*
*  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed
*  http://ejohn.org/blog/javascript-micro-templating/
*
**/
!function( root, name, factory ) {
"use strict";

// export the module, umd-style (no other dependencies)
var isCommonJS = ("object" === typeof(module)) && module.exports, 
    isAMD = ("function" === typeof(define)) && define.amd, m;

// CommonJS, node, etc..
if ( isCommonJS ) 
    module.exports = (module.$deps = module.$deps || {})[ name ] = module.$deps[ name ] || (factory.call( root, {NODE:module} ) || 1);

// AMD, requireJS, etc..
else if ( isAMD && ("function" === typeof(require)) && ("function" === typeof(require.specified)) && require.specified(name) ) 
    define( name, ['require', 'exports', 'module'], function( require, exports, module ){ return factory.call( root, {AMD:module} ); } );

// browser, web worker, etc.. + AMD, other loaders
else if ( !(name in root) ) 
    (root[ name ] = (m=factory.call( root, {} ) || 1)) && isAMD && define( name, [], function( ){ return m; } );

}(  /* current root */          this, 
    /* module name */           "Contemplate",
    /* module factory */        function( exports, undef ) {
"use strict";

var __version__ = "1.0.0", Contemplate, Template, InlineTemplate, Ctx,

    // auxilliaries
    PROTO = 'prototype', HAS = 'hasOwnProperty', Obj = Object, Arr = Array, Str = String, Func = Function, 
    Keys = Obj.keys, parse_int = parseInt, parse_float = parseFloat,
    OP = Obj[PROTO], AP = Arr[PROTO], FP = Func[PROTO], _toString = OP.toString,
    isNode = "undefined" !== typeof(global) && '[object global]' === _toString.call(global),
    floor = Math.floor, round = Math.round, abs = Math.abs,
    re_1 = /([\s\S]*?)(&(?:#\d+|#x[\da-f]+|[a-zA-Z][\da-z]*);|$)/g,
    re_2 = /!/g, re_3 = /'/g, re_4 = /\(/g, re_5 = /\)/g, re_6 = /\*/g, re_7 = /%20/g,
    re_8 = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g,
    re_9 = /([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g,
    default_date_locale = {
        meridian: { am:'am', pm:'pm', AM:'AM', PM:'PM' },
        ordinal: { ord:{1:'st',2:'nd',3:'rd'}, nth:'th' },
        timezone: [ 'UTC','EST','MDT' ],
        timezone_short: [ 'UTC','EST','MDT' ],
        day: [ 'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday' ],
        day_short: [ 'Sun','Mon','Tue','Wed','Thu','Fri','Sat' ],
        month: [ 'January','February','March','April','May','June','July','August','September','October','November','December' ],
        month_short: [ 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec' ]
    }
    ,fs = null, XMLHttp = null
    ,frealpath, frealpath_async
    ,fexists, fexists_async
    ,fstat, fstat_async
    ,fread, fread_async
    ,fwrite, fwrite_async
;


/////////////////////////////////////////////////////////////////////////////////////
//
//  Contemplate Engine Main Class
//
//////////////////////////////////////////////////////////////////////////////////////

// private vars
var 
    $__isInited = false, $__async = false, 
    
    $__leftTplSep = "<%", $__rightTplSep = "%>", $__tplStart = "", $__tplEnd = "",
    
    $__preserveLinesDefault = "' + \"\\n\" + '", $__preserveLines = '',  
    $__EOL = "\n", $__TEOL = isNode ? require('os').EOL : "\n", $__escape = true,
    
    $__stack = null, $__level = 0, $__pad = "    ", $__idcnt = 0,
    $__locals, $__variables, $__loops = 0, $__ifs = 0, $__loopifs = 0, $__forType = 2,
    $__allblocks = null, $__allblockscnt = null,  $__openblocks = null,
    $__currentblock, $__startblock = null, $__endblock = null, $__blockptr = -1,
    $__extends = null, $__strings = null,
    
    $__ctx, $__ctxS, $__context, $__global,

    $__uuid = 0,
    
    UNDERLN = /[\W]+/g, NEWLINE = /\n\r|\r\n|\n|\r/g, SQUOTE = /'/g,
    ALPHA = /^[a-zA-Z_]/, NUM = /^[0-9]/, ALPHANUM = /^[a-zA-Z0-9_]/i, SPACE = /^\s/,
    
    re_amp = /&/g, re_lt = /</g, re_gt = />/g, re_quot = /"/g, re_quot_s = SQUOTE,
    
    //re_plugin = /^(plg_|plugin_)([a-zA-Z0-9_]+)/,
    re_controls = /(\t|[ ]?)[ ]*%([a-zA-Z_][a-zA-Z0-9_]*)\b[ ]*(\()(.*)$/g,
    
    $__controlConstructs = [
        'set', 'unset', 'isset',
        'if', 'elseif', 'else', 'endif',
        'for', 'elsefor', 'endfor',
        'extends', 'block', 'endblock',
        'include', 'super', 'getblock'
    ],
    
    $__funcs = [ 
        's', 'n', 'f', 'q', 'dq', 
        'echo', 'time', 'count',
        'lowercase', 'uppercase', 'ucfirst', 'lcfirst', 'sprintf',
        'date', 'ldate', 'locale', 'plural',
        'inline', 'tpl', 'uuid', 'haskey',
        'concat', 'ltrim', 'rtrim', 'trim', 'addslashes', 'stripslashes',
        'camelcase', 'snakecase', 
        'e', 'url'
    ],
    $__func_aliases = {
        'l': 'locale',
        'now': 'time',
        'template': 'tpl'
    },
    
    // generated cached tpl class code as a "heredoc" template (for Node cached templates)
    TT_ClassCode,   

    // generated cached tpl block method code as a "heredoc" template (for Node cached templates)
    TT_BlockCode, TT_BLOCK,

    TT_IF, TT_ELSEIF, TT_ELSE, TT_ENDIF,

    TT_FOR1,TT_FOR2, TT_ELSEFOR, TT_ENDFOR1,TT_ENDFOR2,

    TT_FUNC, TT_RCODE
;

function resetState( )
{
    // reset state
    $__loops = 0; $__ifs = 0; $__loopifs = 0; $__forType = 2; $__level = 0;
    $__allblocks = []; $__allblockscnt = {}; $__openblocks = [[null, -1]];
    $__extends = null; $__locals = {}; $__variables = {}; $__currentblock = '_';
    $__locals[$__currentblock] = $__locals[$__currentblock] || {};
    $__variables[$__currentblock] = $__variables[$__currentblock] || {};
    //$__escape = true;
}
function clearState( )
{
    // clear state
    $__loops = 0; $__ifs = 0; $__loopifs = 0; $__forType = 2; $__level = 0;
    $__allblocks = null; $__allblockscnt = null; $__openblocks = null;
    /*$__extends = null;*/ $__locals = null; $__variables = null; $__currentblock = null;
    $__idcnt = 0; $__stack = [];
    $__strings = null;
}
function pushState( )
{
    // push state
    $__stack.push([$__loops, $__ifs, $__loopifs, $__forType, $__level,
    $__allblocks, $__allblockscnt, $__openblocks, $__extends, $__locals, $__variables, $__currentblock]);
}
function popState( )
{
    // pop state
    var t = $__stack.pop( );
    $__loops = t[0]; $__ifs = t[1]; $__loopifs = t[2]; $__forType = t[3]; $__level = t[4];
    $__allblocks = t[5]; $__allblockscnt = t[6]; $__openblocks = t[7];
    $__extends = t[8]; $__locals = t[9]; $__variables = t[10]; $__currentblock = t[11];
}
function padLines( lines, level )
{
    // pad lines to generate formatted code
    if ( 2 > arguments.length ) level = $__level;
    
    if ( level >= 0 )
    {
        // needs one more additional level due to array.length
        var pad = 0===level ? "" : new Arr(level+1).join($__pad);
        lines = pad + (lines.split( NEWLINE ).join( $__TEOL + pad ));
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
function getSeparators( text, separators )
{
    var lines, seps;
    if ( separators )
    {
        seps = trim( separators ).split( " " );
        $__leftTplSep = trim( seps[ 0 ] );
        $__rightTplSep = trim( seps[ 1 ] );
    }
    else
    {
        // tpl separators are defined on 1st (non-empty) line of tpl content
        lines = text.split( "\n" );
        while ( lines.length && !trim( lines[ 0 ] ).length ) lines.shift( );
        if ( lines.length )
        {
            seps = trim( lines.shift( ) ).split( " " );
            $__leftTplSep = trim( seps[ 0 ] );
            $__rightTplSep = trim( seps[ 1 ] );
        }
        text = lines.join( "\n" );
    }
    return text;
}
function getTemplateContents( id, ctx, asyncCB )
{
    var template, contx;
    
    if ( arguments.length < 2 ) ctx = '__GLOBAL__';
    if ( ctx instanceof Ctx ) contx = ctx;
    else if ( ctx && $__ctx[HAS](ctx) ) contx = $__ctx[ctx];
    else contx = $__context;
    
    template = contx.templates[id] || $__global.templates[id];
    
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
            // nodejs
            if ( isNode ) 
            { 
                if ( $__async && asyncCB )
                {
                    // async
                    fread_async(template[0], Contemplate.ENCODING, function(err, data){
                        if ( err ) asyncCB( '' );
                        else asyncCB( data );
                    }); 
                    return '';
                }
                else
                {
                    // sync
                    return fread(template[0], Contemplate.ENCODING); 
                }
            }
            // client-side js and #id of DOM script-element given as template holder
            else if ( '#'===template[0].charAt(0) ) 
            { 
                if ( $__async && asyncCB )
                {
                    // async
                    asyncCB( window.document.getElementById(template[0].substring(1)).innerHTML || '' );
                    return '';
                }
                else
                {
                    // sync
                    return window.document.getElementById(template[0].substring(1)).innerHTML || ''; 
                }
            }
            // client-side js and url given as template location
            else 
            { 
                if ( $__async && asyncCB )
                {
                    // async
                    fread_async(template[0], Contemplate.ENCODING, function(err, data){
                        if ( err ) asyncCB( '' );
                        else asyncCB( data );
                    }); 
                    return '';
                }
                else
                {
                    // sync
                    return fread(template[0], Contemplate.ENCODING); 
                }
            }
        }
    }
    return '';
}

//
// Control structures
//

// whether var is set
function t_isset( varname )
{
    return '("undefined" !== typeof(' + varname + '))';
}
// set/create/update tpl var
function t_set( args )
{
    args = args.split(',');
    var varname = trim( args.shift( ) ),
        expr = trim( args.join( ',' ) )
    ;
    return "';" + $__TEOL + padLines( varname + ' = ('+ expr +');' ) + $__TEOL;
}
// unset/remove/delete tpl var
function t_unset( varname )
{
    if ( varname && varname.length )
    {
        varname = trim( varname );
        return "';" + $__TEOL + padLines( 'if ("undefined" !== typeof(' + varname + ')) delete ' + varname + ';' ) + $__TEOL;
    }
    return "';" + $__TEOL; 
}
// if
function t_if( cond )
{ 
    var out = "';" + padLines( TT_IF({
            'EOL': $__TEOL,
            'IFCOND': cond
        }) );
    $__ifs++; 
    $__level++;
    
    return out;
}
// elseif
function t_elseif( cond )
{ 
    $__level--;
    var out = "';" + padLines( TT_ELSEIF({
            'EOL': $__TEOL,
            'ELIFCOND': cond
        }) );
    $__level++;
    
    return out;
}
// else
function t_else( )
{ 
    $__level--;
    var out = "';" + padLines( TT_ELSE({ 
        'EOL': $__TEOL
    }) );
    $__level++;
    
    return out;
}
// endif
function t_endif( )
{ 
    $__ifs--; 
    $__level--;
    var out = "';" + padLines( TT_ENDIF({ 
        'EOL': $__TEOL
    }) );
    
    return out;
}
// for, foreach
function t_for( for_expr )
{
    var out,
        is_php_style = for_expr.indexOf(' as '),
        is_python_style = for_expr.indexOf(' in '),
        o, _o, kv, isAssoc
    ;
    
    if ( -1 < is_python_style )
    {
        for_expr = [for_expr.slice(0, is_python_style), for_expr.slice(is_python_style+4)];
        o = trim(for_expr[1]);
        _o = '_loc_' + (++$__idcnt);
        kv = for_expr[0].split(',');
    }
    else /*if ( -1 < is_php_style )*/
    {
        for_expr = [for_expr.slice(0, is_php_style), for_expr.slice(is_php_style+4)];
        o = trim(for_expr[0]);
        _o = '_loc_' + (++$__idcnt);
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
        $__locals[$__currentblock][$__variables[$__currentblock][k]] = 1; 
        $__locals[$__currentblock][$__variables[$__currentblock][v]] = 1;
        out = "';" + padLines(TT_FOR2({
            'EOL': $__TEOL,
            'O': o, '_O': _o, '_OK': _oK,
            'K': k, '_K': _k, '_L': _l, 'V': v,
            'ASSIGN1': ""+k+" = "+_oK+"["+_k+"]; "+v+" = "+_o+"["+k+"];"
        }));
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
        $__locals[$__currentblock][$__variables[$__currentblock][v]] = 1;
        out = "';" + padLines(TT_FOR1({
            'EOL': $__TEOL,
            'O': o, '_O': _o, '_OV': _oV, '_ARR': _arr,
            '_KK': _kk, '_K': _k, '_L': _l, 'V': v,
            'ASSIGN1': ""+v+" = "+_arr+" ? "+_kk+" : "+_o+"["+_kk+"];"
        }));
        $__forType = 1;
        $__level+=2;
    }
    $__loops++;  $__loopifs++;
    
    return out;
}
// elsefor
function t_elsefor( )
{ 
    /* else attached to  for loop */ 
    var out;
    if ( 2 === $__forType )
    {
        $__loopifs--;  
        $__level+=-2;
        out = "';" + padLines( TT_ELSEFOR( {
            'EOL': $__TEOL
        } ) );
        $__level+=1;
    }
    else
    {
        $__loopifs--;  
        $__level+=-2;
        out = "';" + padLines( TT_ELSEFOR( {
            'EOL': $__TEOL
        } ) );
        $__level+=1;
    }
    
    return out;
}
// endfor
function t_endfor( )
{
    var out;
    if ( $__loopifs === $__loops ) 
    { 
        if ( 2 === $__forType )
        {
            $__loops--; $__loopifs--;  
            $__level+=-2;
            out = "';" + padLines( TT_ENDFOR2( {
                'EOL': $__TEOL
            } ) );
        }
        else
        {
            $__loops--; $__loopifs--;  
            $__level+=-2;
            out = "';" + padLines( TT_ENDFOR2( {
                'EOL': $__TEOL
            } ) );
        }
    }
    else
    {
        $__loops--; 
        $__level+=-1;
        out = "';" + padLines( TT_ENDFOR1( {
            'EOL': $__TEOL
        } ) );
    }
    return out;
}
// include file
function t_include( id/*, asyncCB*/ )
{
    var ch, contx = $__context;
    id = trim( id );
    if ( $__strings && $__strings[HAS](id) ) id = $__strings[id];
    ch = id.charAt(0);
    if ( '"' === ch || "'" === ch ) id = id.slice(1,-1); // quoted id
    
    // cache it
    if ( !contx.partials[id] )
    {
        pushState();
        resetState();
        contx.partials[id] = " " + parse( getSeparators( getTemplateContents( id, contx ) ), false ) + "';" + $__TEOL;
        popState();
    }
    return padLines( contx.partials[id] );
}
// extend another template
function t_extends( id )
{ 
    id = trim( id );
    if ( $__strings && $__strings[HAS](id) ) id = $__strings[id];
    var ch = id.charAt(0);
    if ( '"' === ch || "'" === ch ) id = id.slice(1,-1); // quoted id
    
    $__extends = id;
    return "';" + $__TEOL; 
}
// define (overridable) block
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
    return "' +  #|" + block + "|#";
}
// end define (overridable) block
function t_endblock( )
{ 
    if ( 1 < $__openblocks.length ) 
    {
        var block = $__openblocks.shift( );
        $__endblock = block[0];
        $__blockptr = block[1]+1;
        $__startblock = null;
        $__currentblock = $__openblocks.length ? $__openblocks[0][0] : '_';
        return "#|/" + block[0] + "|#";
    }
    else
    {
        $__currentblock = '_';
    }
    return '';  
}

//
// auxilliary parsing methods
//
function split( s, leftTplSep, rightTplSep )
{
    var parts1, len, parts, i, tmp;
    parts1 = s.split( leftTplSep );
    len = parts1.length;
    parts = [];
    for (i=0; i<len; i++)
    {
        tmp = parts1[i].split( rightTplSep );
        parts.push ( tmp[0] );
        if (tmp.length > 1) parts.push ( tmp[1] );
    }
    return parts;
}
function parseConstructs( match, prefix, ctrl, startParen, rest )
{
    rest = rest || '';
    var out = '', args = '', 
        paren = 1, l = rest.length, 
        i = 0, ch, m
    ;
    
    // parse parentheses and arguments, accurately
    while ( i < l && paren > 0 )
    {
        ch = rest.charAt(i++);
        if ( '(' === ch ) paren++;
        else if ( ')' === ch ) paren--;
        if ( paren > 0 ) args += ch;
    }
    rest = rest.slice(args.length+1);
    
    m = $__controlConstructs.indexOf( ctrl );
    if ( -1 < m )
    {
        switch ( m )
        {
            case 0 /*'set'*/: 
                args = args.replace( re_controls, parseConstructs );
                out = t_set( args );
                rest = rest.replace( re_controls, parseConstructs );
                return out + rest;
            
            case 1 /*'unset'*/: 
                args = args.replace( re_controls, parseConstructs );
                out = t_unset( args );
                rest = rest.replace( re_controls, parseConstructs );
                return out + rest;
            
            case 2 /*'isset'*/: 
                args = args.replace( re_controls, parseConstructs );
                out = t_isset( args );
                rest = rest.replace( re_controls, parseConstructs );
                return out + rest;
            
            case 3 /*'if'*/: 
                args = args.replace( re_controls, parseConstructs );
                out = t_if( args );
                rest = rest.replace( re_controls, parseConstructs );
                return out + rest;
            
            case 4 /*'elseif'*/:  
                args = args.replace( re_controls, parseConstructs );
                out = t_elseif( args );
                rest = rest.replace( re_controls, parseConstructs );
                return out + rest;
            
            case 5 /*'else'*/: 
                out = t_else( args );
                rest = rest.replace( re_controls, parseConstructs );
                return out + rest;
            
            case 6 /*'endif'*/: 
                out = t_endif( args );
                rest = rest.replace( re_controls, parseConstructs );
                return out + rest;
            
            case 7 /*'for'*/: 
                args = args.replace( re_controls, parseConstructs );
                out = t_for( args );
                rest = rest.replace( re_controls, parseConstructs );
                return out + rest;
            
            case 8 /*'elsefor'*/: 
                out = t_elsefor( args );
                rest = rest.replace( re_controls, parseConstructs );
                return out + rest;
            
            case 9 /*'endfor'*/:  
                out = t_endfor( args );
                rest = rest.replace( re_controls, parseConstructs );
                return out + rest;
            
            case 10 /*'extends'*/:  
                out = t_extends( args );
                rest = rest.replace( re_controls, parseConstructs );
                return out + rest;
            
            case 11 /*'block'*/:  
                out = t_block( args );
                rest = rest.replace( re_controls, parseConstructs );
                return out + rest;
            
            case 12 /*'endblock'*/:  
                out = t_endblock( args );
                rest = rest.replace( re_controls, parseConstructs );
                return out + rest;
            
            case 13 /*'include'*/:  
                out = t_include( args );
                rest = rest.replace( re_controls, parseConstructs );
                return out + rest;
            
            case 14 /*'super'*/:  
                prefix = prefix || '';
                args = args.replace( re_controls, parseConstructs );
                out = 'self.renderSuperBlock(' + args + ', data)';
                rest = rest.replace( re_controls, parseConstructs );
                return prefix + out + rest;
            
            case 15 /*'getblock'*/:  
                prefix = prefix || '';
                args = args.replace( re_controls, parseConstructs );
                out = '__i__.renderBlock(' + args + ', data)';
                rest = rest.replace( re_controls, parseConstructs );
                return prefix + out + rest;
        }
    }
    
    if ( $__plugins[HAS](ctrl) )
    {
        // allow custom plugins as template functions
        prefix = prefix || '';
        var pl = $__plugins[ ctrl ];
        args = args.replace( re_controls, parseConstructs );
        out = ((pl instanceof Contemplate.InlineTemplate) ? pl.render({'args':args}) : (pl + '(' + args + ')'));
        rest = rest.replace( re_controls, parseConstructs );
        return prefix + out + rest;
    }
    
    if ( $__func_aliases[HAS](ctrl) ) ctrl = $__func_aliases[ctrl];
    m = $__funcs.indexOf( ctrl );
    if ( -1 < m )
    {
        prefix = prefix || '';
        args = args.replace( re_controls, parseConstructs );
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
            default: out = 'Contemplate.' + ctrl + '(' + args + ')';
        }
        rest = rest.replace( re_controls, parseConstructs );
        return prefix + out + rest;
    }
    
    return match;
}
function parseBlocks( s )
{
    var blocks = [], bl = $__allblocks.length, 
        block, delims, tag, rep, tl, rl,
        pos1, pos2, off, containerblock, echoed
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
        tag = "#|" + block + "|#";
        rep = echoed ? "__i__.renderBlock('" + block + "', data);" : "'';";
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
            blocks.push([ block, TT_BLOCK({
                    'EOL': $__TEOL,
                    'BLOCKCODE': s.slice( pos1+tl, pos2-tl-1 ) + "';"
                })]);
        }
        s = s.slice(0, pos1) + rep + s.slice(pos2+1);
        if ( 1 <= $__allblockscnt[ block ] ) $__allblockscnt[ block ]--;
    }
    //$__allblocks = null; $__allblockscnt = null; $__openblocks = null;
    
    return [s, blocks];
}
function parseVariable( s, i, l )
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
        variable = s[i++];
        while ( i < l && ALPHANUM.test(s[i]) )
        {
            variable += s[i++];
        }
        
        variable_raw = variable;
        // transform into tpl variable
        //variable_main = "data['"+variable_raw+"']";
        variable_main = "data."+variable_raw;
        variable_rest = '';
        $__idcnt++;
        id = "#VAR"+$__idcnt+"#";
        len = variable_raw.length;
        
        // extra space
        space = 0;
        while ( i < l && SPACE.test(s[i]) )
        {
            space++;
            i++;
        }
        
        bracketcnt = 0;
        
        // optional properties
        while ( i < l && ('.' === s[i] || '[' === s[i]) )
        {
            delim = s[i++];
            
            // extra space
            while ( i < l && SPACE.test(s[i]) )
            {
                space++;
                i++;
            }
        
            // alpha-numeric dot property
            if ( '.' === delim )
            {
                // property
                property = '';
                while ( i < l && ALPHANUM.test(s[i]) )
                {
                    property += s[i++];
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
                
                ch = s[i];
                
                // literal string property
                /*'"' === ch || "'" === ch*/
                if ( '"' === ch || "'" === ch )
                {
                    //property = parseString(s, ch, i+1, l);
                    str_ = q = ch; escaped = false; si = i+1;
                    while ( si < l )
                    {
                        str_ += (ch=s[si++]);
                        if ( q === ch && !escaped )  break;
                        escaped = (!escaped && '\\' === ch);
                    }
                    property = str_;
                    $__idcnt++;
                    strid = "#STR"+$__idcnt+"#";
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
                    property = s[i++];
                    while ( i < l && NUM.test(s[i]) )
                    {
                        property += s[i++];
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
                    subvariables = parseVariable(sub, 0, sub.length);
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
                        variable_rest += delim + s[i++];
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
                while ( i < l && SPACE.test( s[i] ) )
                {
                    space++;
                    i++;
                }
        
                // close bracket
                if ( ']' === s[i] )
                {
                    if ( bracketcnt > 0 )
                    {
                        bracketcnt--;
                        variable_rest += s[i++];
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
            while ( i < l && SPACE.test(s[i]) )
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
function parse( tpl, withblocks )
{
    var parts, len, parsed, s, i, isTag,
        tag, tagTpl, strings, variables, hasVariables, hasStrings, varname, id,
        countl, index, ch, out, tok, v, tokv, 
        multisplit_re = Contemplate.InlineTemplate.multisplit_re,
        special_chars = "$ \n\r\t\v'\"", ind,
        q, str_, escaped, si, space,
        str_re = /#STR\d+#/g, 
        blockTag, hasBlock, notFoundBlock
    ;
    
    parts = split( tpl, $__leftTplSep, $__rightTplSep );
    len = parts.length;
    isTag = false;
    parsed = '';
    
    for (i=0; i<len; i++)
    {
        s = parts[ i ];
        
        if ( isTag )
        {
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
                ch = s[ index++ ];
                ind = special_chars.indexOf( ch );
                
                // special chars
                if ( -1 < ind )
                {
                    // variable
                    /*'$' === ch*/
                    if ( 0 === ind )
                    {
                        if ( space > 0 )
                        {
                            out += " ";
                            space = 0;
                        }
                        tok = parseVariable(s, index, countl);
                        if ( tok )
                        {
                            for (v=0; v<tok.length; v++)
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
                    // special chars
                    /*SPACE.test(ch), "\n" === ch || "\r" === ch || "\t" === ch || "\v" === ch*/
                    else if ( ind < 6 )  
                    {
                        space++;
                    }
                    // literal string
                    /*'"' === ch || "'" === ch*/
                    else
                    {
                        if ( space > 0 )
                        {
                            out += " ";
                            space = 0;
                        }
                        //tok = parseString(s, ch, index, countl);
                        str_ = q = ch; escaped = false; si = index;
                        while ( si < countl )
                        {
                            str_ += (ch=s[si++]);
                            if ( q === ch && !escaped )  break;
                            escaped = (!escaped && '\\' === ch);
                        }
                        tok = str_;
                        $__idcnt++;
                        id = "#STR"+$__idcnt+"#";
                        strings[id] = tok;
                        out += id;
                        index += tok.length-1;
                        hasStrings = true;
                    }
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
            tag = tag.replace( re_controls, parseConstructs );
            
            // check for blocks
            if ( $__startblock )
            {
                $__startblock = "#|"+$__startblock+"|#";
                hasBlock = true;
            }
            else if ( $__endblock )
            {
                $__endblock = "#|/"+$__endblock+"|#";
                hasBlock = true;
            }
            notFoundBlock = hasBlock;
            
            // replacements
            /*.replace( re_repls, "' + ($1) + '" );*/
            if ( 9 === tag.charCodeAt(0) && 11 === tag.charCodeAt(tag.length-1) ) 
                tag = "' + ("+tag.slice(1,-1)+") + '";
            
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
                for (v=0; v<tagTpl.length; v++)
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
                tag = tag.slice(0,-1) + padLines($__tplEnd);
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
            
            s = tag;
            isTag = false;
        }
        else
        {
            if ( $__escape )
                s = s.split( "\\" ).join( "\\\\" ); // escape escapes
            
            s = s
                .split( "'" ).join( "\\'" )  // escape single quotes accurately (used by parse function)
                .split( /*"\n"*/ /\n/ ).join( $__preserveLines ) // preserve lines
            ;
            
            isTag = true;
        }
        
        parsed += s;
    }

    if ( false !== withblocks ) 
        return $__allblocks.length>0 ? parseBlocks( parsed ) : [parsed, []]; // render any blocks
    
    return parsed;
}
function getCachedTemplateName( id, cacheDir )
{ 
    return cacheDir + id.replace(UNDERLN, '_') + '_tpl.js'; 
}
function getCachedTemplateClass( id )
{ 
    return 'Contemplate_' + id.replace(UNDERLN, '_') + '_Cached'; 
}
function createTemplateRenderFunction( id, contx, seps )
{
    resetState();
    
    var blocks = parse( getSeparators( getTemplateContents( id, contx ), seps ) ), funcs = {}, b, bl, func, renderf, EOL;
    
    clearState();
    
    renderf = blocks[0];
    blocks = blocks[1];
    bl = blocks.length;
    
    EOL = $__TEOL;
    
   // Convert the template into pure JavaScript
    func = TT_FUNC({
        'EOL'           : EOL
        'FCODE'         : $__extends ? "__p__ = '';" : "__p__ = '" + renderf + "';"
    });
    
    // defined blocks
    for (b=0; b<bl; b++) funcs[blocks[b][0]] = FUNC("Contemplate,data,self,__i__", blocks[b][1]);
    
    //return [FUNC("Contemplate,__i__", func), funcs];
    return [FUNC("Contemplate", func), funcs];
}
function createCachedTemplate( id, contx, filename, classname, seps )
{
    resetState();
    
    var  
        funcs = {}, prefixCode, extendCode, renderCode, b, bl, sblocks, EOL,
        blocks = parse( getSeparators( getTemplateContents( id, contx ), seps ) ), renderf
    ;
    
    clearState();
    
    renderf = blocks[0];
    blocks = blocks[1];
    bl = blocks.length;
    
    EOL = $__TEOL;
    
    // tpl-defined blocks
    sblocks = [];
    for (b=0; b<bl; b++) 
    {
        sblocks.push(EOL + TT_BlockCode({
         'EOL'                  : EOL
        ,'BLOCKNAME'            : blocks[b][0]
        ,'BLOCKMETHODNAME'      : blocks[b][0]
        ,'BLOCKMETHODCODE'      : padLines(blocks[b][1], 1)
        }));
    }
    if ( sblocks.length )
    {
        sblocks = EOL + 
                    "self._blocks = { " + 
                    EOL + 
                    padLines( sblocks.join(',' + EOL), 1 ) + 
                    EOL + 
                    "};" +
                    EOL;
    }
    else
    {
        sblocks = '';
    }
    
    renderCode = TT_RCODE({
         'EOL'                  : EOL
        ,'RCODE'                : $__extends ? "__p__ = '';" : "__p__ += '" + renderf + "';"
    });
    extendCode = $__extends ? "self.extend('" + $__extends + "');" : '';
    
    if ( $__tplPrefixCode )  prefixCode = $__tplPrefixCode;
    else prefixCode = '';
    
  // generate tpl class
    var classCode = TT_ClassCode({
         'EOL'                  : EOL
        ,'CLASSNAME'            : classname
        ,'TPLID'                : id
        ,'PREFIXCODE'           : prefixCode
        ,'EXTENDCODE'           : padLines(extendCode, 1)
        ,'BLOCKS'               : padLines(sblocks, 1)
        ,'RENDERCODE'           : padLines(renderCode, 1)
    });
    return setCachedTemplate(filename, classCode);
}
function getCachedTemplate( id, contx, options )
{
    var template;
    if ( (template=contx.templates[id]) )
    {
        // inline templates saved only in-memory
        if ( template[1] )
        {
            // dynamic in-memory caching during page-request
            var funcs, tpl;
            if ( options.parsed )
            {
                // already parsed code was given
                tpl = Contemplate.Template( id ).setRenderFunction( FUNC("Contemplate", options.parsed) );
            }
            else
            {
                // parse code and create template class
                funcs = createTemplateRenderFunction( id, contx, options.separators ); 
                tpl = Contemplate.Template( id ).setRenderFunction( funcs[ 0 ] ).setBlocks( funcs[ 1 ] );
            }
            if ($__extends) tpl.extend( Contemplate.tpl($__extends, null, contx.id) );
            tpl.ctx( contx.id );
            return tpl;
        }
        
        else
        {
            if ( !isNode ) contx.cacheMode = Contemplate.CACHE_TO_DISK_NONE;
            
            if ( true !== options.autoUpdate && Contemplate.CACHE_TO_DISK_NOUPDATE === contx.cacheMode )
            {
                var cachedTplFile = getCachedTemplateName(id, contx.cacheDir), 
                    cachedTplClass = getCachedTemplateClass(id);
                if ( !fexists(cachedTplFile) )
                {
                    createCachedTemplate(id, contx, cachedTplFile, cachedTplClass, options.separators);
                }
                if ( fexists(cachedTplFile) )
                {
                    var tplclass = require( cachedTplFile )( Contemplate ), 
                        tpl = new tplclass( id )/*.setId( id )*/;
                    tpl.ctx( contx.id );
                    return tpl;
                }
                return null;
            }
            
            else if ( true === options.autoUpdate || Contemplate.CACHE_TO_DISK_AUTOUPDATE === contx.cacheMode )
            {    
                var cachedTplFile = getCachedTemplateName(id, contx.cacheDir), 
                    cachedTplClass = getCachedTemplateClass(id);
                if ( !fexists(cachedTplFile) )
                {
                    // if tpl not exist create it
                    createCachedTemplate(id, contx, cachedTplFile, cachedTplClass, options.separators);
                }
                else
                {
                    var stat = fstat(cachedTplFile), stat2 = fstat(template[0]);
                    if ( stat.mtime.getTime() <= stat2.mtime.getTime() )
                    {
                        // is out-of-sync re-create it
                        createCachedTemplate(id, contx, cachedTplFile, cachedTplClass, options.separators);
                    }
                }
                if ( fexists(cachedTplFile) )
                {
                    var tplclass = require( cachedTplFile )( Contemplate ), 
                        tpl = new tplclass( id )/*.setId( id )*/;
                    tpl.ctx( contx.id );
                    return tpl;
                }
                return null;
            }
                    
            else
            {    
                // dynamic in-memory caching during page-request
                var funcs = createTemplateRenderFunction( id, contx, options.separators ), 
                    tpl = Contemplate.Template( id ).setRenderFunction( funcs[ 0 ] ).setBlocks( funcs[ 1 ] );
                if ($__extends) tpl.extend( Contemplate.tpl($__extends, null, contx.id) );
                tpl.ctx( contx.id );
                return tpl;
            }
        }
    }
    return null;
}
function setCachedTemplate( filename, tplContents, asyncCB )
{ 
    if ( asyncCB )
        fwrite_async(filename, tplContents, Contemplate.ENCODING, asyncCB);
    else
        fwrite(filename, tplContents, Contemplate.ENCODING); 
}


/*
*  Template Engine
*
*/


// can use inline templates for plugins etc.. to enable non-linear plugin compile-time replacement
function InlineTemplate( tpl, replacements, compiled )
{
    var self = this;
    if ( !(self instanceof InlineTemplate) ) return new InlineTemplate(tpl, replacements, compiled);
    self.id = null;
    self._renderer = null;
    self.tpl = replacements instanceof RegExp 
        ? InlineTemplate.multisplit_re(tpl||'', replacements) 
        : InlineTemplate.multisplit( tpl||'', replacements||{} );
    if ( true === compiled )
    {
        self._renderer = InlineTemplate.compile( self.tpl );
        self.render = self._renderer;
    }
    else
    {
        self._renderer = null; 
        //self.render = InlineTemplate.prototype.render;
    }
}
InlineTemplate.VERSION = __version__;
InlineTemplate.multisplit = function multisplit( tpl, reps, as_array ) {
    var r, sr, s, i, j, a, b, c, al, bl/*, as_array = is_array(reps)*/;
    as_array = !!as_array;
    a = [ [1, tpl] ];
    for ( r in reps )
    {
        if ( reps.hasOwnProperty( r ) )
        {
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
    
    ,dispose: function( ) {
        var self = this;
        self.id = null;
        self.tpl = null;
        self._renderer = null;
        return self;
    }
    ,render: function( args ) {
        var self = this;
        args = args || [ ];
        
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
    self.id = null;
    if ( id ) self.id = id; 
}
Template.VERSION = __version__;
Template.spr = function( data, __i__ ) {
    var self = this, r, __ctx = false;
    if ( !__i__ )
    {
        __i__ = self;
        Contemplate._pushCtx( self._ctx );
        __ctx = true;
    }
    r = self._extends.render(data, __i__);
    if ( __ctx )  Contemplate._popCtx( );
    return r;
};
Template.fixr = function( self ) { 
    var sprTpl = self._extends;
    self.render = sprTpl && (sprTpl instanceof Template)
                ? Template.spr
                : ('function'===typeof self._renderer
                ? self._renderer
                : self.constructor[PROTO].render);
    return self;
};
Template[PROTO] = {
    constructor: Template
    ,id: null
    
    ,_renderer: null 
    ,_blocks: null
    ,_extends: null
    ,_ctx: null
    
    // public methods
    ,dispose: function( ) {
        var self = this;
        self._renderer = null;
        self._blocks = null;
        self._extends = null;
        self._ctx = null;
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
    
    ,renderBlock: function( block, data, __i__ ) {
        var self = this, r = '', __ctx = false, blocks;
        if ( !__i__ )
        {
            __i__ = self;
            Contemplate._pushCtx( self._ctx );
            __ctx = true;
        }
        blocks = self._blocks;
        if ( blocks && blocks[HAS](block) ) r = blocks[block](Contemplate, data, self, __i__);
        else if ( self._extends ) r = self._extends.renderBlock(block, data, __i__);
        if ( __ctx )  Contemplate._popCtx( );
        return r;
    }
    
    ,renderSuperBlock: function( block, data/*, __i__*/ ) {
        var self = this;
        //__i__ = __i__ || self;
        if ( self._extends ) return self._extends.renderBlock(block, data, self._extends);
        return '';
    }
    
    ,render: function( data, __i__ ) {
        var self = this, __p__ = '', __ctx = false;
        if ( !__i__ )
        {
            __i__ = self;
            Contemplate._pushCtx( self._ctx );
            __ctx = true;
        }
        if ( __ctx )  Contemplate._popCtx( );
        return __p__;
    }
}

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
    self.plurals          = { };
    self.plugins          = { };
    self.prefixCode       = '';
}
Ctx.VERSION = __version__;
Ctx[PROTO] = {
    constructor: Ctx
    
    ,id: null
    ,cacheDir: null
    ,cacheMode: null
    ,cache: null
    ,templates: null
    ,partials: null
    ,locale: null
    ,plurals: null
    ,plugins: null
    ,prefixCode: null
};


Contemplate = {

    // constants
    VERSION: __version__,
    
    CACHE_TO_DISK_NONE: 0,
    CACHE_TO_DISK_AUTOUPDATE: 2,
    CACHE_TO_DISK_NOUPDATE: 4,
    
    ENCODING: 'utf8',
    
    Template: Template,
    InlineTemplate: InlineTemplate,
    Ctx: Ctx,
    
    init: function( ) {
        if ( $__isInited ) return;
        
        // a default global context
        $__global = new Ctx('__GLOBAL__');
        $__ctx = {
        '__GLOBAL__'  : $__global
        };
        $__context = $__global;
        $__ctxS = [];
        
        // pre-compute the needed regular expressions
        $__preserveLines = $__preserveLinesDefault;
        $__tplStart = "';" + $__TEOL;
        $__tplEnd = $__TEOL + "__p__ += '";
        
        // make compilation templates
        TT_ClassCode = InlineTemplate.compile(InlineTemplate.multisplit([
            "#PREFIXCODE#"
            ,"!function (root, moduleName, moduleDefinition) {"
            ,"var m;"
            ,"// node, CommonJS, etc.."
            ,"if ( 'object' === typeof(module) && module.exports ) module.exports = moduleDefinition();"
            ,"// browser and AMD, etc.."
            ,"else (root[ moduleName ] = m = moduleDefinition()) && ('function' === typeof(define) && define.amd && define(moduleName,[],function(){return m;}));"
            ,"}(this, '#CLASSNAME#', function( ){"
            ,"\"use strict\";"
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
            ,"    if ( !__i__ )"
            ,"    {"
            ,"        __i__ = self;"
            ,"        Contemplate._pushCtx( self._ctx );"
            ,"        __ctx = true;"
            ,"    }"
            ,"    /* tpl main render code starts here */"
            ,"#RENDERCODE#"
            ,"    /* tpl main render code ends here */"
            ,"    if ( __ctx )  Contemplate._popCtx( );"
            ,"    return __p__;"
            ,"};"
            ,"// export it"
            ,"return #CLASSNAME#;"
            ,"};"
            ,"});"
            ,""
        ].join( "#EOL#" ), {
             "#EOL#":            "EOL"
            ,"#PREFIXCODE#":     "PREFIXCODE"
            ,"#CLASSNAME#":      "CLASSNAME"
            ,"#TPLID#":          "TPLID"
            ,"#BLOCKS#":         "BLOCKS"
            ,"#EXTENDCODE#":     "EXTENDCODE"
            ,"#RENDERCODE#":     "RENDERCODE"
        }));
    
        TT_BlockCode = InlineTemplate.compile(InlineTemplate.multisplit([
            ""
            ,"/* tpl block render method for block '#BLOCKNAME#' */"
            ,"'#BLOCKMETHODNAME#': function( Contemplate, data, self, __i__ ) {"
            ,"#BLOCKMETHODCODE#"
            ,"}"
            ,""
        ].join( "#EOL#" ), {
             "#EOL#":               "EOL"
            ,"#BLOCKNAME#":         "BLOCKNAME"
            ,"#BLOCKMETHODNAME#":   "BLOCKMETHODNAME"
            ,"#BLOCKMETHODCODE#":   "BLOCKMETHODCODE"
        }));

        TT_BLOCK = InlineTemplate.compile(InlineTemplate.multisplit([
            "\"use strict\";"
            ,"var __p__ = '';"
            ,"#BLOCKCODE#"
            ,"return __p__;"
            ,""
        ].join( "#EOL#" ), {
             "#EOL#":       "EOL"
            ,"#BLOCKCODE#": "BLOCKCODE"
        }));

        TT_IF = InlineTemplate.compile(InlineTemplate.multisplit([
            ""
            ,"if (#IFCOND#)"
            ,"{"
            ,""
        ].join( "#EOL#" ), {
             "#EOL#":       "EOL"
            ,"#IFCOND#":    "IFCOND"
        }));
    
        TT_ELSEIF = InlineTemplate.compile(InlineTemplate.multisplit([
            ""
            ,"}"
            ,"else if (#ELIFCOND#)"
            ,"{"
            ,""
        ].join( "#EOL#" ), {
             "#EOL#":       "EOL"
            ,"#ELIFCOND#":  "ELIFCOND"
        }));
    
        TT_ELSE = InlineTemplate.compile(InlineTemplate.multisplit([
            ""
            ,"}"
            ,"else"
            ,"{"
            ,""
        ].join( "#EOL#" ), {
            "#EOL#":               "EOL"
        }));
    
        TT_ENDIF = InlineTemplate.compile(InlineTemplate.multisplit([
            ""
            ,"}"
            ,""
        ].join( "#EOL#" ), {
            "#EOL#":               "EOL"
        }));
    
        TT_FOR2 = InlineTemplate.compile(InlineTemplate.multisplit([
            ""
            ,"var #_O# = #O#, #_OK# = #_O# ? Object.keys(#_O#) : null,"
            ,"    #_K#, #K#, #V#, #_L# = #_OK# ? #_OK#.length : 0;"
            ,"if (#_L#)"
            ,"{"
            ,"    for (#_K#=0; #_K#<#_L#; #_K#++)"
            ,"    {"
            ,"        #ASSIGN1#"
            ,"        "
            ,""
        ].join( "#EOL#" ), {
             "#EOL#":   "EOL"
            ,"#O#":     "O"
            ,"#_O#":    "_O"
            ,"#_OK#":   "_OK"
            ,"#_K#":    "_K"
            ,"#K#":     "K"
            ,"#V#":     "V"
            ,"#_L#":    "_L"
            ,"#ASSIGN1#":"ASSIGN1"
        }));
        TT_FOR1 = InlineTemplate.compile(InlineTemplate.multisplit([
            ""
            ,"var #_O# = #O#, #_ARR# = !!#_O#.forEach," 
            ,"    #_OV# = #_O# ? (#_ARR# ? #_O# : Object.keys(#_O#)) : null,"
            ,"    #_K#, #_KK#, #V#, #_L# = #_OV# ? #_OV#.length : 0;"
            ,"if (#_L#)"
            ,"{"
            ,"    for (#_K#=0; #_K#<#_L#; #_K#++)"
            ,"    {"
            ,"        #_KK# = #_OV#[#_K#];"
            ,"        #ASSIGN1#"
            ,"        "
            ,""
        ].join( "#EOL#" ), {
             "#EOL#":    "EOL"
            ,"#O#":      "O"
            ,"#_O#":    "_O"
            ,"#_OV#":    "_OV"
            ,"#_K#":    "_K"
            ,"#_KK#":    "_KK"
            ,"#_ARR#":    "_ARR"
            ,"#V#":     "V"
            ,"#_L#":    "_L"
            ,"#ASSIGN1#":"ASSIGN1"
        }));
    
        TT_ELSEFOR = InlineTemplate.compile(InlineTemplate.multisplit([
            ""
            ,"    }"
            ,"}"
            ,"else"
            ,"{  "
            ,""
        ].join( "#EOL#" ), {
            "#EOL#":               "EOL"
        }));
    
        TT_ENDFOR2 = InlineTemplate.compile(InlineTemplate.multisplit([
            ""
            ,"    }"
            ,"}"
            ,""
        ].join( "#EOL#" ), {
            "#EOL#":               "EOL"
        }));
        TT_ENDFOR1 = InlineTemplate.compile(InlineTemplate.multisplit([
            ""
            ,"}"
            ,""
        ].join( "#EOL#" ), {
            "#EOL#":               "EOL"
        }));
    
        TT_FUNC = InlineTemplate.compile(InlineTemplate.multisplit([
            "return function( data, __i__ ){"
            ,"\"use strict\";"
            ,"var self = this, __p__ = '', __ctx = false;"
            ,"if ( !__i__ )"
            ,"{"
            ,"    __i__ = self;"
            ,"    Contemplate._pushCtx( self._ctx );"
            ,"    __ctx = true;"
            ,"}"
            ,"#FCODE#"
            ,"if ( __ctx )  Contemplate._popCtx( );"
            ,"return __p__;"
            ,"};"
        ].join( "#EOL#" ), {
             "#EOL#":     "EOL"
            ,"#FCODE#":  "FCODE"
        }));
        
        TT_RCODE = InlineTemplate.compile(InlineTemplate.multisplit([
            ""
            ,"#RCODE#"
            ,""
        ].join( "#EOL#" ), {
             "#EOL#":     "EOL"
            ,"#RCODE#":   "RCODE"
        }));
        
        clearState();
        
        $__isInited = true;
    },
    
    //
    // Main methods
    //
    
    createCtx: function( ctx ) {
        if ( ctx && '__GLOBAL__' !== ctx && !$__ctx[HAS](ctx) ) $__ctx[ctx] = new Ctx( ctx );
    },
    
    disposeCtx: function( ctx ) {
        if ( ctx && '__GLOBAL__' !== ctx && $__ctx[HAS](ctx) ) delete $__ctx[ctx];
    },
    
    _pushCtx: function( ctx ) {
        $__ctxS.push( $__context.id );
        if ( ctx && $__ctx[HAS](ctx) ) $__context = $__ctx[ctx];
        else $__context = $__global;
    },
    
    _popCtx: function( ) {
        var ctx;
        if ( $__ctxS.length ) ctx = $__ctxS.pop( );
        else ctx = '__GLOBAL__';
        if ( ctx && $__ctx[HAS](ctx) ) $__context = $__ctx[ctx];
        else $__context = $__global;
    },
    
    setTemplateSeparators: function( seps ) {
        if ( seps )
        {
            if ( seps['left'] )  $__leftTplSep = ''+seps['left'];
            if ( seps['right'] ) $__rightTplSep = ''+seps['right'];
        }
    },
    
    setPreserveLines: function( enable ) { 
        if ( arguments.length < 1 ) enable = true; 
        if ( !!enable ) $__preserveLines = $__preserveLinesDefault; 
        else $__preserveLines = ''; 
    },
    
    // add custom plugins as template functions
    hasPlugin: function( name, ctx ) {
        return !!name && $__plugins[HAS](name);
    },
    
    // add custom plugins as template functions
    addPlugin: function( name, pluginCode, ctx ) {
        if ( name && pluginCode )
        {
            if ( pluginCode instanceof Contemplate.InlineTemplate )
            {
                $__plugins[ name ] = pluginCode;
            }
            else if ( undef === Contemplate[ name ] )
            {
                $__plugins[ name ] = 'Contemplate.' + name;
                Contemplate[ name ] = pluginCode;
            }
        }
    },

    setPrefixCode: function( preCode, ctx ) {
        if ( preCode ) $__tplPrefixCode = '' + preCode;
    },

    setLocales: function( locales, ctx ) { 
        if ( "object" === typeof locales )
        {
            $__locale = merge($__locale, locales);
        }
    },
    
    clearLocales: function( ctx ) { 
        $__locale = { }; 
    },
    
    setPlurals: function( plurals, ctx ) { 
        if ( "object" === typeof plurals )
        {
            for (var singular in plurals)
            {
                if ( plurals[HAS](singular) && null == plurals[ singular ] )
                {
                    // auto plural
                    plurals[ singular ] = singular+'s';
                }
            }
            $__plurals = merge($__plurals, plurals); 
        }
    },
    
    clearPlurals: function( ctx ) { 
        $__plurals = { }; 
    },
    
    setCacheDir: function( dir, ctx ) { 
        $__cacheDir = rtrim(dir, '/') + '/';  
    },
    
    setCacheMode: function( mode, ctx ) { 
        $__cacheMode = ( isNode ) ? mode : Contemplate.CACHE_TO_DISK_NONE; 
    },
    
    /*setSyncMode: function( bool ) { 
        $__async = !bool; 
    },*/
    
    clearCache: function( all, ctx ) { 
        $__cache = { }; 
        if ( all ) $__partials = { }; 
    },
    
    // add templates manually
    add: function( tpls, ctx ) { 
        if ( "object" === typeof tpls )
        {
            for (var tplID in tpls)
            {
                if ( tpls[HAS](tplID) )
                {
                    if ( is_array( tpls[ tplID ] ) )
                    {
                        // unified way to add tpls both as reference and inline
                        // inline tpl, passed as array
                        if ( tpls[ tplID ][ 0 ] )
                            $__templates[ tplID ] = [tpls[ tplID ][ 0 ], true];
                    }
                    else
                    {
                        $__templates[ tplID ] = [tpls[ tplID ], false];
                    }
                }
            }
        }
        else if ( tpls && tplStr )
        {
            if ( is_array( tplStr ) )
            {
                // unified way to add tpls both as reference and inline
                // inline tpl, passed as array
                if ( tplStr[ 0 ] )
                    $__templates[ tpls ] = [tplStr[ 0 ], true];
            }
            else
            {
                $__templates[ tpls ] = [tplStr, false]; 
            }
        }
    },

    // add templates manually
    hasTpl: function( tpl, ctx ) { 
        return !!tpl && $__templates[HAS](tpl);
    },

    getTemplateContents: getTemplateContents,
    
    parseTpl: function( tpl, options ) {
        var tmp, parsed, separators = options && options.separators ? options.separators : null;
        
        if ( separators )
        {
            tmp = [$__leftTplSep, $__rightTplSep];
            $__leftTplSep = separators[ 0 ];  $__rightTplSep = separators[ 1 ];
        }
        
        resetState( );
        parsed = parse( tpl );
        clearState();
        
        if ( separators )
        {
            $__leftTplSep = tmp[ 0 ]; $__rightTplSep = tmp[ 1 ];
        }
        
        return parsed;
    },
    
    //
    // Basic template functions
    //
    
    // return the requested template (with optional data)
    tpl: function( tpl, data, options ) {
        var tmpl, contx;
        if ( tpl instanceof Contemplate.Template )
        {
            tmpl = tpl;
        }
        else
        {
            contx = null;
            if ( options.substr )
            {
                if ( $__ctx[HAS](options) )
                    contx = $__ctx[options]; // preset context
                else
                    contx = $__context; // current context
                options = {};
            }
            
            options = merge({
                'autoUpdate': false,
                'refresh': false,
                'escape': true,
                'separators': null
            }, options);
            
            if ( options.context )
            {
                if ( $__ctx[HAS](options.context) )
                    contx = $__ctx[options.context]; // preset context
                else if ( !contx )
                    contx = $__context; // current context
                delete options.context;
            }
            
            $__escape = false !== options.escape;
            
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.
            if ( !!options.refresh || (!contx.cache[ tpl ] && !$__global.cache[ tpl ]) )
            {
                contx.cache[ tpl ] = getCachedTemplate( tpl, contx, options );
            }
            
            tmpl = contx.cache[ tpl ] || $__global.cache[ tpl ];
        }
        
        // Provide some basic currying to the user
        return ( "object" === typeof data ) ? tmpl.render( data ) : tmpl;
    },
    
    
    // inline tpls, both inside Contemplate templates (i.e as parameters) and in code
    inline: function( tpl, reps, compiled ) {
        return (tpl instanceof Contemplate.InlineTemplate) 
            ? tpl.render( reps ) 
            : Contemplate.InlineTemplate(tpl, reps, compiled);
    },
    
    // haskey, has_key, check if (nested) keys exist in tpl variable
    haskey: function( v/*, key1, key2, etc.. */ ) {
        var to_string = _toString.call( v ), args, i, tmp;
        if (!v || "[object Array]" !== to_string && "[object Object]" !== to_string) return false;
        args = arguments; tmp = v;
        for (i=1; i<args.length; i++)
        {
            if ( !tmp || !tmp[HAS](args[i]) ) return false;
            tmp = tmp[ args[i] ];
        }
        return true;
    },
    
    // basic custom faster html escaping
    // http://jsperf.com/split-join-vs-regex-replace/10
    e: function( s, entities ) {
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
    },
    
    // basic url escaping
    url: urlencode,
    
    // count items in obj/array
    count: count,
    
    addslashes: function( str ) {
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
    },
    
    stripslashes: function( str ) {
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
    },
    
    // Concatenate strings/vars
    concat: function( ) { 
        //return /*AP.*/slice.call( arguments ).join(''); 
        return AP.join.call( arguments, '' ); 
    },
    
    // Trim strings in templates
    trim: trim,
    ltrim: ltrim,
    rtrim: rtrim,
    
    ucfirst: function( s ) {
        return s[0].toUpperCase( ) + s.substr(1);//.toLowerCase();
    },
    lcfirst: function( s ) {
        return s[0].toLowerCase( ) + s.substr(1);//.toUpperCase();
    },
    camelcase: function( s, sep, capitalizeFirst ) {
        sep = sep || "_";
        if ( capitalizeFirst )
            return s.split( sep ).map( Contemplate.ucfirst ).join( "" );
        else
            return Contemplate.lcfirst( s.split( sep ).map( Contemplate.ucfirst ).join( "" ) );
    },
    snakecase: function( s, sep ) {
        sep = sep || "_";
        return s.replace( /([A-Z])/g, sep + '$1' ).toLowerCase( );
    },
    // Sprintf in templates
    sprintf: sprintf,
    
    //
    //  Localization functions
    //
    
    // current time in seconds
    // time, now
    time: php_time,
    
    // formatted date
    date: function( format, timestamp ) { 
        if ( arguments.length < 2  ) timestamp = php_time( ); 
        return php_date( format, timestamp ); 
    },
    
    // localized formatted date
    ldate: function( format, timestamp ) { 
        if ( arguments.length < 2  ) timestamp = php_time( ); 
        return localized_date( format, timestamp ); 
    },
    
    // locale
    // locale, l
    locale: function( s ) { 
        return $__locale[HAS](s) ? $__locale[s] : s; 
    },
    // plural
    plural: function( singular, count ) {
        if ($__plurals[singular])
            return 1 !== count ? $__plurals[singular] : singular;
        return singular;
    },
    
    // generate a uuid
    uuid: function( namespace ) {
        return [namespace||'UUID', ++$__uuid, php_time()].join('_');
    },
    
    hasOwn: function( o, p ) { 
        return o && o[HAS](p); 
    },
    
    keys: function( o ) {
        return o ? Keys( o ) : null;
    },
    
    values: function( o ) { 
        if ( o )
        {
            if ( o.push/*o instanceof Arr*/ ) 
            {
                return o;
            }
            else
            {
                var a = [], k;
                for (k in o) 
                {
                    if ( o[HAS](k) ) a.push( o[k] );
                }
                return a;
            }
        }
        return null;
    },
    
    items: function( o ) {
        return o ? o : null;
    },
    
    merge: merge,
    
    data: function( o ) {
        if (is_array(o)) return o.slice();
        var c = {} /*Contemplate.merge({}, o)*/, key, newkey;
        // clone the data and
        // use php-style variables using '$' in front of var name
        for (key in o) 
        { 
            if (o[HAS](key)) 
            { 
                //if ('$'==n[0]) continue;
                //if ('$'==key[0]) newkey = key;
                //else  newkey = '$'+key;
                newkey = key;
                c[newkey] = o[key]; 
                //delete c[n];
            } 
        } 
        return c;
    }
};

// Template Engine end here
//
//


// utilities
// php-like functions, mostly adapted from phpjs project
// http://jsperf.com/instanceof-array-vs-array-isarray/6
function is_array( o )
{ 
    return o && ((o.constructor === Arr)/*(o instanceof Arr)*/ || ('[object Array]' === _toString.call(o))); 
}
function is_object( o )
{ 
    return o && ((o.constructor === Obj)/*(o instanceof Obj)*/ || ('[object Object]' === _toString.call(o))); 
}
// adapted and optimised from phpjs project
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
    else if ( "number" === typeof timestamp ) jsdate =  new Date(timestamp * 1000);
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
    D.c = [ D.Y,'-',D.m,'-',D.d,'\\',D.T,D.H,':',D.i,':',D.s,D.P ].join('');
    // RFC 2822 'D, d M Y H:i:s O'
    D.r = [ D.D,', ',D.d,' ',D.M,' ',D.Y,' ',D.H,':',D.i,':',D.s,' ',D.O ].join('');
        
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
        localised_datetime, loc = $__context.locale, glo = $__global.locale
    ;
    
    for (i=0,l=F.length; i<l; i++) D[ F[i] ] = DATE[ i ];
        
    // localise specific formats
    if      ( loc[D.D] )  D.D = loc[ D.D ];
    else if ( glo[D.D] )  D.D = glo[ D.D ];
    if      ( loc[D.l] )  D.l = loc[ D.l ];
    else if ( glo[D.l] )  D.l = glo[ D.l ];
    if      ( loc[D.S] )  D.S = loc[ D.S ];
    else if ( glo[D.S] )  D.S = glo[ D.S ];
    if      ( loc[D.F] )  D.F = loc[ D.F ];
    else if ( glo[D.F] )  D.F = glo[ D.F ];
    if      ( loc[D.M] )  D.M = loc[ D.M ];
    else if ( glo[D.M] )  D.M = glo[ D.M ];
    if      ( loc[D.a] )  D.a = loc[ D.a ];
    else if ( glo[D.a] )  D.a = glo[ D.a ];
    if      ( loc[D.A] )  D.A = loc[ D.A ];
    else if ( glo[D.A] )  D.A = glo[ D.A ];
    
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

function FUNC( a, f )
{
    return new Func( a, f );
}
function RE( r, f )
{
    return new RegExp( r, f||'' );
}

if ( isNode )
{
    fs = require('fs');
    frealpath = function( file ) {
        return fs.realpathSync(file);
    };
    frealpath_async = function( file, cb ) {
        fs.realpath(file, cb);
    };
    fexists = function( file ) {
        return fs.existsSync(file);
    };
    fexists_async = function( file, cb ) {
        fs.exists(file, cb);
        return false;
    };
    fstat = function( file ) {
        return fs.statSync(file);
    };
    fstat_async = function( file, cb ) {
        fs.stat(file, cb);
    };
    fread = function( file, enc ) {
        return fs.readFileSync(file, {encoding: enc||'utf8'})/*.toString()*/;
    };
    fread_async = function( file, enc, cb ) {
        fs.readFile(file, {encoding: enc||'utf8'}, cb);
        return '';
    };
    fwrite = function( file, data, enc ) {
        fs.writeFileSync(file, data, {encoding: enc||'utf8'})/*.toString()*/;
    };
    fwrite_async = function( file, data, enc, cb ) {
        fs.writeFile(file, data, {encoding: enc||'utf8'}, cb);
    };
}
else
{
    XMLHttp = window.XMLHttpRequest
        // code for IE7+, Firefox, Chrome, Opera, Safari
        ? function( ){return new XMLHttpRequest();}
        // code for IE6, IE5
        : function( ){return new ActiveXObject("Microsoft.XMLHTTP");} // or ActiveXObject("Msxml2.XMLHTTP"); ??
    ;
    frealpath = function frealpath( file ) {
        var link, url;
        if ( !frealpath.link ) frealpath.link = document.createElement('a');
        // http://stackoverflow.com/a/14781678/3591273
        // let the browser generate abs path
        link = frealpath.link;
        link.href = file;
        url = link.protocol + "//" + link.host + link.pathname + link.search + link.hash;
        return url;
    };
    frealpath_async = function frealpath_async( file, cb ) {
        var link, url;
        if ( !frealpath_async.link ) frealpath_async.link = document.createElement('a');
        // http://stackoverflow.com/a/14781678/3591273
        // let the browser generate abs path
        link = frealpath_async.link;
        link.href = file;
        url = link.protocol + "//" + link.host + link.pathname + link.search + link.hash;
        if ( cb ) cb( url );
    };
    fexists = function( file ) {
        return true;
    };
    fexists_async = function( file, cb ) {
        if ( cb ) cb( true );
        return true;
    };
    fstat = function( file ) {
        // http://stackoverflow.com/a/5748207/3591273
        var xmlhttp = XMLHttp( );
        
        var mtime, stats = {
            mtime: false
        };
        xmlhttp.open('HEAD', file, false);  // 'false' makes the request synchronous
        xmlhttp.send(null);
        if ( 200 === xmlhttp.status )
        {
            mtime = new Date(xmlhttp.getResponseHeader('Last-Modified'));
            if ( mtime.toString() === 'Invalid Date' ) mtime = false;
            stats.mtime = mtime;
        }
        return stats;
    };
    fstat_async = function( file, cb ) {
        // http://stackoverflow.com/a/5748207/3591273
        var xmlhttp = XMLHttp( );
        
        var mtime, stats = {
            mtime: false
        };
        xmlhttp.onload = function( ) {
            if ( 200 === xmlhttp.status )
            {
                mtime = new Date(xmlhttp.getResponseHeader('Last-Modified'));
                if ( mtime.toString() === 'Invalid Date' ) mtime = false;
                stats.mtime = mtime;
            }
            if ( cb ) cb( stats );
        };
        xmlhttp.open('HEAD', file, false);  // 'false' makes the request synchronous
        xmlhttp.send(null);
    };
    fread = function( file, enc ) {
        var xmlhttp = XMLHttp( );
        
        // plain text with enc encoding format
        enc = enc || 'utf8';
        xmlhttp.open('GET', file, false);  // 'false' makes the request synchronous
        xmlhttp.setRequestHeader("Content-Type", "text/plain; charset="+enc+"");
        xmlhttp.overrideMimeType("text/plain; charset="+enc+"");
        // http://stackoverflow.com/questions/9855127/setting-xmlhttprequest-responsetype-forbidden-all-of-a-sudden
        //xmlhttp.responseType = "text";
        xmlhttp.send(null);
        return 200 === xmlhttp.status ? xmlhttp.responseText : '';
    };
    fread_async = function( file, enc, cb ) {
        var xmlhttp = XMLHttp( );
        
        // plain text with enc encoding format
        enc = enc || 'utf8';
        xmlhttp.open('GET', file, true);  // 'true' makes the request asynchronous
        xmlhttp.setRequestHeader("Content-Type", "text/plain; charset="+enc+"");
        xmlhttp.overrideMimeType("text/plain; charset="+enc+"");
        xmlhttp.responseType = "text";
        xmlhttp.onload = function( ) {
            var err = 200 !== xmlhttp.status
            if ( cb ) cb( err, err ? '' : xmlhttp.responseText );
        };
        xmlhttp.send(null);
        return '';
    };
    fwrite = function( file, data, enc ) {
    };
    fwrite_async = function( file, data, enc, cb ) {
        if ( cb ) cb( );
    };
}

/////////////////////////////////////////////////////////////////////////
//
//   PHP functions adapted from phpjs project
//   https://github.com/kvz/phpjs
//
///////////////////////////////////////////////////////////////////////////

// pad()
function pad_( str, len, chr, leftJustify ) 
{
    chr = chr || ' ';
    var padding = (str.length >= len) ? '' : new Array(1 + len - str.length >>> 0).join(chr);
    return leftJustify ? str + padding : padding + str;
}
// justify()
function justify_( value, prefix, leftJustify, minWidth, zeroPad, customPadChar ) 
{
    var diff = minWidth - value.length;
    if ( diff > 0 ) 
    {
        if ( leftJustify || !zeroPad ) 
            value = pad_(value, minWidth, customPadChar, leftJustify);
        else 
            value = value.slice(0, prefix.length) + pad_('', diff, '0', true) + value.slice(prefix.length);
    }
    return value;
}
// formatBaseX()
function formatBaseX_( value, base, prefix, leftJustify, minWidth, precision, zeroPad )
{
    // Note: casts negative numbers to positive ones
    var number = value >>> 0;
    prefix = prefix && number && {
        '2': '0b',
        '8': '0',
        '16': '0x'
        }[base] || '';
    value = prefix + pad_(number.toString(base), precision || 0, '0', false);
    return justify_(value, prefix, leftJustify, minWidth, zeroPad);
}
// formatString()
function formatString_( value, leftJustify, minWidth, precision, zeroPad, customPadChar ) 
{
    if ( null != precision )
        value = value.slice(0, precision);
    
    return justify_(value, '', leftJustify, minWidth, zeroPad, customPadChar);
}
function sprintf( ) 
{
    var a = arguments,
    i = 0, format = a[i++];

    // doFormat()
    var doFormat = function( substring, valueIndex, flags, minWidth, _, precision, type ) {
        var number, prefix, method, textTransform, value;

        if ('%%' == substring) return '%';

        // parse flags
        var leftJustify = false, positivePrefix = '', zeroPad = false,
            prefixBaseX = false, customPadChar = ' ',
            flagsl = flags.length, j
        ;
        for (j = 0; flags && j < flagsl; j++) 
        {
            switch (flags.charAt(j)) 
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
        if ( !minWidth ) 
            minWidth = 0;
        else if ( minWidth == '*' ) 
            minWidth = +a[i++];
        else if ( minWidth.charAt(0) == '*' ) 
            minWidth = +a[minWidth.slice(1, -1)];
        else 
            minWidth = +minWidth;

        // Note: undocumented perl feature:
        if ( minWidth < 0 ) 
        {
            minWidth = -minWidth;
            leftJustify = true;
        }

        if ( !isFinite(minWidth) ) 
        {
            throw new Error('sprintf: (minimum-)width must be finite');
        }

        if ( !precision ) 
            precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : undefined;
        else if ( precision == '*' )
            precision = +a[i++];
        else if ( precision.charAt(0) == '*' )
            precision = +a[precision.slice(1, -1)];
        else
            precision = +precision;

        // grab value using valueIndex if required?
        value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

        switch(type) 
        {
            case 's':
                return formatString_(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
            case 'c':
                return formatString_(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
            case 'b':
                return formatBaseX_(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'o':
                return formatBaseX_(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'x':
                return formatBaseX_(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'X':
                return formatBaseX_(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
            case 'u':
                return formatBaseX_(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'i':
            case 'd':
                number = +value || 0;
                number = Math.round(number - number % 1); // Plain Math.round doesn't just truncate
                prefix = number < 0 ? '-' : positivePrefix;
                value = prefix + pad_(String(Math.abs(number)), precision, '0', false);
                return justify_(value, prefix, leftJustify, minWidth, zeroPad);
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
                return justify_(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
            default:
                return substring;
        }
    };

    return format.replace(re_8, doFormat);
}
function ltrim( str, charlist ) 
{
    charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(re_9, '\\$1');
    return (str + '').replace(RE('^[' + charlist + ']+', 'g'), '');
}
function rtrim( str, charlist ) 
{
    charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(re_9, '\\$1');
    return (str + '').replace(RE('[' + charlist + ']+$', 'g'), '');
}
function trim( str, charlist ) 
{
    var whitespace, l = 0, i = 0; 
    str += '';

    if ( !charlist ) 
    {
        // default list
        whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
    } 
    else 
    {
        // preg_quote custom list
        charlist += '';
        whitespace = charlist.replace(re_9, '\\$1');
    }

    l = str.length;
    for (i = 0; i < l; i++) 
    {
        if ( whitespace.indexOf(str.charAt(i)) === -1 ) 
        {
            str = str.substring(i);
            break;
        }
    }

    l = str.length;
    for (i = l - 1; i >= 0; i--) 
    {
        if (whitespace.indexOf(str.charAt(i)) === -1) 
        {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}


// init the engine on load
Contemplate.init();

// export it
// add it to global namespace to be available for sub-templates, same as browser
//if ( isNode ) global.Contemplate = Contemplate;
return Contemplate;
});