/**
*  Contemplate
*  Light-weight Template Engine for PHP, Python, Node and client-side JavaScript
*
*  @version: 0.6.8
*  https://github.com/foo123/Contemplate
*
*  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed
*  http://ejohn.org/blog/javascript-micro-templating/
*
**/
!function( root, name, factory ) {
    "use strict";
    
    //
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
    
    var __version__ = "0.6.8", self,
    
        // auxilliaries
        Obj = Object, Arr = Array, Str = String, Func = Function, 
        Keys = Obj.keys, parse_int = parseInt, parse_float = parseFloat,
        OP = Obj.prototype, AP = Arr.prototype, FP = Func.prototype,
        _toString = FP.call.bind(OP.toString), _hasOwn = FP.call.bind(OP.hasOwnProperty), slice = FP.call.bind(AP.slice),
        isNode = "undefined" !== typeof(global) && '[object global]' === _toString(global),
        isArray = function( o ) { return (o instanceof Arr) || ('[object Array]' === _toString(o)); },
        
        _fs = isNode ? require('fs') : null, 
        fwrite = _fs ? _fs.writeFileSync : null,
        fread =  _fs ? _fs.readFileSync : null,
        fexists = _fs ? _fs.existsSync : null,
        fstat = _fs ? _fs.statSync : null,
        realpath = _fs ? _fs.realpathSync : null,
        fwriteAsync = _fs ? _fs.writeFile : null,
        freadAsync =  _fs ? _fs.readFile : null,
        fexistsAsync = _fs ? _fs.exists : null,
        fstatAsync = _fs ? _fs.stat : null,
        realpathAsync = _fs ? _fs.realpath : null,
        
        //
        // basic ajax functions
        //
        ajaxLoad = function( type, url, params, asyncCB ) {
            var xmlhttp;
            if (window.XMLHttpRequest) // code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            else // code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); // or ActiveXObject("Msxml2.XMLHTTP"); ??
            
            if ( asyncCB )
            {
                xmlhttp.onload = function( ) {
                    if ( 200 === xmlhttp.status ) asyncCB( xmlhttp.responseText );
                    else asyncCB( '' );
                };
                xmlhttp.open(type, url, true);  // 'true' makes the request asynchronous
                xmlhttp.send(params);
                return '';
            }
            else
            {
                xmlhttp.open(type, url, false);  // 'false' makes the request synchronous
                xmlhttp.send(params);
                if ( 200 === xmlhttp.status ) return xmlhttp.responseText;
                return '';
            }
        }
    ;

    /////////////////////////////////////////////////////////////////////////////////////
    //
    //  Contemplate Engine Main Class
    //
    //////////////////////////////////////////////////////////////////////////////////////
    
    // private vars
    var 
        $__isInited = false,  $__locale = {}, $__plurals = {},
        
        $__async = false, $__cacheMode = 0, $__cacheDir = './', $__cache = {}, $__templates = {}, 
        $__partials = {}, $__inlines = {},
        
        $__leftTplSep = "<%", $__rightTplSep = "%>", $__tplStart = "", $__tplEnd = "", $__tplPrefixCode = "",
        
        $__preserveLinesDefault = "' + \"\\n\" + '", $__preserveLines = '',  
        $__EOL = "\n", $__TEOL = isNode ? require('os').EOL : "\n", $__escape = true,
        
        $__stack = null, $__level = 0, $__pad = "    ", $__idcnt = 0,
        $__loops = 0, $__ifs = 0, $__loopifs = 0, $__forType = 2,
        $__allblocks = null, $__allblockscnt = null,  $__openblocks = null,
        $__startblock = null, $__endblock = null, $__blockptr = -1,
        $__extends = null,
    
        $__uuid = 0,
        
        UNDERLN = /[ -]/g, NEWLINE = /\n\r|\r\n|\n|\r/g,
        ALPHA = /^[a-zA-Z_]/, NUM = /^[0-9]/, ALPHANUM = /^[a-zA-Z0-9_]/i, SPACE = /^\s/,
        
        $__regExps = {
            'specials' : null,
            'replacements' : null,
            'functions' : null,
            'controls' : null,
            'controls2' : null
        },
        
        $__controlConstructs = [
            'include', 'template', 
            'extends', 'endblock', 'block',
            'elsefor', 'endfor', 'for',
            'set', 'unset', 'isset',
            'elseif', 'else', 'endif', 'if'
        ],
        
        $__funcs = [ 
            'htmlselect', 'htmltable', 
            'plugin_([a-zA-Z0-9_]+)', 'haskey', 
            'lowercase', 'uppercase', 'camelcase', 'snakecase', 'pluralise',
            'concat', 'ltrim', 'rtrim', 'trim', 'sprintf', 'addslashes', 'stripslashes',
            'tpl', 'uuid',
            'html', 'url', 'count', 
            'ldate', 'date', 'now', 'locale',
            'dq', 'q', 'l', 's', 'n', 'f' 
        ],
        
        $__plugins = { },
        
        resetState = function( ) {
            // reset state
            $__loops = 0; $__ifs = 0; $__loopifs = 0; $__forType = 2; $__level = 0;
            $__allblocks = []; $__allblockscnt = {}; $__openblocks = [[null, -1]];
            $__extends = null;
            //$__escape = true;
        },
        
        pushState = function( ) {
            // push state
            $__stack.push([$__loops, $__ifs, $__loopifs, $__forType, $__level,
            $__allblocks, $__allblockscnt, $__openblocks, $__extends]);
        },
        
        popState = function( ) {
            // pop state
            var t = $__stack.pop( );
            $__loops = t[0]; $__ifs = t[1]; $__loopifs = t[2]; $__forType = t[3]; $__level = t[4];
            $__allblocks = t[5]; $__allblockscnt = t[6]; $__openblocks = t[7];
            $__extends = t[8];
        },
        
        joinLines = function( ) {
            return slice( arguments ).join( $__TEOL );
        },
        
        // pad lines to generate formatted code
        padLines = function( lines, level ) {
            if ( 2 > arguments.length ) level = $__level;
            
            if ( level >= 0 )
            {
                // needs one more additional level due to array.length
                level = (0===level) ? level : level+1;
                var pad = new Arr(level).join($__pad), i, l;
                lines = lines.split(NEWLINE);
                l = lines.length;
                for (i=0; i<l; i++)
                {
                    lines[i] = pad + lines[i];
                }
                return lines.join( $__TEOL );
            }
            return lines;
        },
        
        merge = function( ) {
            var args = slice( arguments );
            if ( args.length < 1 ) return;
            var merged = args.shift( ), i, k, o, l = args.length;
            for (i=0; i<l; i++)
            { 
                o = args[ i ]; 
                if ( o ) 
                { 
                    for (k in o) 
                    { 
                        if ( _hasOwn(o, k) ) 
                        { 
                            merged[ k ] = o[ k ]; 
                        } 
                    } 
                } 
            }
            return merged;
        },
        
        getSeparators = function( text, separators ) {
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
        },
    
        getTemplateContents = function( id, asyncCB ) {
            if ( $__inlines[id] )
            {
                if ( $__async && asyncCB )
                {
                    // async
                    asyncCB( $__inlines[id] );
                    return '';
                }
                else
                {
                    // sync
                    return $__inlines[id];
                }
            }
            else if ( $__templates[id] )
            {
                // nodejs
                if ( isNode && _fs ) 
                { 
                    if ( $__async && asyncCB )
                    {
                        // async
                        freadAsync($__templates[id], { encoding: self.ENCODING }, function(err, data){
                            if ( err ) asyncCB( '' );
                            else asyncCB( data );
                        }); 
                        return '';
                    }
                    else
                    {
                        // sync
                        return fread($__templates[id], { encoding: self.ENCODING }); 
                    }
                }
                // client-side js and #id of DOM script-element given as template holder
                else if ( '#'===$__templates[id].charAt(0) ) 
                { 
                    if ( $__async && asyncCB )
                    {
                        // async
                        asyncCB( window.document.getElementById($__templates[id].substring(1)).innerHTML || '' );
                        return '';
                    }
                    else
                    {
                        // sync
                        return window.document.getElementById($__templates[id].substring(1)).innerHTML || ''; 
                    }
                }
                // client-side js and url given as template location
                else 
                { 
                    if ( $__async && asyncCB )
                    {
                        // async
                        ajaxLoad('GET', $__templates[id], null, asyncCB); 
                        return '';
                    }
                    else
                    {
                        // sync
                        return ajaxLoad('GET', $__templates[id]); 
                    }
                }
            }
            return '';
        },
        
        //
        // Control structures
        //
    
        // whether var is set
        t_isset = function( varname ) {
            return ' ("undefined" !== typeof(' + varname + ')) ';
        },
        
        // set/create/update tpl var
        t_set = function( args ) {
            args = args.split(',');
            var varname = trim( args.shift( ) ),
                expr = trim( args.join( ',' ) )
            ;
            return "';" + $__TEOL + padLines( varname + ' = ('+ expr +');' ) + $__TEOL;
        },
        
        // unset/remove/delete tpl var
        t_unset = function( varname ) {
            if ( varname && varname.length )
            {
                varname = trim( varname );
                return "';" + $__TEOL + padLines( 'if ("undefined" !== typeof(' + varname + ')) delete ' + varname + ';' ) + $__TEOL;
            }
            return "'; " + $__TEOL; 
        },
        
        // if
        t_if = function( cond ) { 
            var out = "';" + padLines( TT_IF({
                    'IFCOND': cond
                }) );
            $__ifs++; 
            $__level++;
            
            return out;
        },
        
        // elseif
        t_elseif = function( cond ) { 
            $__level--;
            var out = "';" + padLines( TT_ELSEIF({
                    'ELIFCOND': cond
                }) );
            $__level++;
            
            return out;
        },
        
        // else
        t_else = function( ) { 
            $__level--;
            var out = "';" + padLines( TT_ELSE( ) );
            $__level++;
            
            return out;
        },
        
        // endif
        t_endif = function( ) { 
            $__ifs--; 
            $__level--;
            var out = "';" + padLines( TT_ENDIF( ) );
            
            return out;
        },
        
        // for, foreach
        t_for = function( for_expr ) {
            for_expr = for_expr.split(' as ');
            var out,
                o = trim(for_expr[0]), 
                _o = '_O' + (++$__idcnt),
                kv = for_expr[1].split('=>'), 
                isAssoc = kv.length >= 2
            ;
            
            if ( isAssoc )
            {
                var k = trim(kv[0]) + '__RAW__',
                    v = trim(kv[1]) + '__RAW__',
                    _oK = '_OK' + (++$__idcnt),
                    _k = '_K' + (++$__idcnt),
                    _l = '_L' + (++$__idcnt),
                    _v = '_V' + (++$__idcnt)
                ;
                out = "';" + padLines(TT_FOR({
                    'O': o, '_O': _o, '_OK': _oK,
                    'K': k, '_K': _k, '_L': _l,
                    'V': v, '_V': _v,
                    'ASSIGN1': "data['"+k+"'] = "+_oK+"["+_k+"]; data['"+v+"'] = "+_v+" = "+_o+"["+_oK+"["+_k+"]];"
                }, 2));
                $__forType = 2;
                $__level+=2;
            }
            else
            {
                var v = trim(kv[0]) + '__RAW__',
                    _k = '_K' + (++$__idcnt),
                    _l = '_L' + (++$__idcnt),
                    _v = '_V' + (++$__idcnt)
                ;
                out = "';" + padLines(TT_FOR({
                    'O': o, '_O': _o,
                    '_K': _k, '_L': _l,
                    'V': v, '_V': _v,
                    'ASSIGN1': "data['"+v+"'] = "+_v+" = "+_o+"["+_k+"];"
                }, 1));
                $__forType = 1;
                $__level+=2;
            }
            $__loops++;  $__loopifs++;
            
            return out;
        },
        
        // elsefor
        t_elsefor = function( ) { 
            /* else attached to  for loop */ 
            var out;
            if ( 2 === $__forType )
            {
                $__loopifs--;  
                $__level+=-2;
                out = "';" + padLines( TT_ELSEFOR( null, 2 ) );
                $__level+=1;
            }
            else
            {
                $__loopifs--;  
                $__level+=-2;
                out = "';" + padLines( TT_ELSEFOR( null, 1 ) );
                $__level+=1;
            }
            
            return out;
        },
        
        // endfor
        t_endfor = function( ) {
            var out;
            if ( $__loopifs === $__loops ) 
            { 
                if ( 2 === $__forType )
                {
                    $__loops--; $__loopifs--;  
                    $__level+=-2;
                    out = "';" + padLines( TT_ENDFOR( null, 3 ) );
                }
                else
                {
                    $__loops--; $__loopifs--;  
                    $__level+=-2;
                    out = "';" + padLines( TT_ENDFOR( null, 2 ) );
                }
            }
            else
            {
                $__loops--; 
                $__level+=-1;
                out = "';" + padLines( TT_ENDFOR( null, 1 ) );
            }
            return out;
        },
        
        // include file
        t_include = function( id/*, asyncCB*/ ) {
            /*
            // async
            if ( asyncCB )
            {
                // cache it
                if ( !$__partials[id] )
                {
                    getTemplateContents( id, function( text ) {
                        pushState();
                        resetState();
                        $__partials[id] = " " + parse( getSeparators( text ), false ) + "'; " + $__TEOL;
                        popState();
                        asyncCB( padLines( $__partials[id] ) );
                    });
                }
                else
                {
                    asyncCB( padLines( $__partials[id] ) );
                }
                return '';
            }
            // sync
            else
            {*/
                // cache it
                if ( !$__partials[id] )
                {
                    pushState();
                    resetState();
                    $__partials[id] = " " + parse( getSeparators( getTemplateContents( id ) ), false ) + "'; " + $__TEOL;
                    popState();
                }
                return padLines( $__partials[id] );
            /*}*/
        },
        
        // include template
        t_template = function( args ) {
            args = args.split(',');
            var id = trim( args.shift( ) ),
                obj = args.join( ',' )
            ;
            return '\' + %tpl( "'+id+'", '+obj+' ); ' + $__TEOL;
        },
        
        // extend another template
        t_extends = function( tpl ) { 
            $__extends = trim( tpl ); 
            return "'; " + $__TEOL; 
        },
        
        // define (overridable) block
        t_block = function( block ) { 
            block = trim( block );
            $__allblocks.push( [block, -1, -1, 0, $__openblocks[ 0 ][ 1 ]] );
            $__allblockscnt[ block ] = $__allblockscnt[ block ] ? ($__allblockscnt[ block ]+1) : 1;
            $__blockptr = $__allblocks.length;
            $__openblocks.unshift( [block, $__blockptr-1] );
            $__startblock = block;
            $__endblock = null;
            return "' +  __||" + block + "||__";  
        },
        
        // end define (overridable) block
        t_endblock = function( ) { 
            if ( 1 < $__openblocks.length ) 
            {
                var block = $__openblocks.shift( );
                $__endblock = block[0];
                $__blockptr = block[1]+1;
                $__startblock = null;
                return "__||/" + block[0] + "||__";
            }  
            return '';  
        },
        
        //
        // auxilliary parsing methods
        //
        split = function( s, leftTplSep, rightTplSep ) {
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
        },
    
        parseControlConstructs = function( match, ctrl, args )  {
            if ( ctrl )
            {
                args = args || '';
            
                switch ( ctrl )
                {
                    case 'isset': 
                        // constructs in args, eg. isset
                        args = args.replace( $__regExps['controls2'], parseControlConstructs );
                        return t_isset( args );  
                        break;
                    
                    case 'set': 
                        // constructs in args, eg. isset
                        args = args.replace( $__regExps['controls2'], parseControlConstructs );
                        return t_set( args );  
                        break;
                    
                    case 'unset': 
                        // constructs in args, eg. isset
                        args = args.replace( $__regExps['controls2'], parseControlConstructs );
                        return t_unset( args );  
                        break;
                    
                    case 'if': 
                        // constructs in args, eg. isset
                        args = args.replace( $__regExps['controls2'], parseControlConstructs );
                        return t_if( args );  
                        break;
                    
                    case 'elseif':  
                        // constructs in args, eg. isset
                        args = args.replace( $__regExps['controls2'], parseControlConstructs );
                        return t_elseif( args );  
                        break;
                    
                    case 'else': 
                        return t_else( args );  
                        break;
                    
                    case 'endif': 
                        return t_endif( args ); 
                        break;
                    
                    case 'for': 
                        // constructs in args, eg. isset
                        args = args.replace( $__regExps['controls2'], parseControlConstructs );
                        return t_for( args ); 
                        break;
                    
                    case 'elsefor': 
                        return t_elsefor( args ); 
                        break;
                    
                    case 'endfor':  
                        return t_endfor( args );  
                        break;
                    
                    case 'extends':  
                        return t_extends( args );  
                        break;
                    
                    case 'block':  
                        return t_block( args );  
                        break;
                    
                    case 'endblock':  
                        return t_endblock( args );  
                        break;
                    
                    case 'template': 
                        // constructs in args, eg. isset
                        args = args.replace( $__regExps['controls2'], parseControlConstructs );
                        return t_template( args );  
                        break;
                    
                    case 'include':  
                        return t_include( args );  
                        break;
                }
            }
            return match;
        },
        
        parseBlocks = function( s ) {
            var blocks = [], bl = $__allblocks.length, 
                block, delims, tag, rep, tl, rl,
                pos1, pos2, off, containerblock
            ;
            
            while ( bl-- )
            {
                delims = $__allblocks[ bl ];
                
                block = delims[ 0 ];
                pos1 = delims[ 1 ];
                pos2 = delims[ 2 ];
                off = delims[ 3 ];
                containerblock = delims[ 4 ];
                tag = "__||" + block + "||__";
                rep = "__i__.renderBlock( '" + block + "' ); ";
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
                            'BLOCKCODE': s.slice( pos1+tl, pos2-tl-1 ) + "';"
                        })]);
                }
                s = s.slice(0, pos1) + rep + s.slice(pos2+1);
                if ( 1 <= $__allblockscnt[ block ] ) $__allblockscnt[ block ]--;
            }
            $__allblocks = null; $__allblockscnt = null; $__openblocks = null;
            
            return [s, blocks];
        },
        
        parseString = function( s, q, i, l ) {
            var string = q, escaped = false, ch = '';
            while ( i < l )
            {
                ch = s[i++];
                string += ch;
                if ( q === ch && !escaped )  break;
                escaped = (!escaped && '\\' === ch);
            }
            return string;
        },
        
        parseVariable = function( s, i, l, pre )  {
            pre = pre || 'VARSTR';
            if ( ALPHA.test(s[i]) )
            {
                var cnt = 0, strings = {}, variables = [], subvariables,
                    variable, property, variable_raw,
                    len, lp, bracketcnt, delim, ch, 
                    strid, sub, space = 0
                ;
                
                // main variable
                variable = s[i++];
                while ( i < l && ALPHANUM.test(s[i]) )
                {
                    variable += s[i++];
                }
                
                variable_raw = variable;
                // transform into tpl variable
                variable = "data['" + variable + "']";
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
                            variable += "['" + property + "']";
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
                        if ( '"' === ch || "'" === ch )
                        {
                            property = parseString( s, ch, i+1, l );
                            cnt++;
                            strid = "__##"+pre+cnt+"##__";
                            strings[ strid ] = property;
                            variable += delim + strid;
                            lp = property.length;
                            i += lp;
                            len += space + 1 + lp;
                            space = 0;
                        }
                        
                        // numeric array property
                        else if ( NUM.test(ch) )
                        {
                            property = s[i++];
                            while ( i < l && NUM.test(s[i]) )
                            {
                                property += s[i++];
                            }
                            variable += delim + property;
                            lp = property.length;
                            len += space + 1 + lp;
                            space = 0;
                        }
                        
                        // sub-variable property
                        else if ( '$' === ch )
                        {
                            sub = s.slice(i+1);
                            subvariables = parseVariable(sub, 0, sub.length, pre + '_' + cnt + '_');
                            if ( subvariables )
                            {
                                // transform into tpl variable property
                                property = subvariables[subvariables.length-1];
                                variable += delim + property[0][0];
                                lp = property[1];
                                i += lp + 1;
                                len += space + 2 + lp;
                                space = 0;
                                variables = variables.concat(subvariables);
                            }
                        }
                        
                        // close bracket
                        else if ( ']' === ch )
                        {
                            if ( bracketcnt > 0 )
                            {
                                bracketcnt--;
                                variable += delim + s[i++];
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
                        while ( i < l && SPACE.test(s[i]) )
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
                                variable += s[i++];
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
                
                variables.push( [[variable, variable_raw], len, strings] );
                return variables
            }
            return null;
        },
        
        funcReplace = function( m, func, plugin ) {
            // allow custom plugins as template functions
            if ( plugin && $__plugins[ plugin ] )
                return 'Contemplate.plugin_' + plugin;
            return 'Contemplate.' + func; 
        },
            
        parse = function( tpl, withblocks ) {
            var parts, len, parsed, s, i, isTag,
                tag, strings, variables, id,
                countl, index, ch, out, cnt, tok, v, tokv
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
                    tag = "\t" + s.replace( $__regExps['specials'], " " ) + "\v"; // replace special chars
                    
                    // parse each template tag section accurately
                    // refined parsing
                    
                    countl = tag.length;
                    variables = {};
                    strings = {};
                    index = 0; 
                    ch = ''; 
                    out = ''; 
                    cnt = 0;
                    
                    while ( index < countl )
                    {
                        ch = tag[ index++ ];
                        
                        // parse mainly literal strings and variables
                        
                        // literal string
                        if ( '"' === ch || "'" === ch )
                        {
                            tok = parseString( tag, ch, index, countl );
                            cnt++;
                            id = "__##STR"+cnt+"##__";
                            strings[ id ] = tok;
                            out += id;
                            index += tok.length-1;
                        }
                        // variable
                        else if ( '$' === ch )
                        {
                            tok = parseVariable(tag, index, countl);
                            if ( tok )
                            {
                                for (v=0; v<tok.length; v++)
                                {
                                    tokv = tok[ v ];
                                    cnt++;
                                    id = "__##VAR"+cnt+"##__";
                                    variables[ id ] = tokv[ 0 ];
                                    strings = self.merge( strings, tokv[ 2 ] );
                                }
                                out += id;
                                index += tokv[ 1 ];
                            }
                            else
                            {
                                out += '$';
                            }
                        }
                        // rest, bypass
                        else
                        {
                            out += ch;
                        }
                    }
                    
                    tag = out;
                
                    // fix literal data notation, not needed here
                    //tag = str_replace(array('{', '}', '[', ']', ':'), array('array(', ')','array(', ')', '=>'), tag);
                
                    $__startblock = null;  $__endblock = null; $__blockptr = -1;
                    tag = tag
                            .replace( $__regExps['controls'], parseControlConstructs )
                            
                            .replace( $__regExps['functions'], funcReplace )
                            
                            .replace( $__regExps['replacements'], "' + ( $1 ) + '" )
                        ;
                    
                    for (id in variables)  
                    {
                        tag = tag.split( id+'__RAW__' ).join( variables[id][1] );
                        tag = tag.split( id ).join( variables[id][0] );
                    }
                    
                    for (id in strings)  
                        tag = tag.split( id ).join( strings[id] );
                        
                    s = tag
                            .split( "\t" ).join( $__tplStart )
                            
                            .split( "\v" ).join( padLines($__tplEnd) )
                    ;
                    
                    if ( $__startblock )
                    {
                        $__startblock = "__||"+$__startblock+"||__";
                        $__allblocks[ $__blockptr-1 ][ 1 ] = parsed.length + tag.indexOf( $__startblock );
                    }
                    else if ( $__endblock )
                    {
                        $__endblock = "__||/"+$__endblock+"||__";
                        $__allblocks[ $__blockptr-1 ][ 2 ] = parsed.length + tag.indexOf( $__endblock ) + $__endblock.length;
                    }
                    
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
        
            if ( false !== withblocks ) return parseBlocks( parsed ); // render any blocks
            
            return parsed;
        },
        
        getCachedTemplateName = function( id ) { 
            return $__cacheDir + id.replace(UNDERLN, '_') + '_tpl.js'; 
        },
        
        getCachedTemplateClass = function( id ) { 
            return 'Contemplate_' + id.replace(UNDERLN, '_') + '_Cached'; 
        },
        
        createTemplateRenderFunction = function( id, seps ) {
            
            resetState();
            
            var blocks = parse( getSeparators( getTemplateContents( id ), seps ) ), funcs = {}, b, bl, func, renderf;
            
            renderf = blocks[0];
            blocks = blocks[1];
            bl = blocks.length;
            
            if ($__extends)
            {
                func = TT_FUNC( null, 1 );
            }
            else
            {
                // Introduce the data as local variables using with(){}
               // Convert the template into pure JavaScript
                func = TT_FUNC({
                            'FCODE': "__p__ += '" + renderf + "';"
                        }, 2);
            }
            
            // defined blocks
            for (b=0; b<bl; b++) funcs[blocks[b][0]] = new Func("Contemplate,__i__", blocks[b][1]);
            
            return [new Func("Contemplate,__i__", func), funcs];
        },
        
        createCachedTemplate = function( id, filename, classname, seps ) {
            
            resetState();
            
            var  
                funcs = {}, prefixCode, extendCode, renderCode, b, bl, sblocks,
                blocks = parse( getSeparators( getTemplateContents( id ), seps ) ), renderf
            ;
            
            renderf = blocks[0];
            blocks = blocks[1];
            bl = blocks.length;
            
            // tpl-defined blocks
            sblocks = [];
            for (b=0; b<bl; b++) 
            {
                sblocks.push( $__TEOL + TT_BlockCode({
                                    'BLOCKNAME': blocks[b][0],
                                    'BLOCKMETHODNAME': blocks[b][0],
                                    'BLOCKMETHODCODE': padLines(blocks[b][1], 1)
                                }) );
            }
            if ( sblocks.length )
            {
                sblocks = $__TEOL + 
                            "_blocks = { " + 
                            $__TEOL + 
                            padLines( sblocks.join(',' + $__TEOL), 1 ) + 
                            $__TEOL + 
                            "};" +
                            $__TEOL;
            }
            else
            {
                sblocks = '';
            }
            
            // tpl render code
            if ($__extends) 
            {
                extendCode = "this.extend( '" + $__extends + "' );";
                renderCode = TT_RCODE( null, 1 );
            }
            else
            {
                extendCode = '';
                renderCode = TT_RCODE({
                                'RCODE': "__p__ += '" + renderf + "';"
                            }, 2);
            }
            
            if ( $__tplPrefixCode )  prefixCode = $__tplPrefixCode;
            else prefixCode = '';
            
          // generate tpl class
            var classCode = TT_ClassCode({
                                'CLASSNAME': classname,
                                'TPLID': id,
                                'PREFIXCODE': prefixCode,
                                'EXTENDCODE': padLines(extendCode, 2),
                                'BLOCKS': padLines(sblocks, 2),
                                'RENDERCODE': padLines(renderCode, 4)
                            });
            
            return setCachedTemplate(filename, classCode);
        },
        
        getCachedTemplate = function( id, options ) {
            
            // inline templates saved only in-memory
            if ( $__inlines[id] )
            {
                // dynamic in-memory caching during page-request
                var funcs, tpl;
                if ( options.parsed )
                {
                    // already parsed code was given
                    tpl = getContemplateInstance( self, id, new Func("Contemplate,__i__", options.parsed) );
                }
                else
                {
                    // parse code and create template class
                    funcs = createTemplateRenderFunction( id, options.separators ); 
                    tpl = getContemplateInstance( self, id, funcs[ 0 ] ).setBlocks( funcs[ 1 ] );
                }
                if ($__extends) tpl.extend( self.tpl($__extends) );
                return tpl;
            }
            
            else
            {
                if ( !isNode ) $__cacheMode = self.CACHE_TO_DISK_NONE;
                
                if ( true !== options.autoUpdate && self.CACHE_TO_DISK_NOUPDATE === $__cacheMode )
                {
                    var cachedTplFile = getCachedTemplateName(id), 
                        cachedTplClass = getCachedTemplateClass(id);
                    if ( !fexists(cachedTplFile) )
                    {
                        createCachedTemplate(id, cachedTplFile, cachedTplClass, options.separators);
                    }
                    if ( fexists(cachedTplFile) )
                    {
                        var tplclass = require( cachedTplFile )( self ), 
                            tpl = new tplclass( ).setId( id );
                        return tpl;
                    }
                    return null;
                }
                
                else if ( true === options.autoUpdate || self.CACHE_TO_DISK_AUTOUPDATE === $__cacheMode )
                {    
                    var cachedTplFile = getCachedTemplateName(id), 
                        cachedTplClass = getCachedTemplateClass(id);
                    if ( !fexists(cachedTplFile) )
                    {
                        // if tpl not exist create it
                        createCachedTemplate(id, cachedTplFile, cachedTplClass, options.separators);
                    }
                    else
                    {
                        var stat = fstat(cachedTplFile), stat2 = fstat($__templates[id]);
                        if ( stat.mtime.getTime() <= stat2.mtime.getTime() )
                        {
                            // is out-of-sync re-create it
                            createCachedTemplate(id, cachedTplFile, cachedTplClass, options.separators);
                        }
                    }
                    if ( fexists(cachedTplFile) )
                    {
                        var tplclass = require( cachedTplFile )( self ), 
                            tpl = new tplclass( ).setId( id );
                        return tpl;
                    }
                    return null;
                }
                        
                else
                {    
                    // dynamic in-memory caching during page-request
                    var funcs = createTemplateRenderFunction( id, options.separators ), 
                        tpl = getContemplateInstance( self, id, funcs[ 0 ] ).setBlocks( funcs[1] );
                    if ($__extends) tpl.extend( self.tpl($__extends) );
                    return tpl;
                }
            }
            return null;
        },
        
        setCachedTemplate = function( filename, tplContents, asyncCB ) { 
            if ( asyncCB )
            {
                fwriteAsync(filename, tplContents, { encoding: self.ENCODING }, function(err) {
                    asyncCB( !err );
                });
                return;
            }
            return fwrite(filename, tplContents, { encoding: self.ENCODING }); 
        },
        
        // generated cached tpl class code as a "heredoc" template (for Node cached templates)
        TT_ClassCode = function( r, t ) {
            var j = joinLines;
            return [
                r['PREFIXCODE']
                ,j(""
                ,"!function (root, moduleName, moduleDefinition) {"
                ,""
                ,"    //"
                ,"    // export the module"
                ,""    
                ,"    // node, CommonJS, etc.."
                ,"    if ( 'object' === typeof(module) && module.exports ) module.exports = moduleDefinition();"
                ,""    
                ,"    // AMD, etc.."
                ,"    else if ( 'function' === typeof(define) && define.amd ) define( moduleDefinition );"
                ,""    
                ,"    // browser, etc.."
                ,"    else root[ moduleName ] = moduleDefinition();"
                ,""
                ,""
                ,"}(this, '"), r['CLASSNAME'], j("', function( ) {"
                ,"    \"use strict\";"
                ,"    return function( Contemplate ) {"
                ,"    /* Contemplate cached template '"), r['TPLID'], j("' */"
                ,"    /* quasi extends main Contemplate class */"
                ,"    "
                ,"    var Contemplate_tpl = Contemplate.tpl;"
                ,"    "
                ,"    /* constructor */"
                ,"    function "), r['CLASSNAME'], j("(id)"
                ,"    {"
                ,"        /* initialize internal vars */"
                ,"        var _extends = null, _blocks = null;"
                ,"        "
                ,"        this.id = id;"
                ,"        this.d = null;"
                ,"        "
                ,"        "
                ,"        /* tpl-defined blocks render code starts here */"
                ,""), r['BLOCKS'], j(""
                ,"        /* tpl-defined blocks render code ends here */"
                ,"        "
                ,"        /* template methods */"
                ,"        "
                ,"        this.setId = function(id) {"
                ,"            if ( id ) this.id = id;"
                ,"            return this;"
                ,"        };"
                ,"        "
                ,"        this.extend = function(tpl) {"
                ,"            if ( tpl && tpl.substr )"
                ,"                _extends = Contemplate_tpl( tpl );"
                ,"            else"
                ,"                _extends = tpl;"
                ,"            return this;"
                ,"        };"
                ,"        "
                ,"        /* render a tpl block method */"
                ,"        this.renderBlock = function(block, __i__) {"
                ,"            if ( !__i__ ) __i__ = this;"
                ,"            if ( _blocks && _blocks[block] ) return _blocks[block](__i__);"
                ,"            else if ( _extends ) return _extends.renderBlock(block, __i__);"
                ,"            return '';"
                ,"        };"
                ,"        "
                ,"        /* tpl render method */"
                ,"        this.render = function(data, __i__) {"
                ,"            if ( !__i__ ) __i__ = this;"
                ,"            var __p__ = '';"
                ,"            if ( _extends )"
                ,"            {"
                ,"                __p__ = _extends.render(data, __i__);"
                ,"            }"
                ,"            else"
                ,"            {"
                ,"                /* tpl main render code starts here */"
                ,""), r['RENDERCODE'], j(""
                ,"                /* tpl main render code ends here */"
                ,"            }"
                ,"            this.d = null;"
                ,"            return __p__;"
                ,"        };"
                ,"        "
                ,"        /* extend tpl assign code starts here */"
                ,""), r['EXTENDCODE'], j(""
                ,"        /* extend tpl assign code ends here */"
                ,"    };"
                ,"    "
                ,"    "
                ,"    // export it"
                ,"    return "), r['CLASSNAME'], j(";"
                ,"    };"
                ,"});"
                ,"")
            ].join( "" );
        },   
    
        // generated cached tpl block method code as a "heredoc" template (for Node cached templates)
        TT_BlockCode = function( r, t ) { 
            var j = joinLines;
            return [
                j(""
                ,"/* tpl block render method for block '"), r['BLOCKNAME'], j("' */"
                ,"'"), r['BLOCKMETHODNAME'], j("': function(__i__) {"
                ,""), r['BLOCKMETHODCODE'], j(""
                ,"}"
                ,"")
            ].join( "" );
        },

        TT_BLOCK = function( r, t ) {
            var j = joinLines;
            return [
                j(""
                ,"var __p__ = '', data = __i__.d;"
                ,""), r['BLOCKCODE'], j(""
                ,"return __p__;"
                ,"")
            ].join( "" );
        },

        TT_IF = function( r, t ) {
            var j = joinLines;
            return [
                j(""
                ,"if ("), r['IFCOND'], j(")"
                ,"{"
                ,"")
            ].join( "" );
        },
    
        TT_ELSEIF = function( r, t ) {
            var j = joinLines;
            return [
                j(""
                ,"}"
                ,"else if ("), r['ELIFCOND'], j(")"
                ,"{"
                ,"")
            ].join( "" );
        },
    
        TT_ELSE = function( r, t ) {
            var j = joinLines;
            return j(""
                ,"}"
                ,"else"
                ,"{"
                ,"");
        },
    
        TT_ENDIF = function( r, t ) {
            var j = joinLines;
            return j(""
                ,"}"
                ,"");
        },
    
        TT_FOR = function( r, t ) {
            var j = joinLines;
            if ( 2 === t )
            {
                return [
                    j(""
                    ,"var "), r['_O'], " = ", r['O'], ", ", r['_OK'], " = Contemplate.keys(", r['_O'], j(");"
                    ,"if ("), r['_OK'], " && ", r['_OK'], j(".length)"
                    ,"{"
                    ,"    var "), r['_K'], ", ", r['_V'], ", ", r['_L'], " = ", r['_OK'], ".length", j(";"
                    ,"    for ("), r['_K'], "=0; ", r['_K'], "<", r['_L'], "; ", r['_K'], j("++)"
                    ,"    {"
                    ,"        "), r['ASSIGN1'], j(""
                    ,"        "
                    ,"")
                ].join( "" );
            }
            else
            {
                return [
                    j(""
                    ,"var "), r['_O'], " = Contemplate.values(", r['O'], j(");"
                    ,"if ("), r['_O'], " && ", r['_O'], j(".length)"
                    ,"{"
                    ,"    var "), r['_K'], ", ", r['_V'], ", ", r['_L'], " = ", r['_O'], ".length", j(";"
                    ,"    for ("), r['_K'], "=0; ", r['_K'], "<", r['_L'], "; ", r['_K'], j("++)"
                    ,"    {"
                    ,"        "), r['ASSIGN1'], j(""
                    ,"        "
                    ,"")
                ].join( "" );
            }
        },
    
        TT_ELSEFOR = function( r, t ) {
            var j = joinLines;
            if ( 2 === t )
            {
                return j(""
                    ,"    }"
                    ,"}"
                    ,"else"
                    ,"{  "
                    ,"");
            }
            else
            {
                return j(""
                    ,"    }"
                    ,"}"
                    ,"else"
                    ,"{  "
                    ,"");
            }
        },
    
        TT_ENDFOR = function( r, t ){
            var j = joinLines;
            if ( 3 === t )
            {
                return j(""
                    ,"    }"
                    ,"}"
                    ,"");
            }
            else if ( 2 === t )
            {
                return j(""
                    ,"    }"
                    ,"}"
                    ,"");
            }
            else
            {
                return j(""
                    ,"}"
                    ,"");
            }
        },
    
        TT_FUNC = function( r, t ) { 
            var j = joinLines;
            if ( 1 === t )
            {
                return "return '';"; 
            }
            else
            {
                return [
                    j(""
                    ,"var __p__ = '', data = __i__.d;"
                    ,""), r['FCODE'], j(""
                    ,"return __p__;"
                    ,"")
                ].join( "" );
            }
        },
        
        TT_RCODE = function( r, t ) { 
            var j = joinLines;
            if ( 1 === t )
            {
                return "__p__ = '';"; 
            }
            else
            {
                return [
                    j(""
                    ,"__i__.d = data;"
                    ,""), r['RCODE'], j(""
                    ,"")
                ].join( "" );
            }
        }
    ;
    
    
    /*
    *  Template Engine
    *
    */
    
    var getContemplateInstance = function( Contemplate, id, renderFunc ) {
        //
        //  Instance template method(s) (for in-memory only templates)
        //
        var Contemplate_tpl = Contemplate.tpl,
            Contemplate_merge = Contemplate.merge
        ;
        var ContemplateInstance = function( id, renderFunc ) {
            // private vars
            var _renderFunction = null, _extends = null, _blocks = null;
            
            this.id = null;  
            this.d = null;
            
            if ( id ) 
            { 
                this.id = id; 
                _renderFunction = renderFunc; 
            }
            
            // public methods
            this.setId = function(id) { 
                if ( id ) this.id = id;  
                return this; 
            };
            
            this.extend = function( tpl ) { 
                if ( tpl && tpl.substr )
                    _extends = Contemplate_tpl( tpl );
                else
                    _extends = tpl;
                return this;
            };
            
            this.setRenderFunction = function( renderfunc ) { 
                _renderFunction = renderfunc; 
                return this; 
            };
            
            this.setBlocks = function( blocks ) { 
                if ( !_blocks ) _blocks = {}; 
                _blocks = Contemplate_merge(_blocks, blocks); 
                return this; 
            };
            
            this.renderBlock = function( block, __i__ ) {
                if ( !__i__ ) __i__ = this;
                
                if ( _blocks && _blocks[block] ) return _blocks[block](Contemplate, __i__);
                else if ( _extends ) return _extends.renderBlock(block, __i__);
                
                return '';
            };
            
            this.render = function( data, __i__ ) {
                var __p__ = '';
                
                if ( !__i__ ) __i__ = this;
                
                if ( _extends ) 
                {
                    __p__ = _extends.render(data, __i__);
                }
                else if ( _renderFunction )  
                {
                    __i__.d = data; 
                    __p__ = _renderFunction(Contemplate, __i__);
                }
                
                this.d = null;
                return __p__;
            };
        };
        return new ContemplateInstance( id, renderFunc );
    }
    
    self = {

        // constants
        VERSION: __version__,
        
        CACHE_TO_DISK_NONE: 0,
        CACHE_TO_DISK_AUTOUPDATE: 2,
        CACHE_TO_DISK_NOUPDATE: 4,
        
        ENCODING: 'utf8',
        
        init: function( ) {
            if ( $__isInited ) return;
            
            $__stack = [ ];
            
            // pre-compute the needed regular expressions
            $__regExps['specials'] = new RegExp('[\\n\\r\\v\\t]', 'g');
            
            $__regExps['replacements'] = new RegExp('\\t[ ]*(.*?)[ ]*\\v', 'g');
            
            $__regExps['controls'] = new RegExp('\\t[ ]*%('+$__controlConstructs.join('|')+')\\b[ ]*\\((.*)\\)', 'g');
            $__regExps['controls2'] = new RegExp('%('+$__controlConstructs.join('|')+')\\b[ ]*\\((.*)\\)', 'g');
            
            $__regExps['functions'] = new RegExp('%('+$__funcs.join('|')+')\\b', 'g');
            
            $__preserveLines = $__preserveLinesDefault;
            
            $__tplStart = "'; " + $__TEOL;
            $__tplEnd = $__TEOL + "__p__ += '";
            
            $__isInited = true;
        },
        
        //
        // Main methods
        //
        
        // add custom plugins as template functions
        addPlugin: function( name, handler ) {
            if ( name && handler )
            {
                $__plugins[ name ] = true;
                self[ "plugin_" + name ] = handler;
            }
        },
    
        setPrefixCode: function( preCode ) {
            if ( preCode ) $__tplPrefixCode = '' + preCode;
        },
    
        setLocaleStrings: function( l ) { 
            $__locale = self.merge($__locale, l); 
        },
        
        clearLocaleStrings: function( ) { 
            $__locale = { }; 
        },
        
        setPlurals: function( plurals ) { 
            if ( plurals )
            {
                for (var singular in plurals)
                {
                    if ( null == plurals[ singular ] )
                    {
                        // auto plural
                        plurals[ singular ] = singular+'s';
                    }
                }
                $__plurals = self.merge($__plurals, plurals); 
            }
        },
        
        clearPlurals: function( ) { 
            $__plurals = { }; 
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
        
        setCacheDir: function( dir ) { 
            $__cacheDir = rtrim(dir, '/') + '/';  
        },
        
        setCacheMode: function( mode ) { 
            $__cacheMode = ( isNode ) ? mode : self.CACHE_TO_DISK_NONE; 
        },
        
        setSyncMode: function( bool ) { 
            $__async = !bool; 
        },
        
        clearCache: function( all ) { 
            $__cache = { }; 
            if ( all ) $__partials = { }; 
        },
        
        // add templates manually
        add: function( tpls, tplStr ) { 
            if ( "object" === typeof(tpls) )
            {
                for (var tplID in tpls)
                {
                    if ( isArray( tpls[ tplID ] ) )
                    {
                        // unified way to add tpls both as reference and inline
                        // inline tpl, passed as array
                        if ( tpls[ tplID ][ 0 ] )
                            $__inlines[ tplID ] = tpls[ tplID ][ 0 ];
                        delete tpls[ tplID ];
                    }
                }
                $__templates = self.merge($__templates, tpls);  
            }
            else if ( tpls && tplStr )
            {
                $__templates[ tpls ] = tplStr; 
            }
        },
    
        // add inline templates manually
        addInline: function( tpls, tplStr ) { 
            if ( "object" === typeof(tpls) )
            {
                $__inlines = self.merge($__inlines, tpls);
            }
            else if ( tpls && tplStr )
            {
                $__inlines[ tpls ] = tplStr; 
            }
        },
        
        parseTpl: function( tpl, options ) {
            var tmp, parsed, separators = options && options.separators ? options.separators : null;
            
            if ( separators )
            {
                tmp = [$__leftTplSep, $__rightTplSep];
                $__leftTplSep = separators[ 0 ];  $__rightTplSep = separators[ 1 ];
            }
            
            resetState( );
            parsed = parse( tpl );
            
            if ( separators )
            {
                $__leftTplSep = tmp[ 0 ]; $__rightTplSep = tmp[ 1 ];
            }
            
            return parsed;
        },
        
        // return the requested template (with optional data)
        tpl: function( id, data, options ) {
            options = merge({
                'autoUpdate': false,
                'refresh': false,
                'escape': true,
                'separators': null
            }, options);
            
            $__escape = false !== options.escape;
            
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.
            if ( !!options.refresh || !$__cache[ id ] )
            {
                $__cache[ id ] = getCachedTemplate( id, options );
            }
            
            var tpl = $__cache[ id ];
            
            // Provide some basic currying to the user
            if ( data && "object" === typeof(data) ) return tpl.render( data );
            else  return tpl;
        },
        
        
        //
        // Basic template functions
        //
        
        // basic html escaping
        html: function( s ) { 
            return htmlentities(s, 'ENT_COMPAT', 'UTF-8'); 
        },
        
        // basic url escaping
        url: urlencode,
        
        // count items in obj/array
        count: count,
        
        // haskey, has_key, check if (nested) keys exist in tpl variable
        haskey: function( v/*, key1, key2, etc.. */ ) {
            var to_string = _toString( v );
            if (!v || "[object Array]" != to_string && "[object Object]" != to_string) return false;
            var args = slice( arguments ), argslen, i, tmp;
            args.shift( );
            argslen = args.length;
            tmp = v;
            for (i=0; i<argslen; i++)
            {
                if (undef === tmp[args[i]]) return false;
                tmp = tmp[args[i]];
            }
            return true;
        },
        
        // quote
        q: function( e ) { 
            return "'" + e + "'"; 
        },
        
        // double quote
        dq: function( e) { 
            return '"' + e + '"';  
        },
        
        // to String
        s: function( e ) { 
            return Str(e); 
        },
        
        // to Integer
        n: function( e ) { 
            return parse_int(e, 10); 
        },
        
        // to Float
        f: function( e ) { 
            return parse_float(e, 10); 
        },
        
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
            return slice( arguments ).join(''); 
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
        lowercase: function( s ) {
            return s.toLowerCase( );
        },
        uppercase: function( s ) {
            return s.toUpperCase( );
        },
        camelcase: function( s, sep, capitalizeFirst ) {
            sep = sep || "_";
            if ( capitalizeFirst )
                return s.split( sep ).map( self.ucfirst ).join( "" );
            else
                return self.lcfirst( s.split( sep ).map( self.ucfirst ).join( "" ) );
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
        time: time,
        
        // formatted date
        date: function( $format, $time ) { 
            if (!$time) $time = time(); 
            return date($format, $time); 
        },
        
        // localized formatted date
        ldate: function( $format, $time ) { 
            if (!$time) $time = time(); 
            return _localized_date($__locale, $format, $time); 
        },
        
        // locale
        // locale, l
        locale: function( e ) { 
            return (_hasOwn($__locale, e)) ? $__locale[e] : e; 
        },
        // pluralise
        pluralise: function( singular, count ) {
            if ($__plurals[singular])
                return 1 !== count ? $__plurals[singular] : singular;
            return singular;
        },
        
        // generate a uuid
        uuid: function( namespace ) {
            return [namespace||'UUID', ++$__uuid, time()].join('_');
        },
        
        //
        //  HTML elements
        //
        
        // html table
        htmltable: function( $data, $options ) {
            // clone data to avoid mess-ups
            $data = self.merge({}, $data);
            $options = self.merge({}, $options || {});
            var $o='', $tk='', $header='', $footer='', $k, $rows=[], $i, $j, $l, $vals, $col, $colvals, $class_odd, $class_even, $odd=false;
            
            $o="<table";
            
            if ($options['id'])
            $o+=" id='"+$options['id']+"'";
            if ($options['class'])
            $o+=" class='"+$options['class']+"'";
            if ($options['style'])
            $o+=" style='"+$options['style']+"'";
            if ($options['data'])
            {
                for ($k in $options['data'])
                {
                    if (self.hasOwn($options['data'], $k))
                        $o+=" data-"+$k+"='"+$options['data'][$k]+"'";
                }
            }
            $o+=">";
                
            $tk='';
            if (
                $options['header'] || 
                $options['footer']
            )
                $tk="<td>"+(self.keys($data)||[]).join('</td><td>')+"</td>";
                
            $header='';
            if ($options['header'])
                $header="<thead><tr>"+$tk+"</tr></thead>";
                
            $footer='';
            if ($options['footer'])
                $footer="<tfoot><tr>"+$tk+"</tr></tfoot>";
            
            $o+=$header;
            
            // get data rows
            $rows=[];
            $vals=self.values($data) || [];
            for ($i in $vals)
            {
                if (self.hasOwn($vals, $i))
                {
                    $col=$vals[$i];
                    if (!is_array($col))  $col=[$col];
                    $colvals=self.values($col) || [];
                    for ($j=0, $l=$colvals.length; $j<$l; $j++)
                    {
                        if (!$rows[$j]) $rows[$j]=new Arr($l);
                        $rows[$j][$i]=$colvals[$j];
                    }
                }
            }
            
            if ($options['odd'])
                $class_odd=$options['odd'];
            else
                $class_odd='odd';
            if ($options['even'])
                $class_even=$options['even'];
            else
                $class_even='even';
                
            // render rows
            $odd=false;
            for ($i=0, $l=$rows.length; $i<$l; $i++)
            {
                if ($odd)
                    $o+="<tr class='"+$class_odd+"'><td>"+$rows[$i].join('</td><td>')+"</td></tr>";
                else
                    $o+="<tr class='"+$class_even+"'><td>"+$rows[$i].join('</td><td>')+"</td></tr>";
                
                $odd=!$odd;
            }
            $rows=null;
            // strict mode error, top level indentifier
            //delete $rows;
            
            $o+=$footer;
            $o+="</table>";
            return $o;
        },
        
        // html select
        htmlselect: function( $data, $options ) {
            // clone data to avoid mess-ups
            $data = self.merge({}, $data);
            $options = self.merge({}, $options || {});
            var $o='', $k, $k2, $v, $v2;
            
            $o="<select";
            
            if ($options['multiple'])
            $o+=" multiple";
            if ($options['disabled'])
            $o+=" disabled='disabled'";
            if ($options['name'])
            $o+=" name='"+$options['name']+"'";
            if ($options['id'])
            $o+=" id='"+$options['id']+"'";
            if ($options['class'])
            $o+=" class='"+$options['class']+"'";
            if ($options['style'])
            $o+=" style='"+$options['style']+"'";
            if ($options['data'])
            {
                for ($k in $options['data'])
                {
                    if (self.hasOwn($options['data'], $k))
                        $o+=" data-"+$k+"='"+$options['data'][$k]+"'";
                }
            }
            $o+=">";
            
            if ($options['selected'])
            {
                if (!is_array($options['selected'])) $options['selected']=[$options['selected']];
                $options['selected']=array_flip($options['selected']);
            }
            else
                $options['selected']={};
                
            if ($options['optgroups'])
            {
                if (!is_array($options['optgroups'])) $options['optgroups']=[$options['optgroups']];
                $options['optgroups']=array_flip($options['optgroups']);
            }
        
            for ($k in $data)
            {
                if (self.hasOwn($data, $k))
                {
                    $v=$data[$k];
                    if ($options['optgroups'] && $options['optgroups'][$k])
                    {
                        $o+="<optgroup label='"+$k+"'>";
                        for  ($k2 in $v)
                        {
                            if (self.hasOwn($v, $k2))
                            {
                                $v2=$v[$k2];
                                if ($options['use_key'])
                                    $v2=$k2;
                                else if ($options['use_value'])
                                    $k2=$v2;
                                    
                                if (/*$options['selected'][$k2]*/ self.hasOwn($options['selected'], $k2))
                                    $o+="<option value='"+$k2+"' selected='selected'>"+$v2+"</option>";
                                else
                                    $o+="<option value='"+$k2+"'>"+$v2+"</option>";
                            }
                        }
                        $o+="</optgroup>";
                    }
                    else
                    {
                        if ($options['use_key'])
                            $v=$k;
                        else if ($options['use_value'])
                            $k=$v;
                            
                        if ($options['selected'][$k])
                            $o+="<option value='"+$k+"' selected='selected'>"+$v+"</option>";
                        else
                            $o+="<option value='"+$k+"'>"+$v+"</option>";
                    }
                }
            }
            $o+="</select>";
            return $o;
        },
        
        getTemplateContents: getTemplateContents,
        
        hasOwn: function( o, p ) { 
            return o && _hasOwn(o, p); 
        },
        
        keys: function( o ) {
            return o ? Keys( o ) : null;
        },
        
        values: function( o ) { 
            if ( o )
            {
                if ( o instanceof Arr ) 
                {
                    return o;
                }
                else
                {
                    var a = [], k;
                    for (k in o) 
                    {
                        if ( _hasOwn(o, k) ) a.push( o[k] );
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
            if (isArray(o)) return o.slice();
            var c = {} /*self.merge({}, o)*/, key, newkey;
            // clone the data and
            // use php-style variables using '$' in front of var name
            for (key in o) 
            { 
                if (_hasOwn(o, key)) 
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
    // aliases
    self.now = self.time;
    self.l = self.locale;
    
    // Template Engine end here
    //
    //



/////////////////////////////////////////////////////////////////////////
//
//   PHP functions adapted from phpjs project
//   https://github.com/kvz/phpjs
//
///////////////////////////////////////////////////////////////////////////

function get_html_translation_table (table, quote_style) {
  var entities = {},
    hash_map = {},
    decimal;
  var constMappingTable = {},
    constMappingQuoteStyle = {};
  var useTable = {},
    useQuoteStyle = {};

  // Translate arguments
  constMappingTable[0] = 'HTML_SPECIALCHARS';
  constMappingTable[1] = 'HTML_ENTITIES';
  constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
  constMappingQuoteStyle[2] = 'ENT_COMPAT';
  constMappingQuoteStyle[3] = 'ENT_QUOTES';

  useTable = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
  useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT';

  if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
    throw new Error("Table: " + useTable + ' not supported');
    // return false;
  }

  entities['38'] = '&amp;';
  if (useTable === 'HTML_ENTITIES') {
    entities['160'] = '&nbsp;';
    entities['161'] = '&iexcl;';
    entities['162'] = '&cent;';
    entities['163'] = '&pound;';
    entities['164'] = '&curren;';
    entities['165'] = '&yen;';
    entities['166'] = '&brvbar;';
    entities['167'] = '&sect;';
    entities['168'] = '&uml;';
    entities['169'] = '&copy;';
    entities['170'] = '&ordf;';
    entities['171'] = '&laquo;';
    entities['172'] = '&not;';
    entities['173'] = '&shy;';
    entities['174'] = '&reg;';
    entities['175'] = '&macr;';
    entities['176'] = '&deg;';
    entities['177'] = '&plusmn;';
    entities['178'] = '&sup2;';
    entities['179'] = '&sup3;';
    entities['180'] = '&acute;';
    entities['181'] = '&micro;';
    entities['182'] = '&para;';
    entities['183'] = '&middot;';
    entities['184'] = '&cedil;';
    entities['185'] = '&sup1;';
    entities['186'] = '&ordm;';
    entities['187'] = '&raquo;';
    entities['188'] = '&frac14;';
    entities['189'] = '&frac12;';
    entities['190'] = '&frac34;';
    entities['191'] = '&iquest;';
    entities['192'] = '&Agrave;';
    entities['193'] = '&Aacute;';
    entities['194'] = '&Acirc;';
    entities['195'] = '&Atilde;';
    entities['196'] = '&Auml;';
    entities['197'] = '&Aring;';
    entities['198'] = '&AElig;';
    entities['199'] = '&Ccedil;';
    entities['200'] = '&Egrave;';
    entities['201'] = '&Eacute;';
    entities['202'] = '&Ecirc;';
    entities['203'] = '&Euml;';
    entities['204'] = '&Igrave;';
    entities['205'] = '&Iacute;';
    entities['206'] = '&Icirc;';
    entities['207'] = '&Iuml;';
    entities['208'] = '&ETH;';
    entities['209'] = '&Ntilde;';
    entities['210'] = '&Ograve;';
    entities['211'] = '&Oacute;';
    entities['212'] = '&Ocirc;';
    entities['213'] = '&Otilde;';
    entities['214'] = '&Ouml;';
    entities['215'] = '&times;';
    entities['216'] = '&Oslash;';
    entities['217'] = '&Ugrave;';
    entities['218'] = '&Uacute;';
    entities['219'] = '&Ucirc;';
    entities['220'] = '&Uuml;';
    entities['221'] = '&Yacute;';
    entities['222'] = '&THORN;';
    entities['223'] = '&szlig;';
    entities['224'] = '&agrave;';
    entities['225'] = '&aacute;';
    entities['226'] = '&acirc;';
    entities['227'] = '&atilde;';
    entities['228'] = '&auml;';
    entities['229'] = '&aring;';
    entities['230'] = '&aelig;';
    entities['231'] = '&ccedil;';
    entities['232'] = '&egrave;';
    entities['233'] = '&eacute;';
    entities['234'] = '&ecirc;';
    entities['235'] = '&euml;';
    entities['236'] = '&igrave;';
    entities['237'] = '&iacute;';
    entities['238'] = '&icirc;';
    entities['239'] = '&iuml;';
    entities['240'] = '&eth;';
    entities['241'] = '&ntilde;';
    entities['242'] = '&ograve;';
    entities['243'] = '&oacute;';
    entities['244'] = '&ocirc;';
    entities['245'] = '&otilde;';
    entities['246'] = '&ouml;';
    entities['247'] = '&divide;';
    entities['248'] = '&oslash;';
    entities['249'] = '&ugrave;';
    entities['250'] = '&uacute;';
    entities['251'] = '&ucirc;';
    entities['252'] = '&uuml;';
    entities['253'] = '&yacute;';
    entities['254'] = '&thorn;';
    entities['255'] = '&yuml;';
  }

  if (useQuoteStyle !== 'ENT_NOQUOTES') {
    entities['34'] = '&quot;';
  }
  if (useQuoteStyle === 'ENT_QUOTES') {
    entities['39'] = '&#39;';
  }
  entities['60'] = '&lt;';
  entities['62'] = '&gt;';


  // ascii decimals to real symbols
  for (decimal in entities) {
    if (entities.hasOwnProperty(decimal)) {
      hash_map[String.fromCharCode(decimal)] = entities[decimal];
    }
  }

  return hash_map;
}
function htmlentities (string, quote_style, charset, double_encode) {
  var hash_map = get_html_translation_table('HTML_ENTITIES', quote_style),
    symbol = '';
  string = string == null ? '' : string + '';

  if (!hash_map) {
    return false;
  }

  if (quote_style && quote_style === 'ENT_QUOTES') {
    hash_map["'"] = '&#039;';
  }

  if (!!double_encode || double_encode == null) {
    for (symbol in hash_map) {
      if (hash_map.hasOwnProperty(symbol)) {
        string = string.split(symbol).join(hash_map[symbol]);
      }
    }
  } else {
    string = string.replace(/([\s\S]*?)(&(?:#\d+|#x[\da-f]+|[a-zA-Z][\da-z]*);|$)/g, function (ignore, text, entity) {
      for (symbol in hash_map) {
        if (hash_map.hasOwnProperty(symbol)) {
          text = text.split(symbol).join(hash_map[symbol]);
        }
      }

      return text + entity;
    });
  }

  return string;
}
function urlencode (str) {
  str = (str + '').toString();

  // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
  // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
  return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
  replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}
function rawurlencode (str) {
  str = (str + '').toString();

  // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
  // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
  return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
  replace(/\)/g, '%29').replace(/\*/g, '%2A');
}
function count (mixed_var, mode) {
  var key, cnt = 0;

  if (mixed_var === null || typeof mixed_var === 'undefined') {
    return 0;
  } else if (mixed_var.constructor !== Array && mixed_var.constructor !== Object) {
    return 1;
  }

  if (mode === 'COUNT_RECURSIVE') {
    mode = 1;
  }
  if (mode != 1) {
    mode = 0;
  }

  for (key in mixed_var) {
    if (mixed_var.hasOwnProperty(key)) {
      cnt++;
      if (mode == 1 && mixed_var[key] && (mixed_var[key].constructor === Array || mixed_var[key].constructor === Object)) {
        cnt += count(mixed_var[key], 1);
      }
    }
  }

  return cnt;
}
function is_array (mixed_var) {
  var ini,
    _getFuncName = function (fn) {
      var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
      if (!name) {
        return '(Anonymous)';
      }
      return name[1];
    },
    _isArray = function (mixed_var) {
      // return Object.prototype.toString.call(mixed_var) === '[object Array]';
      // The above works, but let's do the even more stringent approach: (since Object.prototype.toString could be overridden)
      // Null, Not an object, no length property so couldn't be an Array (or String)
      if (!mixed_var || typeof mixed_var !== 'object' || typeof mixed_var.length !== 'number') {
        return false;
      }
      var len = mixed_var.length;
      mixed_var[mixed_var.length] = 'bogus';
      // The only way I can think of to get around this (or where there would be trouble) would be to have an object defined
      // with a custom "length" getter which changed behavior on each call (or a setter to mess up the following below) or a custom
      // setter for numeric properties, but even that would need to listen for specific indexes; but there should be no false negatives
      // and such a false positive would need to rely on later JavaScript innovations like __defineSetter__
      if (len !== mixed_var.length) { // We know it's an array since length auto-changed with the addition of a
      // numeric property at its length end, so safely get rid of our bogus element
        mixed_var.length -= 1;
        return true;
      }
      // Get rid of the property we added onto a non-array object; only possible
      // side-effect is if the user adds back the property later, it will iterate
      // this property in the older order placement in IE (an order which should not
      // be depended on anyways)
      delete mixed_var[mixed_var.length];
      return false;
    };

  if (!mixed_var || typeof mixed_var !== 'object') {
    return false;
  }

  // BEGIN REDUNDANT
  //this.php_js = this.php_js || {};
  //this.php_js.ini = this.php_js.ini || {};
  // END REDUNDANT

  ini = null; //this.php_js.ini['phpjs.objectsAsArrays'];

  return _isArray(mixed_var) ||
    // Allow returning true unless user has called
    // ini_set('phpjs.objectsAsArrays', 0) to disallow objects as arrays
    ((!ini || ( // if it's not set to 0 and it's not 'off', check for objects as arrays
    (parseInt(ini.local_value, 10) !== 0 && (!ini.local_value.toLowerCase || ini.local_value.toLowerCase() !== 'off')))
    ) && (
    Object.prototype.toString.call(mixed_var) === '[object Object]' && _getFuncName(mixed_var.constructor) === 'Object' // Most likely a literal and intended as assoc. array
    ));
}
function array_flip (trans) {
  var key, tmp_ar = {};

  if (trans && typeof trans=== 'object' && trans.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
    return trans.flip();
  }

  for (key in trans) {
    if (!trans.hasOwnProperty(key)) {continue;}
    tmp_ar[trans[key]] = key;
  }

  return tmp_ar;
}
function sprintf () {
  var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
  var a = arguments,
    i = 0,
    format = a[i++];

  // pad()
  var pad = function (str, len, chr, leftJustify) {
    if (!chr) {
      chr = ' ';
    }
    var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
    return leftJustify ? str + padding : padding + str;
  };

  // justify()
  var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
    var diff = minWidth - value.length;
    if (diff > 0) {
      if (leftJustify || !zeroPad) {
        value = pad(value, minWidth, customPadChar, leftJustify);
      } else {
        value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
      }
    }
    return value;
  };

  // formatBaseX()
  var formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
    // Note: casts negative numbers to positive ones
    var number = value >>> 0;
    prefix = prefix && number && {
      '2': '0b',
      '8': '0',
      '16': '0x'
    }[base] || '';
    value = prefix + pad(number.toString(base), precision || 0, '0', false);
    return justify(value, prefix, leftJustify, minWidth, zeroPad);
  };

  // formatString()
  var formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
    if (precision != null) {
      value = value.slice(0, precision);
    }
    return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
  };

  // doFormat()
  var doFormat = function (substring, valueIndex, flags, minWidth, _, precision, type) {
    var number;
    var prefix;
    var method;
    var textTransform;
    var value;

    if (substring == '%%') {
      return '%';
    }

    // parse flags
    var leftJustify = false,
      positivePrefix = '',
      zeroPad = false,
      prefixBaseX = false,
      customPadChar = ' ';
    var flagsl = flags.length;
    for (var j = 0; flags && j < flagsl; j++) {
      switch (flags.charAt(j)) {
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
    if (!minWidth) {
      minWidth = 0;
    } else if (minWidth == '*') {
      minWidth = +a[i++];
    } else if (minWidth.charAt(0) == '*') {
      minWidth = +a[minWidth.slice(1, -1)];
    } else {
      minWidth = +minWidth;
    }

    // Note: undocumented perl feature:
    if (minWidth < 0) {
      minWidth = -minWidth;
      leftJustify = true;
    }

    if (!isFinite(minWidth)) {
      throw new Error('sprintf: (minimum-)width must be finite');
    }

    if (!precision) {
      precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : undefined;
    } else if (precision == '*') {
      precision = +a[i++];
    } else if (precision.charAt(0) == '*') {
      precision = +a[precision.slice(1, -1)];
    } else {
      precision = +precision;
    }

    // grab value using valueIndex if required?
    value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

    switch (type) {
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
      value = prefix + pad(String(Math.abs(number)), precision, '0', false);
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

  return format.replace(regex, doFormat);
}
function ltrim (str, charlist) {
  charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
  var re = new RegExp('^[' + charlist + ']+', 'g');
  return (str + '').replace(re, '');
}
function rtrim (str, charlist) {
  charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');
  var re = new RegExp('[' + charlist + ']+$', 'g');
  return (str + '').replace(re, '');
}
function trim (str, charlist) {
  var whitespace, l = 0,
    i = 0;
  str += '';

  if (!charlist) {
    // default list
    whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
  } else {
    // preg_quote custom list
    charlist += '';
    whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
  }

  l = str.length;
  for (i = 0; i < l; i++) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(i);
      break;
    }
  }

  l = str.length;
  for (i = l - 1; i >= 0; i--) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(0, i + 1);
      break;
    }
  }

  return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}
function time () {
  return Math.floor(new Date().getTime() / 1000);
}
function date (format, timestamp) {
    var //that = this,
      jsdate,
      f,
      formatChr = /\\?([a-z])/gi,
      formatChrCb,
      // Keep this here (works, but for code commented-out
      // below for file size reasons)
      //, tal= [],
      _pad = function (n, c) {
        n = n.toString();
        return n.length < c ? _pad('0' + n, c, '0') : n;
      },
      txt_words = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  formatChrCb = function (t, s) {
    return f[t] ? f[t]() : s;
  };
  f = {
    // Day
    d: function () { // Day of month w/leading 0; 01..31
      return _pad(f.j(), 2);
    },
    D: function () { // Shorthand day name; Mon...Sun
      return f.l().slice(0, 3);
    },
    j: function () { // Day of month; 1..31
      return jsdate.getDate();
    },
    l: function () { // Full day name; Monday...Sunday
      return txt_words[f.w()] + 'day';
    },
    N: function () { // ISO-8601 day of week; 1[Mon]..7[Sun]
      return f.w() || 7;
    },
    S: function () { // Ordinal suffix for day of month; st, nd, rd, th
      var j = f.j();
      return j < 4 | j > 20 && (['st', 'nd', 'rd'][j % 10 - 1] || 'th');
    },
    w: function () { // Day of week; 0[Sun]..6[Sat]
      return jsdate.getDay();
    },
    z: function () { // Day of year; 0..365
      var a = new Date(f.Y(), f.n() - 1, f.j()),
        b = new Date(f.Y(), 0, 1);
      return Math.round((a - b) / 864e5);
    },

    // Week
    W: function () { // ISO-8601 week number
      var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3),
        b = new Date(a.getFullYear(), 0, 4);
      return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
    },

    // Month
    F: function () { // Full month name; January...December
      return txt_words[6 + f.n()];
    },
    m: function () { // Month w/leading 0; 01...12
      return _pad(f.n(), 2);
    },
    M: function () { // Shorthand month name; Jan...Dec
      return f.F().slice(0, 3);
    },
    n: function () { // Month; 1...12
      return jsdate.getMonth() + 1;
    },
    t: function () { // Days in month; 28...31
      return (new Date(f.Y(), f.n(), 0)).getDate();
    },

    // Year
    L: function () { // Is leap year?; 0 or 1
      var j = f.Y();
      return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
    },
    o: function () { // ISO-8601 year
      var n = f.n(),
        W = f.W(),
        Y = f.Y();
      return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
    },
    Y: function () { // Full year; e.g. 1980...2010
      return jsdate.getFullYear();
    },
    y: function () { // Last two digits of year; 00...99
      return f.Y().toString().slice(-2);
    },

    // Time
    a: function () { // am or pm
      return jsdate.getHours() > 11 ? "pm" : "am";
    },
    A: function () { // AM or PM
      return f.a().toUpperCase();
    },
    B: function () { // Swatch Internet time; 000..999
      var H = jsdate.getUTCHours() * 36e2,
        // Hours
        i = jsdate.getUTCMinutes() * 60,
        // Minutes
        s = jsdate.getUTCSeconds(); // Seconds
      return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
    },
    g: function () { // 12-Hours; 1..12
      return f.G() % 12 || 12;
    },
    G: function () { // 24-Hours; 0..23
      return jsdate.getHours();
    },
    h: function () { // 12-Hours w/leading 0; 01..12
      return _pad(f.g(), 2);
    },
    H: function () { // 24-Hours w/leading 0; 00..23
      return _pad(f.G(), 2);
    },
    i: function () { // Minutes w/leading 0; 00..59
      return _pad(jsdate.getMinutes(), 2);
    },
    s: function () { // Seconds w/leading 0; 00..59
      return _pad(jsdate.getSeconds(), 2);
    },
    u: function () { // Microseconds; 000000-999000
      return _pad(jsdate.getMilliseconds() * 1000, 6);
    },

    // Timezone
    e: function () { // Timezone identifier; e.g. Atlantic/Azores, ...
      // The following works, but requires inclusion of the very large
      // timezone_abbreviations_list() function.
/*              return that.date_default_timezone_get();
*/
      throw 'Not supported (see source code of date() for timezone on how to add support)';
    },
    I: function () { // DST observed?; 0 or 1
      // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
      // If they are not equal, then DST is observed.
      var a = new Date(f.Y(), 0),
        // Jan 1
        c = Date.UTC(f.Y(), 0),
        // Jan 1 UTC
        b = new Date(f.Y(), 6),
        // Jul 1
        d = Date.UTC(f.Y(), 6); // Jul 1 UTC
      return ((a - c) !== (b - d)) ? 1 : 0;
    },
    O: function () { // Difference to GMT in hour format; e.g. +0200
      var tzo = jsdate.getTimezoneOffset(),
        a = Math.abs(tzo);
      return (tzo > 0 ? "-" : "+") + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
    },
    P: function () { // Difference to GMT w/colon; e.g. +02:00
      var O = f.O();
      return (O.substr(0, 3) + ":" + O.substr(3, 2));
    },
    T: function () { // Timezone abbreviation; e.g. EST, MDT, ...
      return 'UTC';
    },
    Z: function () { // Timezone offset in seconds (-43200...50400)
      return -jsdate.getTimezoneOffset() * 60;
    },

    // Full Date/Time
    c: function () { // ISO-8601 date.
      return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
    },
    r: function () { // RFC 2822
      return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
    },
    U: function () { // Seconds since UNIX epoch
      return jsdate / 1000 | 0;
    }
  };
  var date = function (format, timestamp) {
    //that = this;
    jsdate = (timestamp === undefined ? new Date() : // Not provided
      (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
      new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
    );
    return format.replace(formatChr, formatChrCb);
  };
  return date(format, timestamp);
}
function _localized_date($locale, $format, $timestamp) 
{
    var $txt_words = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    var $date = date($format, $timestamp);
    
    // localize days/months
    for (var i=0, l=$txt_words.length; i<l; i++)
    {
        if ($locale[$txt_words[i]]) $date = $date.replace($txt_words[i], $locale[$txt_words[i]]);
    }
    
    // return localized date
    return $date;
}

    
    //
    //
    //
    
    
    
    // init the engine on load
    self.init();
    
    // export it
    // add it to global namespace to be available for sub-templates, same as browser
    //if ( isNode ) global.Contemplate = self;
    return self;
});