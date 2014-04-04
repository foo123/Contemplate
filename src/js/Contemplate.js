/**
*  Contemplate
*  Light-weight Template Engine for PHP, Python, Node and client-side JavaScript
*
*  @version: 0.5.1
*  https://github.com/foo123/Contemplate
*
*  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed
*  http://ejohn.org/blog/javascript-micro-templating/
*
**/
!function (root, moduleName, moduleDefinition) {

    //
    // export the module
    
    // node, CommonJS, etc..
    if ( 'object' == typeof(module) && module.exports ) module.exports = moduleDefinition();
    
    // AMD, etc..
    else if ( 'function' == typeof(define) && define.amd ) define( moduleDefinition );
    
    // browser, etc..
    else root[ moduleName ] = moduleDefinition();


}(this, 'Contemplate', function( undef ) {
    
    //"use strict";
    
    var __version__ = "0.5.1";
    var self;
    
    // auxilliaries
    var OP = Object.prototype, AP = Array.prototype, FP = Function.prototype,
        _toString = FP.call.bind(OP.toString), _hasOwn = FP.call.bind(OP.hasOwnProperty), slice = FP.call.bind(AP.slice),
        _isNode = typeof global !== "undefined" && _toString(global) == '[object global]',
        isArray = function( o ) { return (_toString(o) === '[object Array]') || (o instanceof Array); },
        
        echo = ('undefined'!=typeof(console) && console.log) ? function(s) { console.log(s); } : function() {},
        log = echo,
        
        _fs = (_isNode) ? require('fs') : null, 
        fwrite = (_fs) ? _fs.writeFileSync : null,
        fread =  (_fs) ? _fs.readFileSync : null,
        fexists = (_fs) ? _fs.existsSync : null,
        fstat = (_fs) ? _fs.statSync : null,
        realpath = (_fs) ? _fs.realpathSync : null
    ;

    // IE8- mostly
    if ( !AP.indexOf ) 
    {
        var Abs = Math.abs;
        
        AP.indexOf = function (searchElement , fromIndex) {
            var i,
                pivot = (fromIndex) ? fromIndex : 0,
                length;

            if ( !this ) 
            {
                throw new TypeError();
            }

            length = this.length;

            if (length === 0 || pivot >= length)
            {
                return -1;
            }

            if (pivot < 0) 
            {
                pivot = length - Abs(pivot);
            }

            for (i = pivot; i < length; i++) 
            {
                if (this[i] === searchElement) 
                {
                    return i;
                }
            }
            return -1;
        };
    }
    
    /////////////////////////////////////////////////////////////////////////////////////
    //
    //  Contemplate Engine Main Class
    //
    //////////////////////////////////////////////////////////////////////////////////////
    
    // private vars
    var 
        $__isInited = false,  $__locale = {}, $__plurals = {},
        
        $__cacheMode = 0, $__cacheDir = './', $__cache = {}, $__templates = {}, $__partials = {}, $__inlines = {},
        
        $__leftTplSep = "<%", $__rightTplSep = "%>", $__tplStart = "", $__tplEnd = "", $__tplPrefixCode = "",
        
        $__preserveLinesDefault = "' + \"\\n\" + '", $__preserveLines = '',  $__EOL = "\n", $__TEOL = (_isNode) ? require('os').EOL : "\n",
        
        $__stack = null, $__level = 0, $__pad = "    ", 
        $__loops = 0, $__ifs = 0, $__loopifs = 0, $__blockcnt = 0, $__blocks = [], $__allblocks = [], $__extends = null,
    
        $__uuid = 0,
        
        UNDERLNRX = /[ -]/g, NLRX = /\n\r|\r\n|\n|\r/g,
        ALPHA = /^[a-zA-Z_]/, NUM = /^[0-9]/, ALPHANUM = /^[a-zA-Z0-9_]/i, SPACE = /^\s/,
        
        $__regExps = {
            'specials' : null,
            'replacements' : null,
            'functions' : null,
            'controls' : null
        },
        
        $__controlConstructs = [
            'include', 'template', 
            'extends', 'endblock', 'block',
            'elsefor', 'endfor', 'for',
            'set', 'unset',
            'elseif', 'else', 'endif', 'if'
        ],
        
        $__funcs = [ 
            'htmlselect', 'htmltable', 
            'plugin_([a-zA-Z0-9_]+)', 'has_key',
            'lowercase', 'uppercase', 'camelcase', 'snakecase', 'pluralise',
            'concat', 'ltrim', 'rtrim', 'trim', 'sprintf', 'addslashes', 'stripslashes',
            'tpl', 'uuid',
            'html', 'url', 'count', 
            'ldate', 'date', 'now', 'locale',
            'dq', 'q', 'l', 's', 'n', 'f' 
        ],
        
        $__plugins = { },
        
        // pad lines to generate formatted code
        padLines = function(lines, level) {
            if ("undefined"==typeof(level)) level = $__level;
            
            if (level>=0)
            {
                // needs one more additional level due to array.length
                level = (0===level) ? level : level+1;
                var pad = new Array(level).join($__pad), i, l;
                lines = lines.split(NLRX);
                l = lines.length;
                for (i=0; i<l; i++)
                {
                    lines[i] = pad + lines[i];
                }
                return lines.join($__TEOL);
            }
            return lines;
        },
        
        //
        // Control structures
        //
    
        // set/create/update tpl var
        t_set = function(args) {
            args = args.split(',');
            var varname = trim( args.shift() );
            var expr = trim(args.join(','));
            return "';" + $__TEOL + padLines( varname + ' = ('+ expr +');' ) + $__TEOL;
        },
        
        // unset/remove/delete tpl var
        t_unset = function(varname) {
            if ( varname && varname.length )
            {
                varname = trim( varname );
                return "';" + $__TEOL + padLines( 'if ( "undefined" !== typeof (' + varname + ') ) delete ' + varname + ';' ) + $__TEOL;
            }
            return "'; " + $__TEOL; 
        },
        
        // if
        t_if = function(cond) { 
            var out, out1;
            
            $__ifs++; 
            out = "';";
            out1 = $__IF().split( '__{{COND}}__' ).join( cond );
            
            out += padLines(out1);
            $__level++;
            
            return out;
        },
        
        // elseif
        t_elseif = function(cond) { 
            var out, out1;
            
            out = "';";
            out1 = $__ELSEIF().split( '__{{COND}}__' ).join( cond );

            $__level--;
            out += padLines(out1);
            $__level++;
            
            return out;
        },
        
        // else
        t_else = function() { 
            var out, out1;
            
            out = "';";
            out1 = $__ELSE();
            
            $__level--;
            out += padLines(out1);
            $__level++;
            
            return out;
        },
        
        // endif
        t_endif = function() { 
            var out, out1;
            
            $__ifs--; 
            out = "';";
            out1 = $__ENDIF();
            
            $__level--;
            out += padLines(out1);
            
            return out;
        },
        
        // for, foreach
        t_for = function(for_expr) {
            var out, out1;
            
            $__loops++;  $__loopifs++;
            
            for_expr = for_expr.split(' as ');
            
            var o = trim(for_expr[0]), 
                kv = for_expr[1].split('=>'), 
                k = trim(kv[0]) + '__RAW__', 
                v = trim(kv[1]) + '__RAW__',
                forReplace = {
                    '__{{O}}__' : o,
                    '__{{K}}__' : k, 
                    '__{{V}}__' : v, 
                    '__{{ASSIGN1}}__' : "var "+v+" = "+o+"["+k+"];",
                    '__{{ASSIGN2}}__' : "__instance__.data['"+k+"'] = "+k+"; __instance__.data['"+v+"'] = "+v+";"
                }
            ;
            
            out = "';";
            out1 = $__FOR();
            for (var k in forReplace) out1 = out1.split( k ).join( forReplace[k] );
            
            out += padLines(out1);
            
            $__level+=3;
            
            return out;
        },
        
        // elsefor
        t_elsefor = function() { 
            var out, out1;
            
            /* else attached to  for loop */ 
            $__loopifs--;  
            out = "';";
            out1 = $__ELSEFOR();
            
            $__level+=-3;
            out += padLines(out1);
            $__level+=1;
            
            return out;
        },
        
        // endfor
        t_endfor = function() {
            var out, out1;
            
            out = "';";
            
            if ( $__loopifs == $__loops ) 
            { 
                $__loops--; $__loopifs--;  
                out1 = $__ENDFOR1();
                $__level+=-3;
                out += padLines(out1);
                
                return out;
            }
            
            $__loops--; 
            out1 = $__ENDFOR2();
            
            $__level+=-1;
            out += padLines(out1);
            
            return out;
        },
        
        // include file
        t_include = function(id) {
            // cache it
            if ( !$__partials[id] )
            {
                pushState();
                resetState();
                $__partials[id] = " " + parse(self.getTemplateContents(id), false) + "'; " + $__TEOL;
                popState();
            }
            return padLines( $__partials[id] );
        },
        
        // include template
        t_template = function(args) {
            args = args.split(',');
            var id = trim( args.shift() );
            var obj = args.join(',');
            return '\' + %tpl( "'+id+'", '+obj+' ); ' + $__TEOL;
        },
        
        // extend another template
        t_extends = function(tpl) { 
            $__extends = tpl; 
            return "'; " + $__TEOL; 
        },
        
        // define (overridable) block
        t_block = function(block) { 
            block = trim(block);
            if ( 0>$__allblocks.indexOf(block) )
            {
                $__allblocks.push(block); 
            }
            $__blockcnt++; 
            $__blocks.push(block); 
            return "' +  __||" + block + "||__";  
        },
        
        // end define (overridable) block
        t_endblock = function() { 
            if ($__blockcnt) 
            {
                $__blockcnt--; 
                return "__||/" + $__blocks.pop() + "||__";
            }  
            return '';  
        },
        
        //
        // auxilliary parsing methods
        //
        doControlConstructs = function(match, ctrl, args)  {
            if ( ctrl )
            {
                args = args || '';
                switch ( ctrl )
                {
                    case 'set': return t_set( args );  break;
                    
                    case 'unset': return t_unset( args );  break;
                    
                    case 'if': return t_if( args );  break;
                    
                    case 'elseif':  return t_elseif( args );  break;
                    
                    case 'else': return t_else( args );  break;
                    
                    case 'endif': return t_endif( args ); break;
                    
                    case 'for': return t_for( args ); break;
                    
                    case 'elsefor': return t_elsefor( args ); break;
                    
                    case 'endfor':  return t_endfor( args );  break;
                    
                    case 'extends':  return t_extends( args );  break;
                    
                    case 'block':  return t_block( args );  break;
                    
                    case 'endblock':  return t_endblock( args );  break;
                    
                    case 'template': return t_template( args );  break;
                    
                    case 'include':  return t_include( args );  break;
                }
            }
            return match;
        },
        
        doBlocks = function(s) {
            var blocks = {}, 
                bl = $__allblocks.length, 
                block, code, 
                delim1, delim2, 
                len1, len2, 
                pos1, pos2, 
                bout;
                
            while (bl--)
            {
                block = $__allblocks.pop();
                
                delim1 = '__||' + block + '||__'; 
                delim2 = '__||/' + block + '||__'; 
                
                len1 = delim1.length; 
                len2 = len1+1; 
                
                pos1 = s.indexOf(delim1, 0); 
                pos2 = s.indexOf(delim2, pos1+len1);
                
                code = s.substr(pos1, pos2-pos1+len2);
                
                if ( code.length )
                {
                    //s = s.split(code).join("__instance__.renderBlock( '" + block + "' ); ");
                    
                    code = code.substring(len1, code.length-len2).replace("+ '' +", '+').replace("+ '';", ';'); // remove redundant code
                    
                    bout = $__DOBLOCK().split( '__{{CODE}}__' ).join( padLines(code+"';", 0) );
                    
                    blocks[block] = bout;
                }
                
                var replace = true;
                while (replace)
                {
                    // replace all occurances of the block on the current template, 
                    // with the code found previously
                    // in the 1st block definition
                    s = s.substr(0, pos1) +  
                        "__instance__.renderBlock( '" + block + "' ); " +
                        s.substr(pos2+len2)
                    ;
                    
                    replace = ( -1 < (pos1 = s.indexOf(delim1, 0)) );
                    pos2 = (replace) ? s.indexOf(delim2, pos1+len1) : 0;
                }
            }
            
            return [s.replace( "+ '' +", '+' ).replace( "+ '';", ';' ), blocks];
        },
        
        parseString = function(s, q, i, l) {
            var string = q, escaped = false, ch = '';
            while ( i < l )
            {
                ch = s[i++];
                string += ch;
                if ( q == ch && !escaped )  break;
                escaped = (!escaped && '\\' == ch);
            }
            return string;
        },
        
        parseVariable = function(s, i, l, pre)  {
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
                variable = "__instance__.data['" + variable + "']";
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
                while ( i < l && ('.' == s[i] || '[' == s[i]) )
                {
                    delim = s[i++];
                    
                    // extra space
                    while ( i < l && SPACE.test(s[i]) )
                    {
                        space++;
                        i++;
                    }
                
                    // alpha-numeric dot property
                    if ( '.' == delim )
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
                    else if ( '[' == delim )
                    {
                        bracketcnt++;
                        
                        ch = s[i];
                        
                        // literal string property
                        if ( '"' == ch || "'" == ch )
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
                        else if ( '$' == ch )
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
                        else if ( ']' == ch )
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
                        if ( ']' == s[i] )
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
        
        parseTag = function( tag ) {
            var countl = tag.length,
                index = 0,
                ch = '',
                out = '',
                cnt = 0,
                variables = {},
                strings = {},
                tok, id, v, tokv
            ;
            while ( index < countl )
            {
                ch = tag[index++];
                
                // parse mainly literal strings and variables
                
                // literal string
                if ( '"' == ch || "'" == ch )
                {
                    tok = parseString( tag, ch, index, countl );
                    cnt++;
                    id = "__##STR"+cnt+"##__";
                    strings[ id ] = tok;
                    out += id;
                    index += tok.length-1;
                }
                // variable
                else if ( '$' == ch )
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
            return [out, variables, strings];
        },

        doTags = function(tag) {
            var strings, variables, id;
            
            // refined parsing
            tag = parseTag( tag );
            strings = tag[ 2 ]; 
            variables = tag[ 1 ];
            tag = tag[ 0 ];
        
            // fix literal data notation, not needed here
            //tag = str_replace(array('{', '}', '[', ']', ':'), array('array(', ')','array(', ')', '=>'), tag);
        
            tag = tag
                    .replace( $__regExps['controls'], doControlConstructs )
            
                    .replace( $__regExps['functions'], function(m, func, plugin) {
                        // allow custom plugins as template functions
                        if ( plugin && $__plugins[ plugin ]/*self['plugin_' + plugin ]*/ )
                            return 'Contemplate.plugin_' + plugin;
                        return 'Contemplate.' + func; 
                    })
                    
                    .replace( $__regExps['replacements'], "' + ( $1 ) + '" )
                ;
            
            for (id in variables)  
            {
                tag = tag.split( id+'__RAW__' ).join( variables[id][1] );
                tag = tag.split( id ).join( variables[id][0] );
            }
            
            for (id in strings)  
                tag = tag.split( id ).join( strings[id] );
                
            return tag
                    .split( "\t" ).join( $__tplStart )
                    
                    .split( "\v" ).join( padLines($__tplEnd) )
            ;
        },
        
        split = function(s) {
            var parts1, len, parts, i, tmp;
            parts1 = s.split( $__leftTplSep );
            len = parts1.length;
            parts = [];
            for (i=0; i<len; i++)
            {
                tmp = parts1[i].split( $__rightTplSep );
                parts.push ( tmp[0] );
                if (tmp.length > 1) parts.push ( tmp[1] );
            }
            return parts;
        },
    
        parse = function(tpl, withblocks) {
            var parts, len, out, s, i, isTag;
            
            parts = split( tpl );
            len = parts.length;
            isTag = false;
            out = '';
            for (i=0; i<len; i++)
            {
                s = parts[i];
                
                if ( isTag )
                {
                    s = s.replace( $__regExps['specials'], " " ); // replace special chars
                    
                    s = doTags( "\t" + s + "\v" ); // parse each template tag section accurately
                    
                    isTag = false;
                }
                else
                {
                    s = s
                        .split( "'" ).join( "\\'" )  // escape single quotes accurately (used by parse function)
                        
                        .split( "\n" ).join( $__preserveLines ) // preserve lines
                    ;
                    
                    isTag = true;
                }
                
                out += s;
            }
        
            if ('undefined'==typeof(withblocks)) withblocks = true;
            
            if ( withblocks ) return doBlocks( out ); // render any blocks
            
            return out.replace( "+ '' +", '+' ).replace( "+ '';", ';' ); // remove redundant code
        },
        
        getCachedTemplateName = function(id) { 
            return $__cacheDir + id.replace(UNDERLNRX, '_') + '_tpl.js'; 
        },
        
        getCachedTemplateClass = function(id) { 
            return 'Contemplate_' + id.replace(UNDERLNRX, '_') + '_Cached'; 
        },
        
        createTemplateRenderFunction = function(id) {
            
            resetState();
            
            var blocks = parse( self.getTemplateContents(id) ), funcs = {}, b, func;
            
            if ($__extends)
            {
                func = $__FUNC1;
            }
            else
            {
                // Introduce the data as local variables using with(){}
               // Convert the template into pure JavaScript
                func = $__FUNC2().split( '__{{CODE}}__' ).join( padLines("__p__ += '" + blocks[0] + "';", 0) );
            }
            
            // defined blocks
            for (b in blocks[1]) funcs[b] = new Function("__instance__", blocks[1][b]);
            
            return [new Function("__instance__", func), funcs];
        },
        
        createCachedTemplate = function(id, filename, classname) {
            
            resetState();
            
            var  
                funcs = {}, parentCode, renderCode, b, sblocks, bcode,
                blocks = parse( self.getTemplateContents(id) )
                ;
            
            // tpl-defined blocks
            sblocks = [];
            for ( b in blocks[1] ) 
            {
                bcode = $__TEOL + $__tplBlockCode()
                            .split( '__{{BLOCK}}__' ).join( b )
                            .split( '__{{BLOCKMETHOD}}__' ).join( b )
                            .split( '__{{BLOCKMETHODCODE}}__' ).join( padLines(blocks[1][b], 1) )
                        ;
                sblocks.push( bcode );
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
                parentCode = "this.setParent( '" + $__extends + "' );";
                renderCode = $__RCODE1;
            }
            else
            {
                parentCode = '';
                renderCode = $__RCODE2().split( '__{{CODE}}__' ).join( padLines("__p__ += '" + blocks[0] + "';", 0) );
            }
            
            var prefixCode;
            if ( $__tplPrefixCode )
                prefixCode = $__tplPrefixCode;
            else
                prefixCode = '';
            
          // generate tpl class
            var classCode = $__tplClassCode()
                                .split( '__{{PREFIX_CODE}}__' ).join( prefixCode )
                                .split( '__{{ID}}__' ).join( id )
                                .split( '__{{CLASSNAME}}__' ).join( classname )
                                .split( '__{{PARENTCODE}}__' ).join( padLines(parentCode, 2) )
                                .split( '__{{BLOCKS}}__' ).join( padLines(sblocks, 2) )
                                .split( '__{{RENDERCODE}}__' ).join( padLines(renderCode, 4) )
                            ;
            
            return setCachedTemplate(filename, classCode);
        },
        
        getCachedTemplate = function(id) {
            
            // inline templates saved only in-memory
            if ( $__inlines[id] )
            {
                // dynamic in-memory caching during page-request
                var funcs = createTemplateRenderFunction(id), 
                    tpl = new ContemplateInstance(id, funcs[0]).setBlocks(funcs[1]);
                if ($__extends) tpl.setParent( self.tpl($__extends) );
                return tpl;
            }
            
            if ( !_isNode ) $__cacheMode = self.CACHE_TO_DISK_NONE;
            
            switch ( $__cacheMode )
            {
                case self.CACHE_TO_DISK_NOUPDATE:
                
                    var cachedTplFile = getCachedTemplateName(id), 
                        cachedTplClass = getCachedTemplateClass(id);
                    if ( !fexists(cachedTplFile) )
                    {
                        createCachedTemplate(id, cachedTplFile, cachedTplClass);
                    }
                    if ( fexists(cachedTplFile) )
                    {
                        var tplclass = require(cachedTplFile), 
                            tpl = new tplclass().setId(id);
                        return tpl;
                    }
                    return null;
                    break;
                
                case self.CACHE_TO_DISK_AUTOUPDATE:
                
                    var cachedTplFile = getCachedTemplateName(id), 
                        cachedTplClass = getCachedTemplateClass(id);
                    if ( !fexists(cachedTplFile) )
                    {
                        // if tpl not exist create it
                        createCachedTemplate(id, cachedTplFile, cachedTplClass);
                    }
                    else
                    {
                        var stat = fstat(cachedTplFile), stat2 = fstat($__templates[id]);
                        if ( stat.mtime.getTime() <= stat2.mtime.getTime() )
                        {
                            // is out-of-sync re-create it
                            createCachedTemplate(id, cachedTplFile, cachedTplClass);
                        }
                    }
                    if ( fexists(cachedTplFile) )
                    {
                        var tplclass = require(cachedTplFile), 
                            tpl = new tplclass().setId(id);
                        return tpl;
                    }
                    return null;
                    break;
                    
                case self.CACHE_TO_DISK_NONE:
                default:
                
                    // dynamic in-memory caching during page-request
                    var funcs = createTemplateRenderFunction(id), 
                        tpl = new ContemplateInstance(id, funcs[0]).setBlocks(funcs[1]);
                    if ($__extends) tpl.setParent( self.tpl($__extends) );
                    return tpl;
                    break;
            }
            return null;
        },
        
        setCachedTemplate = function(filename, tplContents) { 
            return fwrite(filename, tplContents, { encoding: self.ENCODING }); 
        },
        
        resetState = function() {
            // reset state
            $__loops = 0; $__ifs = 0; $__loopifs = 0; $__level = 0;
            $__blockcnt = 0; $__blocks = [];  $__allblocks = [];  $__extends = null;
        },
        
        pushState = function() {
            // push state
            $__stack.push([$__loops, $__ifs, $__loopifs, $__level,
            $__blockcnt, $__blocks,  $__allblocks,  $__extends]);
        },
        
        popState = function() {
            // pop state
            var t = $__stack.pop();
            $__loops = t[0]; $__ifs = t[1]; $__loopifs = t[2]; $__level = t[3];
            $__blockcnt = t[4]; $__blocks = t[5];  $__allblocks = t[6];  $__extends = t[7];
        },
        
        // generated cached tpl class code as a "heredoc" template (for Node cached templates)
        $__tplClassCode = function(NL){
                    NL = NL || $__TEOL;
                    return [
"__{{PREFIX_CODE}}__"
,"!function (root, moduleName, moduleDefinition) {"
,""
,"    //"
,"    // export the module"
,""    
,"    // node, CommonJS, etc.."
,"    if ( 'object' == typeof(module) && module.exports ) module.exports = moduleDefinition();"
,""    
,"    // AMD, etc.."
,"    else if ( 'function' == typeof(define) && define.amd ) define( moduleDefinition );"
,""    
,"    // browser, etc.."
,"    else root[ moduleName ] = moduleDefinition();"
,""
,""
,"}(this, '__{{CLASSNAME}}__', function( ) {"
,"   /* Contemplate cached template '__{{ID}}__' */"
,"   /* quasi extends main Contemplate class */"
,"   "
,"   /* This is NOT used, Contemplate is accessible globally */"
,"   /* var self = require('Contemplate'); */"
,"   "
,"   /* constructor */"
,"   function __{{CLASSNAME}}__(id)"
,"   {"
,"       /* initialize internal vars */"
,"       var _parent = null, _blocks = null;"
,"       "
,"       this.id = id;"
,"       this.data = null;"
,"       "
,"       "
,"       /* tpl-defined blocks render code starts here */"
,"__{{BLOCKS}}__"
,"       /* tpl-defined blocks render code ends here */"
,"       "
,"       /* template methods */"
,"       "
,"       this.setId = function(id) {"
,"           if ( id ) this.id = id;"
,"           return this;"
,"       };"
,"       "
,"       this.setParent = function(parent) {"
,"           if ( parent )"
,"           {"
,"               if ( parent.substr )"
,"                   _parent = Contemplate.tpl( parent );"
,"               else"
,"                   _parent = parent;"
,"           }"
,"           return this;"
,"       };"
,"       "
,"       /* render a tpl block method */"
,"       this.renderBlock = function(block, __instance__) {"
,"           if ( !__instance__ ) __instance__ = this;"
,"           if ( _blocks && _blocks[block] ) return _blocks[block](__instance__);"
,"           else if ( _parent ) return _parent.renderBlock(block, __instance__);"
,"           return '';"
,"       };"
,"       "
,"       /* tpl render method */"
,"       this.render = function(data, __instance__) {"
,"           if ( !__instance__ ) __instance__ = this;"
,"           var __p__ = '';"
,"           if ( _parent )"
,"           {"
,"               __p__ = _parent.render(data, __instance__);"
,"           }"
,"           else"
,"           {"
,"               /* tpl main render code starts here */"
,"__{{RENDERCODE}}__"
,"               /* tpl main render code ends here */"
,"           }"
,"           this.data = null;"
,"           return __p__;"
,"       };"
,"       "
,"       /* parent tpl assign code starts here */"
,"__{{PARENTCODE}}__"
,"       /* parent tpl assign code ends here */"
,"   };"
,"   "
,"   "
,"    // export it"
,"    return __{{CLASSNAME}}__;"
,"});"
,""
].join(NL);
},   
    
        // generated cached tpl block method code as a "heredoc" template (for Node cached templates)
        $__tplBlockCode = function(NL){ 
                    NL = NL || $__TEOL;
                    return [""
,"/* tpl block render method for block '__{{BLOCK}}__' */"
,"'__{{BLOCKMETHOD}}__': function(__instance__) {"
,"__{{BLOCKMETHODCODE}}__"
,"}"
,""
].join(NL);
},

        $__DOBLOCK = function(NL){
                    NL = NL || $__TEOL;
                    return [""
,"var __p__ = '';"
,"__{{CODE}}__"
,"return __p__;"
,""
].join(NL);
},

        $__IF = function(NL){
                    NL = NL || $__TEOL;
                    return [""
,"if ( __{{COND}}__ )"
,"{"
,""
,""
].join(NL);
},
    
        $__ELSEIF = function(NL){
                    NL = NL || $__TEOL;
                    return [""
,"}"
,"else if ( __{{COND}}__ )"
,"{"
,""
,""
].join(NL);
},
    
        $__ELSE = function(NL){
                    NL = NL || $__TEOL;
                    return [""
,"}"
,"else"
,"{"
,""
,""
].join(NL);
},
    
        $__ENDIF = function(NL){
                    NL = NL || $__TEOL;
                    return [""
,"}"
,""
,""
].join(NL);
},
    
        $__FOR = function(NL){
                    NL = NL || $__TEOL;
                    return [""
,"if ( __{{O}}__ && Object.keys(__{{O}}__).length )"
,"{"
,"   var __{{K}}__;"
,"   for ( __{{K}}__ in __{{O}}__ )"
,"   {"
,"       if ( Contemplate.hasOwn(__{{O}}__, __{{K}}__) )"
,"       {"
,"          __{{ASSIGN1}}__"
,"          __{{ASSIGN2}}__"
,"       "
,""
].join(NL);
},
    
        $__ELSEFOR = function(NL){
                    NL = NL || $__TEOL;
                    return [""
,"       }"
,"   }"
,"}"
,"else"
,"{  "
,"    "
,""
].join(NL);
},
    
        $__ENDFOR1 = function(NL){
                    NL = NL || $__TEOL;
                    return [""
,"       }"
,"   }"
,"}"
,""
,""
].join(NL);
},
    
        $__ENDFOR2 = function(NL){
                    NL = NL || $__TEOL;
                    return [""
,"}"
,""
,""
].join(NL);
},
    
        $__FUNC1 = "return '';",
        
        $__FUNC2 = function(NL){
                    NL = NL || $__TEOL;
                    return [""
,"var __p__ = '';"
,"__{{CODE}}__"
,"return __p__;"
,""
].join(NL);
},
        $__RCODE1 = "__p__ = '';",
        
        $__RCODE2 = function(NL){
                    NL = NL || $__TEOL;
                    return [""
,"__instance__.data = Contemplate.data( data );"
,"__{{CODE}}__"
,""
].join(NL);
}
    ;
    
    
    /*
    *  Template Engine
    *
    */
    
    //
    //  Instance template method(s) (for in-memory only templates)
    //
    var ContemplateInstance = function(id, renderFunc) {
        // private vars
        var _renderFunction = null, _parent = null, _blocks = null;
        
        this.id = null;  
        this.data = null;
        
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
        
        this.setParent = function(parent) { 
            if ( parent )
            {
                if ( parent.substr )
                    _parent = Contemplate.tpl( parent );
                else
                    _parent = parent;
            }
            return this;
        };
        
        this.setRenderFunction = function(renderfunc) { 
            _renderFunction = renderfunc; 
            return this; 
        };
        
        this.setBlocks = function(blocks) { 
            if ( !_blocks ) _blocks = {}; 
            _blocks = Contemplate.merge(_blocks, blocks); 
            return this; 
        };
        
        this.renderBlock = function(block, __instance__) {
            if ( !__instance__ ) __instance__ = this;
            
            if ( _blocks && _blocks[block] ) return _blocks[block](__instance__);
            else if ( _parent ) return _parent.renderBlock(block, __instance__);
            
            return '';
        };
        
        this.render = function(data, __instance__) {
            var __p__ = '';
            
            if ( !__instance__ ) __instance__ = this;
            
            if ( _parent ) 
            {
                __p__ = _parent.render(data, __instance__);
            }
            else if ( _renderFunction )  
            {
                __instance__.data = Contemplate.data( data ); 
                __p__ = _renderFunction(__instance__);
            }
            
            this.data = null;
            return __p__;
        };
    };
    
    self = {

        // constants
        VERSION : __version__,
        
        CACHE_TO_DISK_NONE : 0,
        CACHE_TO_DISK_AUTOUPDATE : 2,
        CACHE_TO_DISK_NOUPDATE : 4,
        
        ENCODING : 'utf8',
        
        init : function() {
            if ($__isInited) return;
            
            $__stack = [];
            
            // pre-compute the needed regular expressions
            $__regExps['specials'] = new RegExp('[\\n\\r\\v\\t]', 'g');
            
            $__regExps['replacements'] = new RegExp('\\t[ ]*(.*?)[ ]*\\v', 'g');
            
            $__regExps['controls'] = new RegExp('\\t[ ]*%('+$__controlConstructs.join('|')+')\\b[ ]*\\((.*)\\)', 'g');
            
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
        addPlugin : function(name, handler) {
            if ( name && handler )
            {
                $__plugins[ name ] = true;
                self[ "plugin_" + name ] = handler;
            }
        },
    
        setPrefixCode : function(preCode) {
            if ( preCode )
                $__tplPrefixCode = '' + preCode;
        },
    
        setLocaleStrings : function(l) { 
            $__locale = self.merge($__locale, l); 
        },
        
        clearLocaleStrings : function() { 
            $__locale = {}; 
        },
        
        setPlurals : function(plurals) { 
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
        
        clearPlurals : function() { 
            $__plurals = {}; 
        },
        
        setTemplateSeparators : function(seps) {
            if (seps)
            {
                if (seps['left'])  $__leftTplSep = ''+seps['left'];
                if (seps['right']) $__rightTplSep = ''+seps['right'];
            }
        },
        
        setPreserveLines : function(bool) { 
            if ( 'undefined'==typeof(bool) ) bool = true; 
            
            if ( bool ) 
                $__preserveLines = $__preserveLinesDefault; 
            else 
                $__preserveLines = ''; 
        },
        
        setCacheDir : function(dir) { 
            $__cacheDir = rtrim(dir, '/') + '/';  
        },
        
        setCacheMode : function(mode) { 
            $__cacheMode = (_isNode) ? mode : self.CACHE_TO_DISK_NONE; 
        },
        
        clearCache : function(all) { 
            $__cache = {}; 
            if ( all ) $__partials = {}; 
        },
        
        // add templates manually
        add : function(tpls) { 
            if ( tpls )
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
        },
    
        // add inline templates manually
        addInline : function(tpls) { 
            $__inlines = self.merge($__inlines, tpls);  
        },
        
        // return the requested template (with optional data)
        tpl : function(id, data, refresh) {
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.
            if (refresh || !$__cache[id])  
                $__cache[id] = getCachedTemplate(id);
            
            var tpl = $__cache[id];
            
            // Provide some basic currying to the user
            if ( data && "object" == typeof(data) ) return tpl.render( data );
            else  return tpl;
        },
        
        
        //
        // Basic template functions
        //
        
        // basic html escaping
        html : function(s) { 
            return htmlentities(s, 'ENT_COMPAT', 'UTF-8'); 
        },
        
        // basic url escaping
        url : function(s) { 
            return urlencode(s); 
        },
        
        // count items in obj/array
        count : count,
        
        // check if (nested) keys exist in tpl variable
        has_key : function(v/*, key1, key2, etc.. */) {
            var to_string = _toString(v);
            if (!v || "[object Array]" != to_string && "[object Object]" != to_string) return false;
            var args = slice(arguments), argslen, i, tmp;
            args.shift();
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
        q : function(e) { 
            return "'" + e + "'"; 
        },
        
        // double quote
        dq : function(e) { 
            return '"' + e + '"';  
        },
        
        // to String
        s : function(e) { 
            return (String)(''+e); 
        },
        
        // to Integer
        n : function(e) { 
            return parseInt(e, 10); 
        },
        
        // to Float
        f : function(e) { 
            return parseFloat(e, 10); 
        },
        
        addslashes : function(str) {
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
        
        stripslashes : function(str) {
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
        concat : function() { 
            return slice(arguments).join(''); 
        },
        
        // Trim strings in templates
        trim : trim,
        ltrim : ltrim,
        rtrim : rtrim,
        
        ucfirst : function(s) {
            return s[0].toUpperCase() + s.substr(1);//.toLowerCase();
        },
        lcfirst : function(s) {
            return s[0].toLowerCase() + s.substr(1);//.toUpperCase();
        },
        lowercase : function(s) {
            return s.toLowerCase();
        },
        uppercase : function(s) {
            return s.toUpperCase();
        },
        camelcase : function(s, sep, capitalizeFirst) {
            sep = sep || "_";
            if ( capitalizeFirst )
                return s.split( sep ).map( self.ucfirst ).join( "" );
            else
                return self.lcfirst( s.split( sep ).map( self.ucfirst ).join( "" ) );
        },
        snakecase : function(s, sep) {
            sep = sep || "_";
            return s.replace( /([A-Z])/g, sep + '$1' ).toLowerCase();
        },
        // Sprintf in templates
        sprintf : sprintf,
        
        //
        //  Localization functions
        //
        
        // current time in seconds
        // time, now
        time : time,
        
        // formatted date
        date : function($format, $time) { 
            if (!$time) $time = time(); 
            return date($format, $time); 
        },
        
        // localized formatted date
        ldate : function($format, $time) { 
            if (!$time) $time = time(); 
            return _localized_date($__locale, $format, $time); 
        },
        
        // locale
        // locale, l
        locale : function(e) { 
            return (_hasOwn($__locale, e)) ? $__locale[e] : e; 
        },
        // pluralise
        pluralise : function(singular, count) {
            if ($__plurals[singular])
                return 1 !== count ? $__plurals[singular] : singular;
            return singular;
        },
        
        // generate a uuid
        uuid : function(namespace) {
            return [namespace||'UUID', ++$__uuid, time()].join('_');
        },
        
        //
        //  HTML elements
        //
        
        // html table
        htmltable : function($data, $options) {
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
                $tk="<td>"+array_keys($data).join('</td><td>')+"</td>";
                
            $header='';
            if ($options['header'])
                $header="<thead><tr>"+$tk+"</tr></thead>";
                
            $footer='';
            if ($options['footer'])
                $footer="<tfoot><tr>"+$tk+"</tr></tfoot>";
            
            $o+=$header;
            
            // get data rows
            $rows=[];
            $vals=array_values($data);
            for ($i in $vals)
            {
                if (self.hasOwn($vals, $i))
                {
                    $col=$vals[$i];
                    if (!is_array($col))  $col=[$col];
                    $colvals=array_values($col);
                    for ($j=0, $l=$colvals.length; $j<$l; $j++)
                    {
                        if (!$rows[$j]) $rows[$j]=new Array($l);
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
        htmlselect : function($data, $options) {
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
        
        getTemplateContents : function(id) {
            if ( $__inlines[id] )
            {
                return $__inlines[id];
            }
            else if ( $__templates[id] )
            {
                // nodejs
                if ( _isNode && _fs ) 
                { 
                    return fread($__templates[id], { encoding: self.ENCODING }); 
                }
                // client-side js and #id of DOM script-element given as template holder
                else if ( 0===$__templates[id].indexOf('#') ) 
                { 
                    return window.document.getElementById($__templates[id].substring(1)).innerHTML; 
                }
                // client-side js and url given as template location
                else 
                { 
                    return ajaxLoad('GET', $__templates[id]); 
                }
            }
            return '';
        },
        
        hasOwn : function(o, p) { 
            return o && _hasOwn(o, p); 
        },
        
        merge : function() {
            var args = slice(arguments);
            if (args.length<1) return;
            var merged = args.shift(), i, k, o, l = args.length;
            for (i=0; i<l; i++)
            { 
                o = args[i]; 
                if (o) 
                { 
                    for (k in o) 
                    { 
                        if (_hasOwn(o, k)) 
                        { 
                            merged[k] = o[k]; 
                        } 
                    } 
                } 
            }
            return merged;
        },
        
        data : function(o) {
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
  var hash_map = this.get_html_translation_table('HTML_ENTITIES', quote_style),
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
        cnt += this.count(mixed_var[key], 1);
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
  this.php_js = this.php_js || {};
  this.php_js.ini = this.php_js.ini || {};
  // END REDUNDANT

  ini = this.php_js.ini['phpjs.objectsAsArrays'];

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
function array_keys (input, search_value, argStrict) {
  var search = typeof search_value !== 'undefined',
    tmp_arr = [],
    strict = !!argStrict,
    include = true,
    key = '';

  if (input && typeof input === 'object' && input.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
    return input.keys(search_value, argStrict);
  }

  for (key in input) {
    if (input.hasOwnProperty(key)) {
      include = true;
      if (search) {
        if (strict && input[key] !== search_value) {
          include = false;
        }
        else if (input[key] != search_value) {
          include = false;
        }
      }

      if (include) {
        tmp_arr[tmp_arr.length] = key;
      }
    }
  }

  return tmp_arr;
}
function array_values (input) {
  var tmp_arr = [],
    key = '';

  if (input && typeof input === 'object' && input.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
    return input.values();
  }

  for (key in input) {
    tmp_arr[tmp_arr.length] = input[key];
  }

  return tmp_arr;
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
    var that = this,
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
  this.date = function (format, timestamp) {
    that = this;
    jsdate = (timestamp === undefined ? new Date() : // Not provided
      (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
      new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
    );
    return format.replace(formatChr, formatChrCb);
  };
  return this.date(format, timestamp);
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
// basic ajax functions
//
function ajaxRequest(type, url, params, callback) 
{
    var xmlhttp;
    if (window.XMLHttpRequest) // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    else // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); // or ActiveXObject("Msxml2.XMLHTTP"); ??
    
    xmlhttp.onreadystatechange = function() {
        if (callback && xmlhttp.readyState == 4) callback(xmlhttp.responseText, xmlhttp.status, xmlhttp);
    };
    
    xmlhttp.open(type, url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}
function ajaxLoad(type, url, params) 
{
    var xmlhttp;
    if (window.XMLHttpRequest) // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    else // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); // or ActiveXObject("Msxml2.XMLHTTP"); ??
    
    xmlhttp.open(type, url, false);  // 'false' makes the request synchronous
    xmlhttp.send(params);

    if (xmlhttp.status === 200)    return xmlhttp.responseText;
    return '';
}
    
    
    
    
    
    //
    //
    //
    
    
    
    // init the engine on load
    self.init();
    
    // export it
    // add it to global namespace to be available for sub-templates, same as browser
    if ( _isNode ) global.Contemplate = self;
    return self;
});