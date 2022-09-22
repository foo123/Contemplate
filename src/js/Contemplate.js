/**
*  Contemplate
*  Light-weight Object-Oriented Template Engine for PHP, Python, JavaScript
*
*  @version: 1.6.0
*  https://github.com/foo123/Contemplate
*
*  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed
*  http://ejohn.org/blog/javascript-micro-templating/
*
**/
!function(root, name, factory) {
"use strict";
if (('undefined'!==typeof Components)&&('object'===typeof Components.classes)&&('object'===typeof Components.classesByID)&&Components.utils&&('function'===typeof Components.utils['import'])) /* XPCOM */
    (root.$deps = root.$deps||{}) && (root.EXPORTED_SYMBOLS = [name]) && (root[name] = root.$deps[name] = factory.call(root));
else if (('object'===typeof module)&&module.exports) /* CommonJS */
    (module.$deps = module.$deps||{}) && (module.exports = module.$deps[name] = factory.call(root));
else if (('function'===typeof define)&&define.amd&&('function'===typeof require)&&('function'===typeof require.specified)&&require.specified(name) /*&& !require.defined(name)*/) /* AMD */
    define(name,['module'],function(module){factory.moduleUri = module.uri; return factory.call(root);});
else if (!(name in root)) /* Browser/WebWorker/.. */
    (root[name] = factory.call(root)||1)&&('function'===typeof(define))&&define.amd&&define(function(){return root[name];} );
}(  /* current root */          'undefined' !== typeof self ? self : this,
    /* module name */           "Contemplate",
    /* module factory */        function ModuleFactory__Contemplate(undef) {
"use strict";
/////////////////////////////////////////////////////////////////////////////////////
//
//  Contemplate Engine Main Class
//
//////////////////////////////////////////////////////////////////////////////////////

// private vars
var __version__ = "1.6.0", Contemplate,

    PROTO = 'prototype', Obj = Object, Arr = Array,
    HAS = Obj[PROTO].hasOwnProperty, toString = Obj[PROTO].toString,
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
    ? function import_module(name, path) {import_(path, $Scope); return $Scope[name];}
    : (isNode
    ? function import_module(name, path) {return import_(path);}
    : NOP),
    XHR = function() {
    return window.XMLHttpRequest
        // code for IE7+, Firefox, Chrome, Opera, Safari
        ? new XMLHttpRequest()
        // code for IE6, IE5
        : new ActiveXObject("Microsoft.XMLHTTP") // or ActiveXObject("Msxml2.XMLHTTP"); ??
    ;
    },

    $__isInited = false,

    $__leftTplSep = "<%", $__rightTplSep = "%>", $__tplStart = "", $__tplEnd = "",
    // https://nodejs.org/api/os.html#os_os_eol
    //
    $__EOL = "\n", $__TEOL = /*isNode ? import_('os').EOL :*/ "\n", $__escape = true,
    $__preserveLinesDefault = "' + \"\\n\" + '", $__preserveLines = '',

    $__level = 0, $__pad = "    ", $__idcnt = 0,
    $__locals, $__variables, $__loops = 0, $__ifs = 0, $__loopifs = 0, $__forType = 2,
    $__allblocks = null, $__allblockscnt = null,  $__openblocks = null,
    $__currentblock, $__startblock = null, $__endblock = null, $__blockptr = -1,
    $__extends = null, $__uses = null, $__strings = null,
    $__ctx, $__global, $__context, $__uuid = 0,

    UNDERLN = /[\W]+/g, NEWLINE = /\n\r|\r\n|\n|\r/g, SQUOTE = /'/g,
    DS_RE = /[\/\\]/, BASENAME_RE = /[\/\\]?[^\/\\]+$/,
    TAG_RE = /<\/?[a-zA-Z0-9:_\-]+[^<>]*>/gm, AMP_RE = /&+/g,
    ALPHA = /^[a-zA-Z_]/, NUM = /^[0-9]/, ALPHANUM = /^[a-zA-Z0-9_]/i,
    SPACE = /^\s/, ALL_SPACE = /^\s+$/,
    INDENT = /^(postdent|predent)\((-?\d+)\):/,
    re_controls = /(\t|\s?)\s*((#ID_(continue|endblock|elsefor|endfor|endif|break|else|fi)#(\s*\(\s*\))?)|(#ID_([^#]+)#\s*(\()))(.*)$/g,

    $__reserved_var_names = [
    'Contemplate', 'self', 'this', 'data', '__p__', '__i__', '__ctx'
    ],
    $__directives = [
    'set', 'unset', 'isset',
    'if', 'elseif', 'else', 'endif',
    'for', 'elsefor', 'endfor',
    'extends', 'block', 'endblock',
    'include', 'super', 'getblock', 'iif', 'empty', 'continue', 'break', 'local_set', 'get', 'local'
    ],
    $__directive_aliases = {
     'elif'     : 'elseif'
    ,'fi'       : 'endif'
    },
    $__aliases = {
     'cc'       : 'concat'
    ,'j'        : 'join'
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

if (isXPCOM)
{
    // do some necessary imports
    import_("resource://gre/modules/NetUtil.jsm");
    import_("resource://gre/modules/FileUtils.jsm");
}

/*function HAS(o, x)
{
    return !!(o && Object.prototype.hasOwnProperty.call(o, x));
}*/
function reset_state()
{
    $__loops = 0; $__ifs = 0; $__loopifs = 0; $__forType = 2; $__level = 0;
    $__allblocks = []; $__allblockscnt = {}; $__openblocks = [[null, -1]];
    $__extends = null; $__uses = []; $__locals = {}; $__variables = {}; $__currentblock = '_';
    $__locals[$__currentblock] = $__locals[$__currentblock] || {};
    $__variables[$__currentblock] = $__variables[$__currentblock] || {};
}
function clear_state()
{
    $__loops = 0; $__ifs = 0; $__loopifs = 0; $__forType = 2; $__level = 0;
    $__allblocks = null; $__allblockscnt = null; $__openblocks = null;
    $__locals = null; $__variables = null; $__currentblock = null;
    $__idcnt = 0; $__strings = null;
    /*$__extends = null; $__uses = [];*/
}
function push_state()
{
    return [$__loops, $__ifs, $__loopifs, $__forType, $__level,
    $__allblocks, $__allblockscnt, $__openblocks, $__extends, $__locals, $__variables, $__currentblock, $__uses];
}
function pop_state(state)
{
    $__loops = state[0]; $__ifs = state[1]; $__loopifs = state[2]; $__forType = state[3]; $__level = state[4];
    $__allblocks = state[5]; $__allblockscnt = state[6]; $__openblocks = state[7];
    $__extends = state[8]; $__locals = state[9]; $__variables = state[10]; $__currentblock = state[11]; $__uses = state[12];
}
function remove_initial_space(s)
{
    var l = s.length, sl, i, initial_space, c, pos;
    if (l)
    {
        initial_space = '';
        for (i=0; i<l; ++i)
        {
            c = s.charAt(i);
            if (' ' === c || "\t" === c) initial_space += c;
            else break;
        }
        sl = initial_space.length;
        if (sl)
        {
            s = s.slice(sl);
            pos = s.indexOf("\n", 0);
            while (-1 !== pos)
            {
                if (initial_space === s.slice(pos+1, pos+1+sl))
                {
                    s = s.slice(0, pos+1) + s.slice(pos+1+sl);
                }
                pos = s.indexOf("\n", pos + 1);
            }
        }
    }
    return s;
}
function remove_blank_lines(s)
{
    var lines = s.split("\n"), n = lines.length, start = 0, end = n-1, i, l;
    for (i=0; i<n; ++i)
    {
        l = lines[i];
        if (l.length && !ALL_SPACE.test(l))
        {
            start = i;
            break;
        }
    }
    for (i=n-1; i>=start; --i)
    {
        l = lines[i];
        if (l.length && !ALL_SPACE.test(l))
        {
            end = i;
            break;
        }
    }
    return lines.slice(start, end+1).join("\n");
}
function align(s, level)
{
    // pad lines to generate formatted code
    if (2 > arguments.length) level = $__level;
    s = remove_initial_space(s);
    var aligned = '', alignment, c, i, l = s.length, is_line_start;
    if (l && (0 < level))
    {
        alignment = new Arr(level+1).join($__pad);
        aligned = alignment;
        is_line_start = true;
        for (i=0; i<l; ++i)
        {
            c = s.charAt(i);
            if ("\n" === c)
            {
                aligned += "\n" + alignment;
                is_line_start = true;
            }
            else if (is_line_start)
            {
                // consistently replace tabs with our tabbed spaces
                if (SPACE.test(c))
                {
                    aligned += "\t" === c ? $__pad : c;
                }
                else
                {
                    aligned += c;
                    is_line_start = false;
                }
            }
            else
            {
                aligned += c;
            }
        }
    }
    else
    {
        aligned = s;
    }
    return aligned;
}
function merge()
{
    var args = arguments, l = args.length;
    if (l < 1) return;
    var merged = args[0], i, k, o;
    for (i=1; i<l; ++i)
    {
        o = args[i];
        if (o) for (k in o) if (HAS.call(o,k)) merged[k] = o[k];
    }
    return merged;
}
function get_separators(text, separators)
{
    var line, seps, pos, i, l;
    if (separators)
    {
        seps = trim(separators).split(" ");
        $__leftTplSep = trim(seps[0]);
        $__rightTplSep = trim(seps[1]);
    }
    else
    {
        // tpl separators are defined on 1st (non-empty) line of tpl content
        l = text.length; i = 0; pos = 0; line = "";
        while (i < l && -1 < pos && !line.length)
        {
            pos = text.indexOf("\n", i);
            line = -1 < pos ? trim(text.slice(i, pos+1)) : "";
            i = pos+1;
        }
        if (line.length)
        {
            seps = line.split(" ");
            $__leftTplSep = trim(seps[0]);
            $__rightTplSep = trim(seps[1]);
            text = text.slice(pos+1);
        }
    }
    return text;
}

function split_arguments(args, delim)
{
    args = trim(args);
    if (!args.length) return [''];
    if (arguments.length < 2) delim = ',';
    var a = [], paren = [], s = '', i = 0, l = args.length, c;
    while (i < l)
    {
        c = args.charAt(i++);
        if (delim === c && !paren.length)
        {
            a.push(trim(s));
            s = '';
            continue;
        }
        s += c;
        if ('(' === c)
        {
            paren.unshift(')');
        }
        else if ('{' === c)
        {
            paren.unshift('}');
        }
        else if ('[' === c)
        {
            paren.unshift(']');
        }
        else if (')' === c || '}' === c || ']' === c)
        {
            if (!paren.length || paren[0] !== c) break;
            paren.shift();
        }
    }
    if (s.length) a.push(trim(s));
    if (i < l) a.push(trim(args.slice(i)));
    return a;
}

function local_variable(variable, block, literal)
{
    if (null == variable)
    {
        return '_loc_' + (++$__idcnt);
    }
    else
    {
        if (null == block) block = $__currentblock;
        if (!HAS.call($__locals[block], $__variables[block][variable]))
            $__locals[block][$__variables[block][variable]] = literal ? 2 : 1;
        return variable;
    }
}

function is_local_variable(variable, block)
{
    if (null == block) block = $__currentblock;
    //if ('_loc_' === variable.slice(0, 5)) return 1;
    return HAS.call($__locals[block], $__variables[block][variable]) ? $__locals[block][$__variables[block][variable]] : 0;
}

//
// Control structures
//

function t_include(id, cb)
{
    var tpl, state, ch, contx = $__context;
    id = trim(id);
    if ($__strings && HAS.call($__strings, id)) id = $__strings[id];
    ch = id.charAt(0);
    if (('"' === ch || "'" === ch) && (ch === id.charAt(id.length-1))) id = id.slice(1, -1); // quoted id

    if ('function' === typeof cb)
    {
        // cache it
        if (!HAS.call(contx.partials, id) /*&& !HAS.call($__global.partials,id)*/)
        {
            get_template_contents(id, contx, function(err, tpl) {
                if (err)
                {
                    cb(err, null);
                    return;
                }
                tpl = get_separators(tpl);
                state = push_state();
                reset_state();
                parse(tpl, $__leftTplSep, $__rightTplSep, false, function(err, text) {
                    if (err)
                    {
                        cb(err, null);
                        return;
                    }
                    contx.partials[id] = [" " + text +  "';" + $__TEOL, $__uses ? $__uses.slice() : []];
                    pop_state(state);
                    // add usedTpls used inside include tpl to current usedTpls
                    for (var uses = contx.partials[id][1],usedTpl=0; usedTpl<uses.length; ++usedTpl)
                    {
                        if (-1 === $__uses.indexOf(uses[usedTpl]))
                            $__uses.push(uses[usedTpl]);
                    }
                    cb(null, align(contx.partials[id][0]));
                } );
            });
        }
        else
        {
            // add usedTpls used inside include tpl to current usedTpls
            for (var uses = contx.partials[id][1],usedTpl=0; usedTpl<uses.length; ++usedTpl)
            {
                if (-1 === $__uses.indexOf(uses[usedTpl]))
                    $__uses.push(uses[usedTpl]);
            }
            cb(null, align(contx.partials[id][0]));
        }
        return '';
    }
    else
    {
        // cache it
        if (!HAS.call(contx.partials, id) /*&& !HAS.call($__global.partials,id)*/)
        {
            tpl = get_template_contents(id, contx);
            tpl = get_separators(tpl);
            state = push_state();
            reset_state();
            contx.partials[id] = [" " + parse(tpl, $__leftTplSep, $__rightTplSep, false) + "';" + $__TEOL, $__uses ? $__uses.slice() : []];
            pop_state(state);
        }
        // add usedTpls used inside include tpl to current usedTpls
        for (var uses = contx.partials[id][1],usedTpl=0; usedTpl<uses.length; ++usedTpl)
        {
            if (-1 === $__uses.indexOf(uses[usedTpl]))
                $__uses.push(uses[usedTpl]);
        }
        return align(contx.partials[id][0] /*|| $__global.partials[id][0]*/);
    }
}
function t_block(block)
{
    block = block.split(',');
    var echoed = !(block.length>1 ? "false"===trim(block[1]) : false);
    block = trim(block[0]);
    if ($__strings && HAS.call($__strings, block)) block = $__strings[block];
    var ch = block.charAt(0);
    if (('"' === ch || "'" === ch) && (ch === block.charAt(block.length-1))) block = block.slice(1, -1); // quoted block

    $__allblocks.push([block, -1, -1, 0, $__openblocks[0][1], echoed]);
    $__allblockscnt[block] = $__allblockscnt[block] ? ($__allblockscnt[block]+1) : 1;
    $__blockptr = $__allblocks.length;
    $__openblocks.unshift([block, $__blockptr-1]);
    $__startblock = block;
    $__endblock = null;
    $__currentblock = block;
    $__locals[$__currentblock] = $__locals[$__currentblock] || {};
    $__variables[$__currentblock] = $__variables[$__currentblock] || {};
    return "' +  #BLOCK_" + block + "#";
}
function t_endblock()
{
    if (1 < $__openblocks.length)
    {
        var block = $__openblocks.shift();
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
function parse_constructs_async(s, cb)
{
    // reset lastIndex of regex, else it may fail where it should succeed
    re_controls.lastIndex = 0;
    var match = re_controls.exec(s), s2;
    if (!match)
    {
        cb(null, s);
        return;
    }
    parse_constructs(match, function(err, replace) {
        if (err)
        {
            cb(err, null);
            return;
        }
        s2 = s.slice(0, match.index) + replace;
        // continue until end
        parse_constructs_async(s.slice(match.index+match[0].length), function(err, replace2) {
            if (err)
            {
                cb(err, null);
                return;
            }
            cb(null, s2+replace2);
        });
    });
}
function parse_constructs(match, cb)
{
    cb = 'function' === typeof cb ? cb : null;
    /*
    main probelm with this function running async is the "include" directive
    which needs to read external files and may need to do it async,
    else rest parsing can be sync, specificaly args parsing can be synced even if original call is async since we can reasonably assume args will NOT contain "include" directive
    */
    var match0 = match[0],
        match1 = match[1],
        match2 = match[2],
        match3 = match[3],
        match4 = match[4],
        match5 = match[5],
        match6 = match[6],
        match7 = match[7],
        match8 = match[8],
        match9 = match[9],
        prefix = match1 || '',
        ctrl = match4 || match7 || '',
        rest = match9 || '',
        startParen = match8 || false,
        args = '',  out = '', paren = 0, l, i, ch, m, err,
        varname, tplvarname, expr, args2, usedTpl,
        parse_constructs_sync = function(m0,m1,m2,m3,m4,m5,m6,m7,m8,m9) {
            return parse_constructs([m0,m1,m2,m3,m4,m5,m6,m7,m8,m9]);
        };

    // parse parentheses and arguments, accurately
    if (startParen && startParen.length)
    {
        paren = 1; l = rest.length; i = 0;
        while (i < l && paren > 0)
        {
            ch = rest.charAt(i++);
            if ('(' === ch) ++paren;
            else if (')' === ch) --paren;
            if (paren > 0) args += ch;
        }
        rest = rest.slice(args.length+1);
    }
    args = trim(args);

    if (HAS.call($__directive_aliases, ctrl)) ctrl = $__directive_aliases[ctrl];
    m = $__directives.indexOf(ctrl);
    if (-1 < m)
    {
        switch (m)
        {
            case 22 /*'local'*/:
                varname = trim(args);
                tplvarname = $__variables[$__currentblock][varname];
                if (-1 !== $__reserved_var_names.indexOf(tplvarname))
                {
                    // should be different from 'this', 'data', .. as these are used internally
                    err = new Contemplate.Exception('Contemplate Parse: Use of reserved name as local variable name "'+tplvarname+'"');
                    if (cb)
                    {
                        cb(err, null);
                        return;
                    }
                    else
                    {
                        throw err;
                    }
                }
                local_variable(varname, null, true); // make it a literal local variable
                out = "';" + $__TEOL + align('var ' + varname + ';') + $__TEOL;
                break;
            case 0 /*'set'*/:
            case 20 /*'local_set'*/:
                args = args.replace(re_controls, parse_constructs_sync);
                args = split_arguments(args, ',');
                varname = trim(args.shift());
                expr = trim(args.join(','));
                if (20 === m && !is_local_variable(varname))
                {
                    local_variable(varname); // make it a local variable
                    varname = 'var ' + varname;
                }
                out = "';" + $__TEOL + align(varname + ' = ('+ expr +');') + $__TEOL;
                break;
            case 21 /*'get'*/:
                args = args.replace(re_controls, parse_constructs_sync);
                out = prefix + 'Contemplate.get(' + args + ')';
                break;
            case 1 /*'unset'*/:
                args = args.replace(re_controls, parse_constructs_sync);
                varname = args;
                if (varname && varname.length)
                {
                    varname = trim(varname);
                    out = "';" + $__TEOL + align('if ("undefined" !== typeof(' + varname + ')) delete ' + varname + ';') + $__TEOL;
                }
                else
                {
                    out = "';" + $__TEOL;
                }
                break;
            case 2 /*'isset'*/:
                args = args.replace(re_controls, parse_constructs_sync);
                varname = args;
                out = '("undefined" !== typeof(' + varname + ') && null !== ' + varname + ')';
                break;
            case 3 /*'if'*/:
                args = args.replace(re_controls, parse_constructs_sync);
                out = "';" + align([
                                ""
                                ,"if ("+args+")"
                                ,"{"
                                ,""
                            ].join($__TEOL));
                ++$__ifs;
                ++$__level;
                break;
            case 4 /*'elseif'*/:
                args = args.replace(re_controls, parse_constructs_sync);
                --$__level;
                out = "';" + align([
                                ""
                                ,"}"
                                ,"else if ("+args+")"
                                ,"{"
                                ,""
                            ].join($__TEOL));
                ++$__level;
                break;
            case 5 /*'else'*/:
                --$__level;
                out = "';" + align([
                                ""
                                ,"}"
                                ,"else"
                                ,"{"
                                ,""
                            ].join($__TEOL));
                ++$__level;
                break;
            case 6 /*'endif'*/:
                --$__ifs;
                --$__level;
                out = "';" + align([
                                ""
                                ,"}"
                                ,""
                            ].join($__TEOL));
                break;
            case 7 /*'for'*/:
                args = args.replace(re_controls, parse_constructs_sync);
                var for_expr = args, is_php_style = for_expr.indexOf(' as '),
                    is_python_style = for_expr.indexOf(' in '),
                    o, _o, kv, isAssoc
                ;

                if (-1 < is_python_style)
                {
                    for_expr = [for_expr.slice(0, is_python_style), for_expr.slice(is_python_style+4)];
                    o = trim(for_expr[1]);
                    _o = local_variable();
                    kv = for_expr[0].split(',');
                }
                else/*if ( -1 < is_php_style )*/
                {
                    for_expr = [for_expr.slice(0, is_php_style), for_expr.slice(is_php_style+4)];
                    o = trim(for_expr[0]);
                    _o = local_variable();
                    kv = for_expr[1].split('=>');
                }
                isAssoc = kv.length >= 2

                // http://jsperf.com/values-extraction/5
                // raw 'in' loop with .hasOwnProperty is faster than looping over Object.keys
                if (isAssoc)
                {
                    var k = trim(kv[0]),
                        v = trim(kv[1]),
                        _oK = local_variable(),
                        _k = local_variable(),
                        _l = local_variable()
                    ;
                    out = "';";
                    if (!is_local_variable(k))
                    {
                        local_variable(k);
                        out += $__TEOL + align('var ' + k + ';');
                    }
                    if (!is_local_variable(v))
                    {
                        local_variable(v);
                        out += $__TEOL + align('var ' + v + ';');
                    }
                    out += align([
                                    ""
                                    ,"var "+_o+" = "+o+", "+_oK+" = "+_o+" ? Object.keys("+_o+") : null,"
                                    ,"    "+_k+", "+_l+" = "+_o+" ? "+_oK+".length : 0;"
                                    ,"if ("+_l+")"
                                    ,"{"
                                    ,"    for ("+_k+"=0; "+_k+"<"+_l+"; ++"+_k+")"
                                    ,"    {"
                                    ,"        "+k+" = "+_oK+"["+_k+"]; "+v+" = "+_o+"["+k+"];"
                                    ,"        "
                                    ,""
                                ].join($__TEOL));
                    $__forType = 2;
                    $__level+=2;
                }
                else
                {
                    var v = trim(kv[0]),
                        _oV = local_variable(),
                        _arr = local_variable(),
                        _k = local_variable(),
                        _kk = local_variable(),
                        _l = local_variable()
                    ;
                    out = "';";
                    if (!is_local_variable(v))
                    {
                        local_variable(v);
                        out += $__TEOL + align('var ' + v + ';');
                    }
                    out += align([
                                    ""
                                    ,"var "+_o+" = "+o+", "+_arr+" = !!"+_o+".forEach,"
                                    ,"    "+_oV+" = "+_o+" ? ("+_arr+" ? "+_o+" : Object.keys("+_o+")) : null,"
                                    ,"    "+_k+", "+_kk+", "+_l+" = "+_oV+" ? "+_oV+".length : 0;"
                                    ,"if ("+_l+")"
                                    ,"{"
                                    ,"    for ("+_k+"=0; "+_k+"<"+_l+"; ++"+_k+")"
                                    ,"    {"
                                    ,"        "+_kk+" = "+_oV+"["+_k+"];"
                                    ,"        "+v+" = "+_arr+" ? "+_kk+" : "+_o+"["+_kk+"];"
                                    ,"        "
                                    ,""
                                ].join($__TEOL));
                    $__forType = 1;
                    $__level+=2;
                }
                ++$__loops;  ++$__loopifs;
                break;
            case 8 /*'elsefor'*/:
                /* else attached to  for loop */
                if (2 === $__forType)
                {
                    --$__loopifs;
                    $__level+=-2;
                    out = "';" + align([
                                    ""
                                    ,"    }"
                                    ,"}"
                                    ,"else"
                                    ,"{  "
                                    ,""
                                ].join($__TEOL));
                    ++$__level;
                }
                else
                {
                    --$__loopifs;
                    $__level+=-2;
                    out = "';" + align([
                                    ""
                                    ,"    }"
                                    ,"}"
                                    ,"else"
                                    ,"{  "
                                    ,""
                                ].join($__TEOL));
                    ++$__level;
                }
                break;
            case 9 /*'endfor'*/:
                if ($__loopifs === $__loops)
                {
                    if (2 === $__forType)
                    {
                        --$__loops; --$__loopifs;
                        $__level+=-2;
                        out = "';" + align([
                                        ""
                                        ,"    }"
                                        ,"}"
                                        ,""
                                    ].join($__TEOL));
                    }
                    else
                    {
                        --$__loops; --$__loopifs;
                        $__level+=-2;
                        out = "';" + align([
                                        ""
                                        ,"    }"
                                        ,"}"
                                        ,""
                                    ].join($__TEOL));
                    }
                }
                else
                {
                    --$__loops;
                    --$__level;
                    out = "';" + align([
                                    ""
                                    ,"}"
                                    ,""
                                ].join($__TEOL));
                }
                break;
            case 10 /*'extends'*/:
                var id = trim(args);
                if ($__strings && HAS.call($__strings, id)) id = $__strings[id];
                var ch = id.charAt(0);
                if (('"' === ch || "'" === ch) && (ch === id.charAt(id.length-1))) id = id.slice(1, -1); // quoted id
                $__extends = id;
                out = "';" + $__TEOL;
                break;
            case 11 /*'block'*/:
                out = t_block(args);
                break;
            case 12 /*'endblock'*/:
                out = t_endblock();
                break;
            case 13 /*'include'*/:
                out = cb ? '' : t_include(args);
                break;
            case 14 /*'super'*/:
                args = args.replace(re_controls, parse_constructs_sync);
                out = prefix + 'self.sprblock(' + args + ', data)';
                break;
            case 15 /*'getblock'*/:
                args = args.replace(re_controls, parse_constructs_sync);
                out = prefix + '__i__.block(' + args + ', data)';
                break;
            case 16 /*'iif'*/:
                args = split_arguments(args.replace(re_controls, parse_constructs_sync), ',');
                out = prefix + "(("+args[0]+") ? ("+args[1]+") : ("+args[2]+"))";
                break;
            case 17 /*'empty'*/:
                args = args.replace(re_controls, parse_constructs_sync);
                out = prefix + '(("undefined" === typeof(' + args + ')) || (null === ' + args + ') || Contemplate.empty(' + args + '))';
                break;
            case 18 /*'continue'*/:
            case 19 /*'break'*/:
                out = "';" + $__TEOL + align(18 === m ? 'continue;' : 'break;') + $__TEOL;
                break;
        }
        if (cb)
        {
            if (13 === m)/*'include'*/
            {
                // include may be async now
                t_include(args, function(err, out) {
                    if (err)
                    {
                        cb(err, null);
                        return;
                    }
                    parse_constructs_async(rest, function(err, rest2) {
                        if (err)
                        {
                            cb(err, null);
                            return;
                        }
                        cb(null, out + rest2);
                    });
                });
            }
            else
            {
                parse_constructs_async(rest, function(err, rest2) {
                    if (err)
                    {
                        cb(err, null);
                        return;
                    }
                    cb(null, out + rest2);
                });
            }
            return;
        }
        else
        {
            return out + rest.replace(re_controls, parse_constructs_sync);
        }
    }

    if (HAS.call($__context.plugins, ctrl) || HAS.call($__global.plugins, ctrl))
    {
        // allow custom plugins as template functions
        var pl = $__context.plugins[ctrl] || $__global.plugins[ctrl];
        args = args.replace(re_controls, parse_constructs_sync);
        out = pl instanceof Contemplate.InlineTemplate ? pl.render([args].concat(split_arguments(args, ','))) : 'Contemplate.plg_("' + ctrl + '"' + (!args.length ? '' : ','+args) + ')';
        if (cb)
        {
            parse_constructs_async(rest, function(err, rest2) {
                if (err)
                {
                    cb(err, null);
                    return;
                }
                cb(null, prefix + out + rest2);
            });
            return;
        }
        else
        {
            return prefix + out + rest.replace(re_controls, parse_constructs_sync);
        }
    }

    if (HAS.call($__aliases, ctrl)) ctrl = $__aliases[ctrl];
    args = args.replace(re_controls, parse_constructs_sync);
    // aliases and builtin functions
    switch (ctrl)
    {
        case 's': out = 'String(' + args + ')'; break;
        case 'n': out = 'parseInt(' + args + ')'; break;
        case 'f': out = 'parseFloat(' + args + ')'; break;
        case 'q': out = '"\'"+(' + args + ')+"\'"'; break;
        case 'qq': out = '\'"\'+(' + args + ')+\'"\''; break;
        case 'concat': out = 'String('+split_arguments(args, ',').join(')+String(')+')'; break;
        case 'is_array':
            args = split_arguments(args, ',');
            if (args.length > 1)
                out = "(("+args[1]+") ? '[object Array]' === Object.prototype.toString.call("+args[0]+") : '[object Array]' === Object.prototype.toString.call("+args[0]+") || '[object Object]' === Object.prototype.toString.call("+args[0]+"))";
            else
                out = "('[object Array]'===Object.prototype.toString.call("+args[0]+")||'[object Object]'===Object.prototype.toString.call("+args[0]+"))";
            break;
        case 'in_array':
            args = split_arguments(args, ',');
            out = '(-1<('+args[1]+').indexOf('+args[0]+'))';
            break;
        case 'tpl':
            args2 = split_arguments(args, ',');
            usedTpl = args2[0];
            if ('#STR_' === usedTpl.slice(0, 5) && HAS.call($__strings, usedTpl))
            {
                // only literal string support here
                usedTpl = $__strings[usedTpl].slice(1, -1); // without quotes
                if (-1 === $__uses.indexOf(usedTpl))
                    $__uses.push(usedTpl);
            }
            // no break
        default:
            if (HAS.call(Contemplate, ctrl) && ('function' === typeof Contemplate[ctrl]))
            {
                out = 'Contemplate.' + ctrl + '(' + args + ')';
            }
            else
            {
                out = ctrl + (startParen ? '('+args+')' : '');
            }
    }
    if (cb)
    {
        parse_constructs_async(rest, function(err, rest2) {
            if (err)
            {
                cb(err, null);
                return;
            }
            cb(null, prefix + out + rest2);
        });
        return;
    }
    else
    {
        return prefix + out + rest.replace(re_controls, parse_constructs_sync);
    }
}
function parse_blocks(s)
{
    var blocks = [], bl = $__allblocks.length,
        block, delims, tag, rep, tl, rl,
        pos1, pos2, off, containerblock, echoed, EOL = $__TEOL
    ;

    while (bl--)
    {
        delims = $__allblocks[bl];

        block = delims[0];
        pos1 = delims[1];
        pos2 = delims[2];
        off = delims[3];
        containerblock = delims[4];
        echoed = delims[5];
        tag = "#BLOCK_" + block + "#";
        rep = echoed ? "__i__.block('" + block + "', data);" : "'';";
        tl = tag.length; rl = rep.length;

        if (-1 < containerblock)
        {
            // adjust the ending position of the container block (if nested)
            // to compensate for the replacements in this (nested) block
            $__allblocks[containerblock][3] += rl - (pos2-pos1+1);
        }
        // adjust the ending position of this block (if nested)
        // to compensate for the replacements of any (nested) block(s)
        pos2 += off;

        if (1 === $__allblockscnt[block])
        {
            // 1st occurance, block definition
            blocks.push([block, TT_BLOCK.render({
             'BLOCKCODE'    : s.slice( pos1+tl, pos2-tl-1 ) + "';"
            })]);
        }
        s = s.slice(0, pos1) + rep + s.slice(pos2+1);
        if (1 <= $__allblockscnt[block]) --$__allblockscnt[block];
    }
    //$__allblocks = null; $__allblockscnt = null; $__openblocks = null;

    return [s, blocks];
}
function parse_variable(s, i, l)
{
    if (ALPHA.test(s[i]))
    {
        var strings = {}, variables = [], subvariables,
            id, variable, property, variable_raw, variable_main, variable_rest,
            len, lp, bracket, delim, ch,
            str_, q, escaped, si, is_prop_access, tok,
            strid, sub, space = 0, hasStrings = false
        ;

        // main variable
        variable = s.charAt(i++);
        while (i < l && ALPHANUM.test(ch=s.charAt(i)))
        {
            variable += ch;
            ++i;
        }

        variable_raw = variable;
        // transform into tpl variable
        //variable_main = "data['"+variable_raw+"']";
        variable_main = "data."+variable_raw;
        variable_rest = '';
        ++$__idcnt;
        id = "#VAR_"+$__idcnt+"#";
        len = variable_raw.length;
        $__variables[$__currentblock][id] = variable_raw;

        // extra space
        space = 0;
        while (i < l && SPACE.test(s.charAt(i)))
        {
            ++space;
            ++i;
        }

        // optional properties
        while (i < l && ('.' === s.charAt(i) || '[' === s.charAt(i) || '->' === s.substring(i, i+2)))
        {
            delim = s.charAt(i++);
            // -> (php) object notation property
            if ('-' === delim) delim += s.charAt(i++);

            // extra space
            while (i < l && SPACE.test(s.charAt(i)))
            {
                ++space;
                ++i;
            }

            // alpha-numeric dot property
            if ('.' === delim)
            {
                // property
                property = '';
                while (i < l && ALPHANUM.test(s.charAt(i)))
                {
                    property += s.charAt(i++);
                }
                lp = property.length;
                if (lp)
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

            // alpha-numeric (php) object notation property
            else if ('->' === delim /*&& ALPHA.test(s.charAt(i))*/)
            {
                // property
                property = '';
                while (i < l && ALPHANUM.test(s.charAt(i)))
                {
                    property += s.charAt(i++);
                }
                lp = property.length;
                if (lp)
                {
                    // transform into tpl variable object property
                    //variable_rest += "['" + property + "']";
                    variable_rest += "." + property;
                    len += space + 2 + lp;
                    space = 0;
                }
                else
                {
                    break;
                }
            }

            // bracketed property
            else if ('[' === delim)
            {
                bracket = '';
                while (i < l)
                {
                    ch = s.charAt(i);

                    // spaces
                    if (SPACE.test(ch))
                    {
                        ++space;
                        ++i;
                    }
                    // literal string property
                    else if ('"' === ch || "'" === ch)
                    {
                        //property = parse_string(s, ch, i+1, l);
                        str_ = q = ch; escaped = false; si = i+1;
                        while (si < l)
                        {
                            str_ += (ch=s.charAt(si++));
                            if (q === ch && !escaped)  break;
                            escaped = (!escaped && '\\' === ch);
                        }
                        property = str_;
                        ++$__idcnt;
                        strid = "#STR_"+$__idcnt+"#";
                        strings[strid] = property;
                        lp = property.length;
                        i += lp;
                        len += space + lp;
                        space = 0;
                        hasStrings = true;
                        bracket += strid;
                    }
                    // numeric array property
                    else if (NUM.test(ch))
                    {
                        property = s.charAt(i++);
                        while (i < l && NUM.test(s.charAt(i)))
                        {
                            property += s.charAt(i++);
                        }
                        lp = property.length;
                        len += space + lp;
                        space = 0;
                        bracket += property;
                    }
                    // sub-variable as property
                    else if ('$' === ch)
                    {
                        sub = s.slice(i+1);
                        subvariables = parse_variable(sub, 0, sub.length);
                        if (subvariables)
                        {
                            // transform into tpl variable property
                            property = subvariables[subvariables.length-1];
                            lp = property[4];
                            i += lp + 1;
                            len += space + 1 + lp;
                            space = 0;
                            variables = variables.concat(subvariables);
                            hasStrings = hasStrings || property[5];
                            bracket += property[0];
                        }
                        else
                        {
                            bracket += ch;
                            ++len;
                            ++i;
                        }
                    }
                    // identifiers
                    else if (ALPHA.test(ch))
                    {
                        len += space + 1;
                        ++i;
                        if (space > 0)
                        {
                            bracket += " ";
                            space = 0;
                        }
                        is_prop_access = (2 < i && '-' === s.charAt(i-3) && '>' === s.charAt(i-2));
                        tok = ch;
                        while (i < l && ALPHANUM.test(ch=s.charAt(i)))
                        {
                            ++i;
                            ++len;
                            tok += ch;
                        }
                        if (!is_prop_access && 'as' !== tok && 'in' !== tok && 'null' !== tok && 'false' !== tok && 'true' !== tok)
                        {
                            tok = '#ID_'+tok+'#';
                        }
                        bracket += tok;
                    }
                    // close bracket
                    else if (']' === ch)
                    {
                        variable_rest += delim + bracket.replace(re_controls, function(m0,m1,m2,m3,m4,m5,m6,m7,m8,m9) {
                            return parse_constructs([m0,m1,m2,m3,m4,m5,m6,m7,m8,m9]);
                        }) + ch;
                        len += space + 2;
                        space = 0;
                        ++i;
                        break;
                    }
                    // rest
                    else
                    {
                        bracket += ch;
                        ++len;
                        ++i;
                    }
                }
            }

            // extra space
            while (i < l && SPACE.test(s.charAt(i)))
            {
                ++space;
                ++i;
            }
        }

        variables.push([id, variable_raw, variable_main, variable_rest, len, hasStrings, strings]);
        return variables
    }
    return null;
}
var str_re = /#STR_\d+#/g;
function parse_async(tpl, leftTplSep, rightTplSep, withblocks, cb)
{
    var t1, t2, p1, p2, l1, l2, len, parsed, s, i,
        tag, tagTpl, strings, variables, hasVariables, hasStrings, varname, id,
        countl, index, ch, out, tok, v, tokv,
        multisplit_re = InlineTemplate.multisplit_re,
        ind, q, str_, escaped, si, space,
        blockTag, hasBlock, notFoundBlock,
        special_chars = "$'\" \n\r\t\v\0%",
        non_compatibility_mode = true,
        is_prop_access, isphp, isjs, ispy,
        code, indent, l3, indenttype, m
    ;

    t1 = leftTplSep; l1 = t1.length;
    t2 = rightTplSep; l2 = t2.length;
    parsed = '';

    var parse_chunk = function parse_chunk() {
        if (!tpl || !tpl.length)
        {
            parse_finish();
            return;
        }

        p1 = tpl.indexOf(t1);
        if (-1 === p1)
        {
            s = tpl;
            if ($__escape) s = s.split("\\").join("\\\\"); // escape escapes
            parsed += s
                .split("'").join("\\'")  // escape single quotes accurately (used by parse function)
                .split(/*"\n"*/ /\n/).join($__preserveLines) // preserve lines
            ;

            parse_finish();
            return;
        }

        p2 = tpl.indexOf(t2, p1+l1);
        if (-1 === p2) p2 = tpl.length;

        if (p1 > 0)
        {
            s = tpl.slice(0, p1);
            if ($__escape) s = s.split("\\").join("\\\\"); // escape escapes
            parsed += s
                .split("'").join("\\'")  // escape single quotes accurately (used by parse function)
                .split(/*"\n"*/ /\n/).join($__preserveLines) // preserve lines
            ;
        }

        // php literal code block
        isphp = 'php:' === tpl.slice(p1+l1, p1+l1+4);
        // js literal code block
        isjs = 'js:' === tpl.slice(p1+l1, p1+l1+3);
        // py literal code block
        ispy = 'py:' === tpl.slice(p1+l1, p1+l1+3);
        if (isphp || isjs || ispy)
        {
            // include if in same language else ignore
            if (isjs)
            {
                if ('=' === tpl.slice(p1+l1+3, p1+l1+4))
                {
                    parsed += "';" + align("\n/* js code start */") + align("\n__p__ += String(" + trim(tpl.slice(p1+l1+4, p2)) + ");") + align("\n/* js code end */\n__p__ += '");
                }
                else
                {
                    indent = 0; l3 = 0; indenttype = 'none';
                    if (m = tpl.slice(p1+l1+3).match(INDENT))
                    {
                        indenttype = m[1];
                        indent = parseInt(m[2]);
                        l3 = m[0].length;
                    }
                    code = remove_blank_lines(tpl.slice(p1+l1+3+l3, p2));
                    if ('predent' === indenttype)
                    {
                        $__level = Math.max(0, $__level + indent);
                    }
                    parsed += "';" + align("\n/* js code start */");
                    if (trim(code).length)
                    {
                        parsed += "\n" + align(code);
                    }
                    if ('postdent' === indenttype)
                    {
                        $__level = Math.max(0, $__level + indent);
                    }
                    parsed += align("\n/* js code end */\n__p__ += '");
                }
            }
            tpl = tpl.slice(p2+l2);
            parse_chunk();
            return;
        }

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

        while (index < countl)
        {
            ch = s.charAt(index++);
            ind = special_chars.indexOf(ch);

            if (-1 < ind)
            {
                // variable
                if (0 === ind)
                {
                    if (space > 0)
                    {
                        out += " ";
                        space = 0;
                    }
                    tok = parse_variable(s, index, countl);
                    if (tok)
                    {
                        for (v=0,len=tok.length; v<len; ++v)
                        {
                            tokv = tok[v];
                            id = tokv[0];
                            //$__variables[$__currentblock][id] = tokv[1];
                            if (tokv[5]) strings = merge(strings, tokv[6]);
                        }
                        out += id;
                        index += tokv[4];
                        variables = variables.concat(tok);
                        hasVariables = true;
                        hasStrings = hasStrings || tokv[5];
                    }
                    else
                    {
                        out += '$';
                    }
                }
                // literal string
                else if (3 > ind)
                {
                    if (space > 0)
                    {
                        out += " ";
                        space = 0;
                    }
                    //tok = parse_string(s, ch, index, countl);
                    str_ = q = ch; escaped = false; si = index;
                    while (si < countl)
                    {
                        str_ += (ch=s.charAt(si++));
                        if (q === ch && !escaped)  break;
                        escaped = (!escaped && '\\' === ch);
                    }
                    tok = str_;
                    ++$__idcnt;
                    id = "#STR_"+$__idcnt+"#";
                    strings[id] = tok;
                    out += id;
                    index += tok.length-1;
                    hasStrings = true;
                }
                // spaces
                else if (9 > ind)
                {
                    ++space;
                }
                // directive or identifier or atom in compatibility mode
                else//if (9 === ind)
                {
                    if (space > 0)
                    {
                        out += " ";
                        space = 0;
                    }
                    q = ch;
                    if (non_compatibility_mode || index >= countl || !ALPHA.test(ch=s.charAt(index)))
                    {
                        out += q;
                        continue;
                    }
                    ++index;
                    tok = ch;
                    while (index < countl && ALPHANUM.test(ch = s.charAt(index)))
                    {
                        ++index;
                        tok += ch;
                    }
                    tok = '#ID_'+tok+'#';
                    out += tok;
                }
            }
            // directive or identifier or atom and not variable object property access
            else if (non_compatibility_mode && ALPHA.test(ch))
            {
                if (space > 0)
                {
                    out += " ";
                    space = 0;
                }
                is_prop_access = (2 < index && '-' === s.charAt(index-3) && '>' === s.charAt(index-2));
                tok = ch;
                while (index < countl && ALPHANUM.test(ch=s.charAt(index)))
                {
                    ++index;
                    tok += ch;
                }
                if (!is_prop_access && 'as' !== tok && 'in' !== tok && 'null' !== tok && 'false' !== tok && 'true' !== tok)
                {
                    tok = '#ID_'+tok+'#';
                }
                out += tok;
            }
            // rest, bypass
            else
            {
                if (space > 0)
                {
                    out += " ";
                    space = 0;
                }
                out += ch;
            }
        }

        // fix literal data notation, not needed here
        //out = str_replace(array('{', '}', '[', ']', ':'), array('array(', ')','array(', ')', '=>'), out);
        // fix pending "->" arrow-notation for object variable
        out = out.split('->').join('.');

        tag = "\t" + out + "\v";

        $__startblock = null;  $__endblock = null; $__blockptr = -1;
        $__strings = strings;

        parse_controls();
    };
    var after_parse_controls = function after_parse_controls() {
        // check for blocks
        if ($__startblock)
        {
            $__startblock = "#BLOCK_"+$__startblock+"#";
            hasBlock = true;
        }
        else if ($__endblock)
        {
            $__endblock = "#/BLOCK_"+$__endblock+"#";
            hasBlock = true;
        }
        notFoundBlock = hasBlock;

        // replacements
        /*.replace( re_repls, "' + ($1) + '" );*/
        if (9 === tag.charCodeAt(0) && 11 === tag.charCodeAt(tag.length-1))
            tag = "' + ("+trim(tag.slice(1, -1))+") + '";

        if (hasVariables)
        {
            // replace variables
            for (v=variables.length-1; v>=0; --v)
            {
                id = variables[v][0]; varname = variables[v][1];
                tag = tag
                    .split(id+'__RAW__').join(varname)
                    .split(id).join((
                        HAS.call($__locals[$__currentblock], varname)
                        ? ((2 === $__locals[$__currentblock][varname] ? '' : '_loc_') + varname) /* local (loop) variable */
                        : (variables[v][2]) /* default (data) variable */
                        ) + variables[v][3])
                ;
            }
        }

        if (hasStrings)
        {
            // replace strings (accurately)
            tagTpl = multisplit_re(tag, str_re);
            tag = '';
            for (v=0,len=tagTpl.length; v<len; ++v)
            {
                if (tagTpl[v][0])
                {
                    // and replace blocks (accurately)
                    if (notFoundBlock)
                    {
                        if ($__startblock)
                        {
                            blockTag = tagTpl[v][1].indexOf($__startblock);
                            if (-1 !== blockTag)
                            {
                                $__allblocks[$__blockptr-1][1] = blockTag + parsed.length + tag.length;
                                notFoundBlock = false;
                            }
                        }
                        else//if ($__endblock)
                        {
                            blockTag = tagTpl[v][1].indexOf($__endblock);
                            if (-1 !== blockTag)
                            {
                                $__allblocks[$__blockptr-1][2] = blockTag + parsed.length + tag.length + $__endblock.length;
                                notFoundBlock = false;
                            }
                        }
                    }
                    tag += tagTpl[v][1];
                }
                else
                {
                    tag += strings[tagTpl[v][1]];
                }
            }
        }
        else if (hasBlock)
        {
            // replace blocks (accurately)
            if ($__startblock)
                $__allblocks[$__blockptr-1][1] = parsed.length + tag.indexOf($__startblock);
            else//if ($__endblock)
                $__allblocks[$__blockptr-1][2] = parsed.length + tag.indexOf($__endblock) + $__endblock.length;
        }

        // replace tpl separators
        if (/*"\v"*/11 === tag.charCodeAt(tag.length-1))
        {
            tag = tag.slice(0, -1) + align($__tplEnd);
        }
        if (/*"\t"*/9 === tag.charCodeAt(0))
        {
            tag = $__tplStart + tag.slice(1);
            if (hasBlock)
            {
                // update blocks (accurately)
                blockTag = $__tplStart.length-1;
                if ($__startblock)
                    $__allblocks[$__blockptr-1][1] += blockTag;
                else//if ($__endblock)
                    $__allblocks[$__blockptr-1][2] += blockTag;
            }
        }

        parsed += tag;

        // continue until end
        parse_chunk();
    };
    var parse_controls = function parse_controls() {
        // replace constructs, functions, etc..
        parse_constructs_async(tag, function(err, repl) {
            if (err)
            {
                cb(err, null);
                return;
            }
            tag = repl;
            after_parse_controls();
        });
    };
    var parse_finish = function parse_finish() {
        cb(null, false !== withblocks ? ($__allblocks.length>0 ? parse_blocks(parsed) : [parsed, []]) : parsed);
    };
    parse_chunk();
}
function parse(tpl, leftTplSep, rightTplSep, withblocks, cb)
{
    if ('function' === typeof cb)
    {
        parse_async(tpl, leftTplSep, rightTplSep, withblocks, cb);
        return;
    }
    var t1, t2, p1, p2, l1, l2, len, parsed, s, i,
        tag, tagTpl, strings, variables, hasVariables, hasStrings, varname, id,
        countl, index, ch, out, tok, v, tokv,
        multisplit_re = InlineTemplate.multisplit_re,
        ind, q, str_, escaped, si, space,
        blockTag, hasBlock, notFoundBlock,
        special_chars = "$'\" \n\r\t\v\0%",
        non_compatibility_mode = true,
        is_prop_access, isphp, isjs, ispy,
        code, indent, l3, indenttype, m
    ;

    t1 = leftTplSep; l1 = t1.length;
    t2 = rightTplSep; l2 = t2.length;
    parsed = '';
    while (tpl && tpl.length)
    {
        p1 = tpl.indexOf(t1);
        if (-1 === p1)
        {
            s = tpl;
            if ($__escape) s = s.split("\\").join("\\\\"); // escape escapes
            parsed += s
                .split("'").join("\\'")  // escape single quotes accurately (used by parse function)
                .split(/*"\n"*/ /\n/).join($__preserveLines) // preserve lines
            ;
            break;
        }
        p2 = tpl.indexOf(t2, p1+l1);
        if (-1 === p2) p2 = tpl.length;

        if (p1 > 0)
        {
            s = tpl.slice(0, p1);
            if ($__escape) s = s.split("\\").join("\\\\"); // escape escapes
            parsed += s
                .split("'").join("\\'")  // escape single quotes accurately (used by parse function)
                .split(/*"\n"*/ /\n/).join($__preserveLines) // preserve lines
            ;
        }

        // php literal code block
        isphp = 'php:' === tpl.slice(p1+l1, p1+l1+4);
        // js literal code block
        isjs = 'js:' === tpl.slice(p1+l1, p1+l1+3);
        // py literal code block
        ispy = 'py:' === tpl.slice(p1+l1, p1+l1+3);
        if (isphp || isjs || ispy)
        {
            // include if in same language else ignore
            if (isjs)
            {
                if ('=' === tpl.slice(p1+l1+3, p1+l1+4))
                {
                    parsed += "';" + align("\n/* js code start */") + align("\n__p__ += String(" + trim(tpl.slice(p1+l1+4, p2)) + ");") + align("\n/* js code end */\n__p__ += '");
                }
                else
                {
                    indent = 0; l3 = 0; indenttype = 'none';
                    if (m = tpl.slice(p1+l1+3).match(INDENT))
                    {
                        indenttype = m[1];
                        indent = parseInt(m[2]);
                        l3 = m[0].length;
                    }
                    code = remove_blank_lines(tpl.slice(p1+l1+3+l3, p2));
                    if ('predent' === indenttype)
                    {
                        $__level = Math.max(0, $__level + indent);
                    }
                    parsed += "';" + align("\n/* js code start */");
                    if (trim(code).length)
                    {
                        parsed += "\n" + align(code);
                    }
                    if ('postdent' === indenttype)
                    {
                        $__level = Math.max(0, $__level + indent);
                    }
                    parsed += align("\n/* js code end */\n__p__ += '");
                }
            }
            tpl = tpl.slice(p2+l2);
            continue;
        }

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

        while (index < countl)
        {
            ch = s.charAt(index++);
            ind = special_chars.indexOf(ch);

            if (-1 < ind)
            {
                // variable
                if (0 === ind)
                {
                    if (space > 0)
                    {
                        out += " ";
                        space = 0;
                    }
                    tok = parse_variable(s, index, countl);
                    if (tok)
                    {
                        for (v=0,len=tok.length; v<len; ++v)
                        {
                            tokv = tok[v];
                            id = tokv[0];
                            //$__variables[$__currentblock][id] = tokv[1];
                            if (tokv[5]) strings = merge(strings, tokv[6]);
                        }
                        out += id;
                        index += tokv[4];
                        variables = variables.concat(tok);
                        hasVariables = true;
                        hasStrings = hasStrings || tokv[5];
                    }
                    else
                    {
                        out += '$';
                    }
                }
                // literal string
                else if (3 > ind)
                {
                    if (space > 0)
                    {
                        out += " ";
                        space = 0;
                    }
                    //tok = parse_string(s, ch, index, countl);
                    str_ = q = ch; escaped = false; si = index;
                    while (si < countl)
                    {
                        str_ += (ch=s.charAt(si++));
                        if (q === ch && !escaped)  break;
                        escaped = (!escaped && '\\' === ch);
                    }
                    tok = str_;
                    ++$__idcnt;
                    id = "#STR_"+$__idcnt+"#";
                    strings[id] = tok;
                    out += id;
                    index += tok.length-1;
                    hasStrings = true;
                }
                // spaces
                else if (9 > ind)
                {
                    ++space;
                }
                // directive or identifier or atom in compatibility mode
                else//if (9 === ind)
                {
                    if (space > 0)
                    {
                        out += " ";
                        space = 0;
                    }
                    q = ch;
                    if (non_compatibility_mode || index >= countl || !ALPHA.test(ch=s.charAt(index)))
                    {
                        out += q;
                        continue;
                    }
                    ++index;
                    tok = ch;
                    while (index < countl && ALPHANUM.test(ch = s.charAt(index)))
                    {
                        ++index;
                        tok += ch;
                    }
                    tok = '#ID_'+tok+'#';
                    out += tok;
                }
            }
            // directive or identifier or atom and not variable object property access
            else if (non_compatibility_mode && ALPHA.test(ch))
            {
                if (space > 0)
                {
                    out += " ";
                    space = 0;
                }
                is_prop_access = (2 < index && '-' === s.charAt(index-3) && '>' === s.charAt(index-2));
                tok = ch;
                while (index < countl && ALPHANUM.test(ch=s.charAt(index)))
                {
                    ++index;
                    tok += ch;
                }
                if (!is_prop_access && 'as' !== tok && 'in' !== tok && 'null' !== tok && 'false' !== tok && 'true' !== tok)
                {
                    tok = '#ID_'+tok+'#';
                }
                out += tok;
            }
            // rest, bypass
            else
            {
                if (space > 0)
                {
                    out += " ";
                    space = 0;
                }
                out += ch;
            }
        }

        // fix literal data notation, not needed here
        //out = str_replace(array('{', '}', '[', ']', ':'), array('array(', ')','array(', ')', '=>'), out);
        // fix pending "->" arrow-notation for object variable
        out = out.split('->').join('.');

        tag = "\t" + out + "\v";

        $__startblock = null;  $__endblock = null; $__blockptr = -1;
        $__strings = strings;

        // replace constructs, functions, etc..
        tag = tag.replace(re_controls, function(m0,m1,m2,m3,m4,m5,m6,m7,m8,m9) {
            return parse_constructs([m0,m1,m2,m3,m4,m5,m6,m7,m8,m9]);
        });

        // check for blocks
        if ($__startblock)
        {
            $__startblock = "#BLOCK_"+$__startblock+"#";
            hasBlock = true;
        }
        else if ($__endblock)
        {
            $__endblock = "#/BLOCK_"+$__endblock+"#";
            hasBlock = true;
        }
        notFoundBlock = hasBlock;

        // replacements
        /*.replace( re_repls, "' + ($1) + '" );*/
        if (9 === tag.charCodeAt(0) && 11 === tag.charCodeAt(tag.length-1))
            tag = "' + ("+trim(tag.slice(1,-1))+") + '";

        if (hasVariables)
        {
            // replace variables
            for (v=variables.length-1; v>=0; --v)
            {
                id = variables[v][0]; varname = variables[v][1];
                tag = tag
                    .split(id+'__RAW__').join(varname)
                    .split(id).join((
                        HAS.call($__locals[$__currentblock], varname)
                        ? ((2 === $__locals[$__currentblock][varname] ? '' : '_loc_') + varname) /* local (loop) variable */
                        : (variables[v][2]) /* default (data) variable */
                        ) + variables[v][3])
                ;
            }
        }

        if (hasStrings)
        {
            // replace strings (accurately)
            tagTpl = multisplit_re(tag, str_re);
            tag = '';
            for (v=0,len=tagTpl.length; v<len; ++v)
            {
                if (tagTpl[v][0])
                {
                    // and replace blocks (accurately)
                    if (notFoundBlock)
                    {
                        if ($__startblock)
                        {
                            blockTag = tagTpl[v][1].indexOf($__startblock);
                            if (-1 !== blockTag)
                            {
                                $__allblocks[$__blockptr-1][1] = blockTag + parsed.length + tag.length;
                                notFoundBlock = false;
                            }
                        }
                        else//if ($__endblock)
                        {
                            blockTag = tagTpl[v][1].indexOf($__endblock);
                            if (-1 !== blockTag)
                            {
                                $__allblocks[$__blockptr-1][2] = blockTag + parsed.length + tag.length + $__endblock.length;
                                notFoundBlock = false;
                            }
                        }
                    }
                    tag += tagTpl[v][1];
                }
                else
                {
                    tag += strings[tagTpl[v][1]];
                }
            }
        }
        else if (hasBlock)
        {
            // replace blocks (accurately)
            if ($__startblock)
                $__allblocks[$__blockptr-1][1] = parsed.length + tag.indexOf($__startblock);
            else//if ($__endblock)
                $__allblocks[$__blockptr-1][2] = parsed.length + tag.indexOf($__endblock) + $__endblock.length;
        }

        // replace tpl separators
        if (/*"\v"*/11 === tag.charCodeAt(tag.length-1))
        {
            tag = tag.slice(0,-1) + align($__tplEnd);
        }
        if (/*"\t"*/9 === tag.charCodeAt(0))
        {
            tag = $__tplStart + tag.slice(1);
            if (hasBlock)
            {
                // update blocks (accurately)
                blockTag = $__tplStart.length-1;
                if ($__startblock)
                    $__allblocks[$__blockptr-1][1] += blockTag;
                else//if ($__endblock)
                    $__allblocks[$__blockptr-1][2] += blockTag;
            }
        }

        parsed += tag;
    }
    return false !== withblocks ? ($__allblocks.length>0 ? parse_blocks(parsed) : [parsed, []]) : parsed;
}
function get_cached_template_name(id, ctx, cacheDir)
{
    var filename, path;
    if ((isNode || isXPCOM) && (-1 !== id.indexOf('/') || -1 !== id.indexOf('\\')))
    {
        filename = basename(id);
        path = trim(dirname(id), '/\\');
        if (path.length) path += '/';
    }
    else
    {
        filename = id;
        path = '';
    }
    return cacheDir + path + filename.replace(UNDERLN, '_') + '_tpl__' + ctx.replace(UNDERLN, '_') + '.js';
}
function get_cached_template_class(id, ctx)
{
    var filename;
    if ((isNode || isXPCOM) && (-1 !== id.indexOf('/') || -1 !== id.indexOf('\\')))
    {
        filename = basename(id);
    }
    else
    {
        filename = id;
    }
    return 'Contemplate_' + filename.replace(UNDERLN, '_') + '__' + ctx.replace(UNDERLN, '_');
}
function get_template_contents(id, contx, cb)
{
    cb = 'function' === typeof cb ? cb : null;
    var proceed = function() {
        var template = contx.templates[id] || $__global.templates[id] || null;
        if (!template)
        {
            if (cb)
            {
                // async
                cb(null, '');
            }
            return '';
        }

        if (template[1]) //inline tpl
        {
            if (cb)
            {
                // async
                cb(null, template[0]);
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
            if (isNode || isXPCOM)
            {
                if (cb)
                {
                    // async
                    fread_async(template[0], contx.encoding, function(err, data) {
                        if (err)
                        {
                            cb(err, '');
                        }
                        else
                        {
                            cb(null, data);
                        }
                    });
                    return '';
                }
                else
                {
                    // sync
                    return fread(template[0], contx.encoding);
                }
            }
            // client-side js and #id of DOM script-element given as template holder
            else if ('#' === template[0].charAt(0))
            {
                if (cb)
                {
                    // async
                    cb(null, window.document.getElementById(template[0].slice(1)).innerHTML || '');
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
                if (cb)
                {
                    // async
                    fread_async(template[0], contx.encoding, function(err, data) {
                        if (err)
                        {
                            cb(err, null);
                        }
                        else
                        {
                            cb(null, data);
                        }
                    });
                    return '';
                }
                else
                {
                    // sync
                    return fread(template[0], contx.encoding);
                }
            }
        }
    };
    if (!Contemplate.hasTpl(id, contx.id))
    {
        if (cb)
        {
            Contemplate.findTpl(id, contx.id, function(err, found) {
                if (err || !found)
                {
                    cb(null, '');
                    return;
                }
                var tpldef = {};
                tpldef[id] = found;
                Contemplate.add(tpldef, contx.id);
                proceed();
            });
        }
        else
        {
            // supposed to be sync operation if no callback given
            var found = Contemplate.findTpl(id, contx.id);
            if (!found) return '';
            var tpldef = {};
            tpldef[id] = found;
            Contemplate.add(tpldef, contx.id);
            return proceed();
        }
    }
    else
    {
        return proceed();
    }
}
function create_template_render_function(id, contx, seps, cb)
{
    cb = 'function' === typeof cb ? cb : null;
    var tpl, blocks, funcs = {}, b, bl, func, renderf, EOL = $__TEOL;

    if (cb)
    {
        get_template_contents(id, contx, function(err, tpl) {
            if (err)
            {
                cb(err, null);
                return;
            }
            tpl = get_separators(tpl, seps);
            reset_state();
            parse(tpl, $__leftTplSep, $__rightTplSep, true, function(err, blocks) {
                if (err)
                {
                    cb(err, null);
                    return;
                }
                clear_state();

                renderf = blocks[0];
                blocks = blocks[1];
                bl = blocks.length;

               // Convert the template into pure JavaScript
                func = TT_FUNC.render({
                 'FCODE'         : $__extends ? "__p__ = '';" : "__p__ = '" + renderf + "';"
                });

                // defined blocks
                for (b=0; b<bl; ++b) funcs[blocks[b][0]] = FUNC("Contemplate,data,self,__i__", blocks[b][1]);

                cb(null, [FUNC("Contemplate", func), funcs]);
            });
        });
        return null;
    }
    else
    {
        tpl = get_template_contents(id, contx);
        tpl = get_separators(tpl, seps);
        reset_state();
        blocks = parse(tpl, $__leftTplSep, $__rightTplSep, true);
        clear_state();

        renderf = blocks[0];
        blocks = blocks[1];
        bl = blocks.length;

       // Convert the template into pure JavaScript
        func = TT_FUNC.render({
         'FCODE'         : $__extends ? "__p__ = '';" : "__p__ = '" + renderf + "';"
        });

        // defined blocks
        for (b=0; b<bl; ++b) funcs[blocks[b][0]] = FUNC("Contemplate,data,self,__i__", blocks[b][1]);

        return [FUNC("Contemplate", func), funcs];
    }
}
function create_cached_template(id, contx, filename, classname, seps, cb)
{
    cb = 'function' === typeof cb ? cb : null;
    var tpl, funcs = {}, prefixCode, extendCode, renderCode,
        b, bl, sblocks, blocks, renderf, EOL = $__TEOL;

    if (cb)
    {
        get_template_contents(id, contx, function(err, tpl) {
            if (err)
            {
                cb(err, null);
                return;
            }
            tpl = get_separators(tpl, seps);
            reset_state();
            parse(tpl, $__leftTplSep, $__rightTplSep, true, function(err, blocks) {
                if (err)
                {
                    cb(err, null);
                    return;
                }
                clear_state();

                renderf = blocks[0];
                blocks = blocks[1];
                bl = blocks.length;

                // tpl-defined blocks
                sblocks = [];
                for (b=0; b<bl; ++b)
                    sblocks.push(EOL + TT_BlockCode.render({
                     'BLOCKNAME'            : blocks[b][0]
                    ,'BLOCKMETHODNAME'      : blocks[b][0]
                    ,'BLOCKMETHODCODE'      : align(blocks[b][1], 1)
                    }));
                sblocks = sblocks.length ? EOL + "self._blocks = {" + EOL + sblocks.join(',' + EOL) + EOL + "};" + EOL : '';

                renderCode = TT_RCODE.render({
                 'RCODE'                : $__extends ? "__p__ = '';" : "__p__ += '" + renderf + "';"
                });
                //extendCode = $__extends ? "self.extend('" + $__extends + "');" : '';
                extendCode = $__extends ? "self._extendsTpl = '" + $__extends + "';" : '';
                extendCode += EOL + "self._usesTpl = [" + ($__uses.length ? "'"+$__uses.join("','")+"'" : '') + "];";
                prefixCode = contx.prefix ? contx.prefix : '';

              // generate tpl class
                var classCode = TT_ClassCode.render({
                 'CLASSNAME'            : classname
                ,'TPLID'                : id
                ,'PREFIXCODE'           : prefixCode
                ,'EXTENDCODE'           : align(extendCode, 1)
                ,'BLOCKS'               : align(sblocks, 1)
                ,'RENDERCODE'           : align(renderCode, 1)
                });
                fwrite_async(filename, classCode, contx.encoding, function(err, res) {
                    cb(err, res);
                });
            });
        });
        return null;
    }
    else
    {
        tpl = get_template_contents(id, contx);
        tpl = get_separators(tpl, seps);
        reset_state();
        blocks = parse(tpl, $__leftTplSep, $__rightTplSep, true);
        clear_state();

        renderf = blocks[0];
        blocks = blocks[1];
        bl = blocks.length;

        // tpl-defined blocks
        sblocks = [];
        for (b=0; b<bl; ++b)
            sblocks.push(EOL + TT_BlockCode.render({
             'BLOCKNAME'            : blocks[b][0]
            ,'BLOCKMETHODNAME'      : blocks[b][0]
            ,'BLOCKMETHODCODE'      : align(blocks[b][1], 1)
            }));
        sblocks = sblocks.length ? EOL + "self._blocks = {" + EOL + sblocks.join(',' + EOL) + EOL + "};" + EOL : '';

        renderCode = TT_RCODE.render({
         'RCODE'                : $__extends ? "__p__ = '';" : "__p__ += '" + renderf + "';"
        });
        //extendCode = $__extends ? "self.extend('" + $__extends + "');" : '';
        extendCode = $__extends ? "self._extendsTpl = '" + $__extends + "';" : '';
        extendCode += EOL + "self._usesTpl = [" + ($__uses.length ? "'"+$__uses.join("','")+"'" : '') + "];";
        prefixCode = contx.prefix ? contx.prefix : '';

      // generate tpl class
        var classCode = TT_ClassCode.render({
         'CLASSNAME'            : classname
        ,'TPLID'                : id
        ,'PREFIXCODE'           : prefixCode
        ,'EXTENDCODE'           : align(extendCode, 1)
        ,'BLOCKS'               : align(sblocks, 1)
        ,'RENDERCODE'           : align(renderCode, 1)
        });
        return fwrite(filename, classCode, contx.encoding);
    }
}
function get_cached_template(id, contx, options, cb)
{
    cb = 'function' === typeof cb ? cb : null;
    var template, tplclass, tpl, sprTpl, funcs, cachedTplFile, cachedTplClass, stat, stat2,
        exists, fname, fpath, parsed;
    template = contx.templates[id] || $__global.templates[id] || null;
    if (!template)
    {
        if (cb)
        {
            cb(null, null);
        }
        return null;
    }
    options = options || {context:contx.id,autoUpdate:false};
    parsed = options.parsed || null;
    if (HAS.call(options, 'parsed')) delete options.parsed;

    if (cb)
    {
        var setUsedTpls = function(tpl, cb) {
            var usedTpls = tpl._usesTpl && tpl._usesTpl.length ? tpl._usesTpl : null;
            if (usedTpls)
            {
                var i = 0, load_one = function load_one() {
                    if (i >= usedTpls.length)
                    {
                        cb(null, tpl);
                        return;
                    }
                    Contemplate.tpl(usedTpls[i], null, options, function(err, usedtpl) {
                        ++i;
                        load_one();
                    });
                };
                load_one();
            }
            else
            {
                cb(null, tpl);
            }
        };

        // inline templates saved only in-memory
        if (template[1])
        {
            var setSuper = function(tpl, cb) {
                sprTpl = $__extends || tpl._extendsTpl;
                if (sprTpl)
                {
                    Contemplate.tpl(sprTpl, null, options, function(err, spr) {
                        if (err)
                        {
                            cb(err, null);
                            return;
                        }
                        tpl.extend(spr);
                        cb(null, tpl);
                    });
                }
                else
                {
                    cb(null, tpl);
                }
            };
            // dynamic in-memory caching during page-request
            tpl = new Contemplate.Template(id).ctx(contx);
            if (parsed)
            {
                // already parsed code was given
                tpl.setRenderFunction(FUNC("Contemplate", parsed));
                setSuper(tpl, function(err, ctpl) {
                   if (!err) setUsedTpls(ctpl, cb);
                   else cb(err, null);
                });
            }
            else
            {
                // parse code and create template class
                create_template_render_function(id, contx, options.separators, function(err, funcs) {
                    if (err)
                    {
                        cb(err, null);
                        return;
                    }
                    tpl.setRenderFunction(funcs[0]).setBlocks(funcs[1]).usesTpl($__uses);
                    setSuper(tpl, function(err, ctpl) {
                       if (!err) setUsedTpls(ctpl, cb);
                       else cb(err, null);
                    });
                });
            }
        }
        else
        {
            if (!isNode && !isXPCOM) contx.cacheMode = Contemplate.CACHE_TO_DISK_NONE;

            var create_and_load_tpl = function(do_create, check_exists) {
                if (false === do_create)
                {
                    if (false === check_exists)
                    {
                        tplclass = import_module(cachedTplClass, cachedTplFile)(Contemplate);
                        tpl = (new tplclass(id))/*.setId(id)*/.ctx(contx);
                        if (sprTpl = tpl._extendsTpl)
                        {
                            Contemplate.tpl(sprTpl, null, options, function(err, spr) {
                                if (err)
                                {
                                    cb(err, null);
                                    return;
                                }
                                tpl.extend(spr);
                                setUsedTpls(tpl, cb);
                            });
                        }
                        else
                        {
                            setUsedTpls(tpl, cb);
                        }
                    }
                    else
                    {
                        fexists_async(cachedTplFile, function(err, exists) {
                            if (err || !exists)
                            {
                                cb(err || new Error('Could not create or read file "'+cachedTplFile+'"!'), null);
                                return;
                            }
                            tplclass = import_module(cachedTplClass, cachedTplFile)(Contemplate);
                            tpl = (new tplclass(id))/*.setId(id)*/.ctx(contx);
                            if (sprTpl = tpl._extendsTpl)
                            {
                                Contemplate.tpl(sprTpl, null, options, function(err, spr) {
                                    if (err)
                                    {
                                        cb(err, null);
                                        return;
                                    }
                                    tpl.extend(spr);
                                    setUsedTpls(tpl, cb);
                                });
                            }
                            else
                            {
                                setUsedTpls(tpl, cb);
                            }
                        } );
                    }
                }
                else
                {
                    create_cached_template(id, contx, cachedTplFile, cachedTplClass, options.separators, function(err, res) {
                        if (err)
                        {
                            cb(err, null);
                            return;
                        }
                        fexists_async(cachedTplFile, function(err, exists) {
                            if (err || !exists)
                            {
                                cb(err || new Error('Could not create or read file "'+cachedTplFile+'"!'), null);
                                return;
                            }
                            tplclass = import_module(cachedTplClass, cachedTplFile)(Contemplate);
                            tpl = (new tplclass(id))/*.setId(id)*/.ctx(contx);
                            if (sprTpl = tpl._extendsTpl)
                            {
                                Contemplate.tpl(sprTpl, null, options, function(err, spr) {
                                    if (err)
                                    {
                                        cb(err, null);
                                        return;
                                    }
                                    tpl.extend(spr);
                                    setUsedTpls(tpl, cb);
                                });
                            }
                            else
                            {
                                setUsedTpls(tpl, cb);
                            }
                        } );
                    } );
                }
            };

            if (true !== options.autoUpdate && Contemplate.CACHE_TO_DISK_NOUPDATE === contx.cacheMode)
            {
                cachedTplFile = get_cached_template_name(id, contx.id, contx.cacheDir);
                cachedTplClass = get_cached_template_class(id, contx.id);
                fexists_async(cachedTplFile, function(err, exists) {
                    if (!exists)
                    {
                        if (-1 !== id.indexOf('/') || -1 !== id.indexOf('\\'))
                        {
                            fname = basename(id);
                            fpath = trim(dirname(id), '/\\');
                        }
                        else
                        {
                            fname = id;
                            fpath = '';
                        }
                        if (fpath.length)
                        {
                            create_path(fpath, contx.cacheDir, parseInt('0755', 8), function(err, res) {
                                if (err)
                                {
                                    cb(err, null);
                                    return;
                                }
                                create_and_load_tpl();
                            });
                        }
                        else
                        {
                            create_and_load_tpl();
                        }
                    }
                    else
                    {
                        create_and_load_tpl(false, false);
                    }
                });
            }

            else if (true === options.autoUpdate || Contemplate.CACHE_TO_DISK_AUTOUPDATE === contx.cacheMode)
            {
                cachedTplFile = get_cached_template_name(id, contx.id, contx.cacheDir);
                cachedTplClass = get_cached_template_class(id, contx.id);
                fexists_async(cachedTplFile, function(err, exists) {
                    if (!exists)
                    {
                        // if tpl not exist create it
                        if (-1 !== id.indexOf('/') || -1 !== id.indexOf('\\'))
                        {
                            fname = basename(id);
                            fpath = trim(dirname(id), '/\\');
                        }
                        else
                        {
                            fname = id;
                            fpath = '';
                        }
                        if (fpath.length)
                        {
                            create_path(fpath, contx.cacheDir, parseInt('0755',8), function(err, res) {
                                if (err)
                                {
                                    cb(err, null);
                                    return;
                                }
                                create_and_load_tpl();
                            });
                        }
                        else
                        {
                            create_and_load_tpl();
                        }
                    }
                    else
                    {
                        fstat_async(cachedTplFile, function(err, stat) {
                           if (err)
                           {
                               cb(err, null);
                               return;
                           }
                           fstat_async(template[0], function(err, stat2) {
                                if (err)
                                {
                                    cb(err, null);
                                    return;
                                }
                                if (stat.mtime.getTime() <= stat2.mtime.getTime())
                                {
                                    // is out-of-sync re-create it
                                    create_and_load_tpl();
                                }
                                else
                                {
                                    create_and_load_tpl(false, false);
                                }
                           });
                        });
                    }
                } );
                return null;
            }

            else
            {
                // dynamic in-memory caching during page-request
                create_template_render_function(id, contx, options.separators, function(err, funcs) {
                    if (err)
                    {
                        cb(err, null);
                        return;
                    }
                    tpl = (new Contemplate.Template(id)).ctx(contx).setRenderFunction(funcs[0]).setBlocks(funcs[1]).usesTpl($__uses);
                    sprTpl = $__extends;
                    if (sprTpl)
                    {
                        Contemplate.tpl(sprTpl, null, options, function(err, spr) {
                            if (err)
                            {
                                cb(err, null);
                                return;
                            }
                            tpl.extend(spr);
                            setUsedTpls(tpl, cb);
                        });
                    }
                    else
                    {
                        setUsedTpls(tpl, cb);
                    }
                });
            }
        }
    }
    else
    {
        // inline templates saved only in-memory
        if (template[1])
        {
            // dynamic in-memory caching during page-request
            tpl = (new Contemplate.Template(id)).ctx(contx);
            if (parsed)
            {
                // already parsed code was given
                tpl.setRenderFunction(FUNC("Contemplate", parsed));
            }
            else
            {
                // parse code and create template class
                funcs = create_template_render_function(id, contx, options.separators);
                tpl.setRenderFunction(funcs[0]).setBlocks(funcs[1]).usesTpl($__uses);
            }
            sprTpl = $__extends || tpl._extendsTpl;
            if (sprTpl) tpl.extend(Contemplate.tpl(sprTpl, null, options));
            return tpl;
        }

        else
        {
            if (!isNode && !isXPCOM) contx.cacheMode = Contemplate.CACHE_TO_DISK_NONE;

            if (true !== options.autoUpdate && Contemplate.CACHE_TO_DISK_NOUPDATE === contx.cacheMode)
            {
                cachedTplFile = get_cached_template_name(id, contx.id, contx.cacheDir);
                cachedTplClass = get_cached_template_class(id, contx.id);
                exists = fexists(cachedTplFile);
                if (!exists)
                {
                    if (-1 !== id.indexOf('/') || -1 !== id.indexOf('\\'))
                    {
                        fname = basename(id);
                        fpath = trim(dirname(id), '/\\');
                    }
                    else
                    {
                        fname = id;
                        fpath = '';
                    }
                    if (fpath.length) create_path(fpath, contx.cacheDir, parseInt('0755', 8));
                    create_cached_template(id, contx, cachedTplFile, cachedTplClass, options.separators);
                }
                if (fexists(cachedTplFile))
                {
                    tplclass = import_module(cachedTplClass, cachedTplFile)(Contemplate);
                    tpl = (new tplclass(id))/*.setId(id)*/.ctx(contx);
                    if (tpl._extendsTpl) tpl.extend(Contemplate.tpl(tpl._extendsTpl, null, options));
                    return tpl;
                }
                return null;
            }

            else if (true === options.autoUpdate || Contemplate.CACHE_TO_DISK_AUTOUPDATE === contx.cacheMode)
            {
                cachedTplFile = get_cached_template_name(id, contx.id, contx.cacheDir);
                cachedTplClass = get_cached_template_class(id, contx.id);
                exists = fexists(cachedTplFile);
                if (!exists)
                {
                    // if tpl not exist create it
                    if (-1 !== id.indexOf('/') || -1 !== id.indexOf('\\'))
                    {
                        fname = basename(id);
                        fpath = trim(dirname(id), '/\\');
                    }
                    else
                    {
                        fname = id;
                        fpath = '';
                    }
                    if (fpath.length) create_path(fpath, contx.cacheDir, parseInt('0755', 8));
                    create_cached_template(id, contx, cachedTplFile, cachedTplClass, options.separators);
                }
                else
                {
                    stat = fstat(cachedTplFile); stat2 = fstat(template[0]);
                    if (stat.mtime.getTime() <= stat2.mtime.getTime())
                    {
                        // is out-of-sync re-create it
                        create_cached_template(id, contx, cachedTplFile, cachedTplClass, options.separators);
                    }
                }
                if (fexists(cachedTplFile))
                {
                    tplclass = import_module(cachedTplClass, cachedTplFile)(Contemplate);
                    tpl = (new tplclass(id))/*.setId(id)*/.ctx(contx);
                    if (tpl._extendsTpl) tpl.extend(Contemplate.tpl(tpl._extendsTpl, null, options));
                    return tpl;
                }
                return null;
            }

            else
            {
                // dynamic in-memory caching during page-request
                funcs = create_template_render_function(id, contx, options.separators);
                tpl = (new Contemplate.Template(id)).ctx(contx).setRenderFunction(funcs[0]).setBlocks(funcs[1]).usesTpl($__uses);
                sprTpl = $__extends || tpl._extendsTpl;
                if (sprTpl) tpl.extend(Contemplate.tpl(sprTpl, null, options));
                return tpl;
            }
        }
    }
}
function split_and_filter(r, s, regex)
{
    return s.split(r).map(function(x) {return trim(x);}).filter(function(x) {return 0<x.length;});
}
function create_path(path, root, mode, cb)
{
    path = trim(path);
    if (!path.length) return;
    mode = mode || parseInt('0755', 8);
    root = root || '';
    var i, l,
        parts = split_and_filter(DS_RE, path),
        current = rtrim(root, '/\\'), exists0 = true;
    if ('function' === typeof cb)
    {
        i = 0; l = parts.length;
        current += '/' + parts[i];

        var create_one_level = function create_one_level() {
            if (i >= l)
            {
                cb(null, true);
                return;
            }
            if (false === exists0)
            {
                fmkdir_async(current, mode, function(err, res) {
                    if (err)
                    {
                        cb(err, null);
                        return;
                    }
                    if (i+1 < l)
                    {
                        ++i;
                        current += '/' + parts[i];
                        create_one_level();
                    }
                    else
                    {
                        cb(null, true);
                    }
                });
            }
            else
            {
                fexists_async(current, function(err, exists) {
                    if (err)
                    {
                        cb(err, null);
                        return;
                    }
                    if (!exists) exists0 = false;
                    fmkdir_async(current, mode, function(err, res) {
                        if (err)
                        {
                            cb(err, null);
                            return;
                        }
                        if (i+1 < l)
                        {
                            ++i;
                            current += '/' + parts[i];
                            create_one_level();
                        }
                        else
                        {
                            cb(null, true);
                        }
                    });
                });
            }
        };
        create_one_level();
    }
    else
    {
        for(i=0,l=parts.length; i<l; ++i)
        {
            current += '/' + parts[i];
            if (!fexists(current) /*&& !fis_dir(current)*/)
                fmkdir(current, mode);
        }
    }
}

function ContemplateException(msg)
{
    this.name = 'ContemplateException';
    this.message = msg;
}
ContemplateException[PROTO] = Object.create(Error[PROTO]);

// can use inline templates for plugins etc.. to enable non-linear plugin compile-time replacement
function InlineTemplate(tpl, replacements, compiled)
{
    var self = this;
    if (!(self instanceof InlineTemplate)) return new InlineTemplate(tpl, replacements, compiled);
    self.id = null;
    self._renderer = null;
    self._parsed = false; // lazy init, only if needed, as and when needed
    self._args = [tpl, replacements, compiled];
    self.tpl = null;
}
InlineTemplate.multisplit = function multisplit(tpl, reps, as_array) {
    var r, sr, s, i, j, a, b, c, al, bl/*, as_array = is_array(reps)*/;
    as_array = !!as_array;
    a = [[1, tpl]];
    for (r in reps)
    {
        if (!HAS.call(reps, r)) continue;
        c = []; sr = as_array ? reps[r] : r; s = [0, reps[r]];
        for (i=0,al=a.length; i<al; ++i)
        {
            if (1 === a[i][0])
            {
                b = a[i][1].split(sr); bl = b.length;
                c.push([1, b[0]]);
                if (bl > 1)
                {
                    for (j=0; j<bl-1; ++j)
                    {
                        c.push(s);
                        c.push([1, b[j+1]]);
                    }
                }
            }
            else
            {
                c.push(a[i]);
            }
        }
        a = c;
    }
    return a;
};
InlineTemplate.multisplit_re = function multisplit_re(tpl, re) {
    re = re.global ? re : new RegExp(re.source, re.ignoreCase ? "gi" : "g"); /* make sure global flag is added */
    var a = [], i = 0, m;
    while (m = re.exec(tpl))
    {
        a.push([1, tpl.slice(i, re.lastIndex - m[0].length)]);
        a.push([0, m[1] ? m[1] : m[0]]);
        i = re.lastIndex;
    }
    a.push([1, tpl.slice(i)]);
    return a;
};
InlineTemplate.compile = function(tpl) {
    var l = tpl.length,
        i, notIsSub, s, out = '"use strict";' + "\n" + 'return (';
    ;

    for (i=0; i<l; ++i)
    {
        notIsSub = tpl[i][0]; s = tpl[i][1];
        if (notIsSub) out += "'" + s.replace(SQUOTE, "\\'").replace(NEWLINE, "' + \"\\n\" + '") + "'";
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

    ,dispose: function() {
        var self = this;
        self.id = null;
        self.tpl = null;
        self._renderer = null;
        self._parsed = null;
        self._args = null;
        return self;
    }
    ,render: function(args) {
        var self = this;
        args = args || [];

        if (!self._parsed) // lazy init, only if needed, as and when needed
        {
            var tpl = self._args[0], replacements = self._args[1], compiled = self._args[2];
            self.tpl = replacements instanceof RegExp
                ? InlineTemplate.multisplit_re(tpl||'', replacements)
                : InlineTemplate.multisplit(tpl||'', replacements||{});
            if (true === compiled)
            {
                self._renderer = InlineTemplate.compile(self.tpl);
                self.render = self._renderer;
            }
            self._args = null;
            self._parsed = true;
        }
        if (is_callable(self._renderer)) return self._renderer(args);

        var tpl = self.tpl, l = tpl.length,
            i, notIsSub, s, out = ''
        ;

        for (i=0; i<l; ++i)
        {
            notIsSub = tpl[i][0]; s = tpl[i][1];
            out += (notIsSub ? s : args[s]);
        }
        return out;
    }
};


function Template(id)
{
    var self = this;
    if (!(self instanceof Template)) return new Template(id);
    self._renderer = null;
    self._blocks = null;
    self._extends = null;
    self._extendsTpl = null;
    self._usesTpl = null;
    self._ctx = null;
    self._autonomus = false;
    self.id = null;
    if (id) self.id = id;
}
Template.spr = function(data, __i__) {
    var self = this, r, __ctx = false;
    !__i__&&(__i__=self)&&(self._autonomus||(__ctx=Contemplate._set_ctx(self._ctx)));
    r = self._extends.render(data, __i__);
    __ctx&&Contemplate._set_ctx(__ctx);
    return r;
};
Template.fixr = function(tpl) {
    tpl.render = tpl._extends instanceof Template
                ? Template.spr
                : (is_callable(tpl._renderer)
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
    ,_extendsTpl: null
    ,_usesTpl: null
    ,_ctx: null
    ,_autonomus: false

    // public methods
    ,dispose: function() {
        var self = this;
        self._renderer = null;
        self._blocks = null;
        self._extends = null;
        self._extendsTpl = null;
        self._usesTpl = null;
        self._ctx = null;
        self._autonomus = null;
        self.id = null;
        return self;
    }

    ,setId: function(id) {
        if (id) this.id = id;
        return this;
    }

    ,ctx: function(ctx) {
        this._ctx = ctx;
        return this;
    }

    ,autonomus: function(enable) {
        this._autonomus = !arguments.length ? true : !!enable;
        return this;
    }

    ,extend: function(tpl) {
        var self = this;
        self._extends = tpl && tpl.substr
                    ? Contemplate.tpl(tpl)
                    : (tpl instanceof Template
                    ? tpl
                    : null);
        Template.fixr(self);
        return self;
    }

    ,usesTpl: function(usedTpls) {
        var self = this;
        self._usesTpl = [].concat(usedTpls);
        return self;
    }

    ,setRenderFunction: function(renderfunc) {
        var self = this;
        self._renderer = is_callable(renderfunc)
                    ? renderfunc(Contemplate)
                    : null;
        Template.fixr(self);
        return self;
    }

    ,setBlocks: function(blocks) {
        var self = this;
        if ('object' === typeof blocks)
            self._blocks = merge(self._blocks || {}, blocks);
        return self;
    }

    ,sprblock: function(block, data/*, __i__*/) {
        var self = this;
        //__i__ = __i__ || self;
        if (self._extends) return self._extends.block(block, data, self._extends);
        return '';
    }

    ,block: function(block, data, __i__) {
        var self = this, r = '', __ctx = false, blocks = self._blocks;
        !__i__&&(__i__=self)&&(self._autonomus||(__ctx=Contemplate._set_ctx(self._ctx)));
        if (blocks && HAS.call(blocks, block)) r = blocks[block](Contemplate, data, self, __i__);
        else if (self._extends) r = self._extends.block(block, data, __i__);
        __ctx&&Contemplate._set_ctx(__ctx);
        return r;
    }

    ,render: function(data, __i__) {
        return '';
    }
}
// aliases
Template[PROTO].renderBlock = Template[PROTO].block;
Template[PROTO].renderSuperBlock = Template[PROTO].sprblock;

function Ctx(id)
{
    var self = this;
    self.id               = id;
    self.cacheDir         = './';
    self.cacheMode        = 0;
    self.cache            = {};
    self.templateDirs     = [];
    self.templateFinder   = null;
    self.templates        = {};
    self.partials         = {};
    self.plugins          = {};
    self.prefix           = '';
    self.encoding         = isXPCOM ? 'UTF-8' : 'utf8';
}
Ctx[PROTO] = {
    constructor: Ctx

    ,id: null
    ,cacheDir: null
    ,cacheMode: null
    ,cache: null
    ,templateDirs: null
    ,templateFinder: null
    ,templates: null
    ,partials: null
    ,plugins: null
    ,prefix: null
    ,encoding: null

    ,dispose: function() {
        var self = this;
        self.id = null;
        self.cacheDir = null;
        self.cacheMode = null;
        self.templateDirs = null;
        self.templateFinder = null;
        self.templates = null;
        self.partials = null;
        self.plugins = null;
        self.prefix = null;
        self.encoding = null;
        if (self.cache)
        {
            for(var tpl in self.cache)
                if (HAS.call(self.cache, tpl))
                    self.cache[tpl].dispose();
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

    ,Exception: ContemplateException
    ,Template: Template
    ,InlineTemplate: InlineTemplate
    ,Ctx: Ctx

    ,init: function() {
        if ($__isInited) return;

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
            ,"!function(root, name, factory) {"
            ,"\"use strict\";"
            ,"if (('undefined'!==typeof Components)&&('object'===typeof Components.classes)&&('object'===typeof Components.classesByID)&&Components.utils&&('function'===typeof Components.utils['import'])) /* XPCOM */"
            ,"    (root.$deps = root.$deps||{}) && (root.EXPORTED_SYMBOLS = [name]) && (root[name] = root.$deps[name] = factory.call(root));"
            ,"else if (('object'===typeof module)&&module.exports) /* CommonJS */"
            ,"    (module.$deps = module.$deps||{}) && (module.exports = module.$deps[name] = factory.call(root));"
            ,"else if (('function'===typeof define)&&define.amd&&('function'===typeof require)&&('function'===typeof require.specified)&&require.specified(name) /*&& !require.defined(name)*/) /* AMD */"
            ,"    define(name,['module'],function(module){factory.moduleUri = module.uri; return factory.call(root);});"
            ,"else if (!(name in root)) /* Browser/WebWorker/.. */"
            ,"    (root[name] = factory.call(root)||1)&&('function'===typeof(define))&&define.amd&&define(function(){return root[name];} );"
            ,"}('undefined' !== typeof self ? self : this,'#CLASSNAME#',function() {"
            ,"\"use strict\";"
            ,"return function(Contemplate) {"
            ,"/* Contemplate cached template '#TPLID#', constructor */"
            ,"function #CLASSNAME#(id)"
            ,"{"
            ,"    var self = this;"
            ,"    Contemplate.Template.call(self, id);"
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
            ,"#CLASSNAME#.prototype.render = function(data, __i__) {"
            ,"    \"use strict\";"
            ,"    var self = this, __p__ = '', __ctx = false;"
            ,"    !__i__&&(__i__=self)&&(self._autonomus||(__ctx=Contemplate._set_ctx(self._ctx)));"
            ,"    /* tpl main render code starts here */"
            ,"#RENDERCODE#"
            ,"    /* tpl main render code ends here */"
            ,"    __ctx&&Contemplate._set_ctx(__ctx);"
            ,"    return __p__;"
            ,"};"
            ,"// export it"
            ,"return #CLASSNAME#;"
            ,"};"
            ,"});"
            ,""
        ].join($__TEOL), {
             "#PREFIXCODE#"         : "PREFIXCODE"
            ,"#CLASSNAME#"          : "CLASSNAME"
            ,"#TPLID#"              : "TPLID"
            ,"#BLOCKS#"             : "BLOCKS"
            ,"#EXTENDCODE#"         : "EXTENDCODE"
            ,"#RENDERCODE#"         : "RENDERCODE"
        }, false);

        TT_BlockCode = new InlineTemplate([
            ""
            ,"/* tpl block render method for block '#BLOCKNAME#' */"
            ,"'#BLOCKMETHODNAME#': function(Contemplate, data, self, __i__) {"
            ,"#BLOCKMETHODCODE#"
            ,"}"
            ,""
        ].join($__TEOL), {
             "#BLOCKNAME#"          : "BLOCKNAME"
            ,"#BLOCKMETHODNAME#"    : "BLOCKMETHODNAME"
            ,"#BLOCKMETHODCODE#"    : "BLOCKMETHODCODE"
        }, false);

        TT_BLOCK = new InlineTemplate([
            "\"use strict\";"
            ,"var __p__ = '';"
            ,"#BLOCKCODE#"
            ,"return __p__;"
            ,""
        ].join($__TEOL), {
             "#BLOCKCODE#"          : "BLOCKCODE"
        }, false);


        TT_FUNC = new InlineTemplate([
            "return function(data, __i__){"
            ,"\"use strict\";"
            ,"var self = this, __p__ = '', __ctx = false;"
            ,"!__i__&&(__i__=self)&&(self._autonomus||(__ctx=Contemplate._set_ctx(self._ctx)));"
            ,"#FCODE#"
            ,"__ctx&&Contemplate._set_ctx(__ctx);"
            ,"return __p__;"
            ,"};"
        ].join($__TEOL), {
             "#FCODE#"              : "FCODE"
        }, false);

        TT_RCODE = new InlineTemplate([
            ""
            ,"#RCODE#"
            ,""
        ].join($__TEOL), {
             "#RCODE#"              : "RCODE"
        }, false);

        clear_state();
        $__isInited = true;
    }

    ,_set_ctx: function(ctx) {
        var contx = $__context;
        /*if ( ctx instanceof Ctx ) $__context = ctx;
        else if ( ctx && HAS.call($__ctx,ctx) ) $__context = $__ctx[ctx];
        else $__context = $__global;*/
        $__context = ctx ? ctx : $__global;
        return contx;
    }

    //
    // Main API methods
    //

    ,createCtx: function(ctx) {
        if (ctx && 'global' !== ctx && !HAS.call($__ctx,ctx)) $__ctx[ctx] = new Ctx(ctx);
    }

    ,disposeCtx: function(ctx) {
        if (ctx && 'global' !== ctx && HAS.call($__ctx, ctx))
        {
            $__ctx[ctx].dispose();
            delete $__ctx[ctx];
        }
    }

    ,setTemplateSeparators: function(seps) {
        if (seps)
        {
            if (seps['left'])  $__leftTplSep = ''+seps['left'];
            if (seps['right']) $__rightTplSep = ''+seps['right'];
        }
    }

    ,setPreserveLines: function(enable) {
        if (arguments.length < 1) enable = true;
        $__preserveLines = !!enable ? $__preserveLinesDefault : '';
    }

    ,hasPlugin: function(name, ctx) {
        var contx;
        if (arguments.length < 2) ctx = 'global';
        contx = ctx && HAS.call($__ctx, ctx) ? $__ctx[ctx] : $__context;
        return !!name && (HAS.call(contx.plugins, name) || HAS.call($__global.plugins, name));
    }

    ,addPlugin: function(name, pluginCode, ctx) {
        var contx;
        if (name && pluginCode)
        {
            if (arguments.length < 2) ctx = 'global';
            contx = ctx && HAS.call($__ctx, ctx) ? $__ctx[ctx] : $__context;
            contx.plugins[name] = pluginCode;
        }
    }

    ,plg_: function(plg) {
        var args = arguments;
        if (HAS.call($__context.plugins, plg) && is_callable($__context.plugins[plg]))
        {
            return $__context.plugins[plg].apply(null, slice.call(args, 1));
        }
        else if (HAS.call($__global.plugins, plg) && is_callable($__global.plugins[plg]))
        {
            return $__global.plugins[plg].apply(null, slice.call(args, 1));
        }
        return '';
    }

    ,setPrefixCode: function(preCode, ctx) {
        var contx;
        if (arguments.length < 2) ctx = 'global';
        contx = ctx && HAS.call($__ctx, ctx) ? $__ctx[ctx] : $__context;
        if (preCode) contx.prefix = '' + preCode;
    }

    ,setEncoding: function(encoding, ctx) {
        var contx;
        if (arguments.length < 2) ctx = 'global';
        contx = ctx && HAS.call($__ctx,ctx) ? $__ctx[ctx] : $__context;
        contx.encoding = encoding;
    }

    ,setCacheDir: function(dir, ctx) {
        var contx;
        if (arguments.length < 2) ctx = 'global';
        contx = ctx && HAS.call($__ctx, ctx) ? $__ctx[ctx] : $__context;
        contx.cacheDir = rtrim(dir, '/\\') + '/';
    }

    ,setCacheMode: function(mode, ctx) {
        var contx;
        if (arguments.length < 2) ctx = 'global';
        contx = ctx && HAS.call($__ctx, ctx) ? $__ctx[ctx] : $__context;
        contx.cacheMode = isNode || isXPCOM ? mode : Contemplate.CACHE_TO_DISK_NONE;
    }

    ,setTemplateDirs: function(dirs, ctx) {
        var contx;
        if (arguments.length < 2) ctx = 'global';
        contx = ctx && HAS.call($__ctx, ctx) ? $__ctx[ctx] : $__context;
        contx.templateDirs = [].concat(dirs);
    }

    ,getTemplateDirs: function(ctx) {
        var contx;
        if (arguments.length < 1) ctx = 'global';
        contx = ctx && HAS.call($__ctx, ctx) ? $__ctx[ctx] : $__context;
        return contx.templateDirs;
    }

    ,setTemplateFinder: function(finder, ctx) {
        var contx;
        if (arguments.length < 2) ctx = 'global';
        contx = ctx && HAS.call($__ctx, ctx) ? $__ctx[ctx] : $__context;
        contx.templateFinder = is_callable(finder) ? finder : null;
    }

    ,clearCache: function(all, ctx) {
        var contx;
        if (arguments.length < 2) ctx = 'global';
        contx = ctx && HAS.call($__ctx, ctx) ? $__ctx[ctx] : $__context;
        contx.cache = {};
        if (all) contx.partials = {};
    }

    ,add: function(tpls, ctx) {
        var contx, tplID;
        if (tpls && ("object" === typeof tpls))
        {
            if (arguments.length < 2) ctx = 'global';
            contx = ctx && HAS.call($__ctx, ctx) ? $__ctx[ctx] : $__context;
            for (tplID in tpls)
            {
                if (!HAS.call(tpls, tplID)) continue;
                if (is_array(tpls[tplID]))
                {
                    // unified way to add tpls both as reference and inline
                    // inline tpl, passed as array
                    if (tpls[tplID][0])
                        contx.templates[tplID] = [tpls[tplID][0], true];
                }
                else
                {
                    contx.templates[tplID] = [tpls[tplID], false];
                }
            }
        }
    }

    ,hasTpl: function(tpl, ctx) {
        var contx;
        if (arguments.length < 2) ctx = 'global';
        contx = ctx && HAS.call($__ctx, ctx) ? $__ctx[ctx] : $__context;
        return !!tpl && (HAS.call(contx.templates, tpl) || HAS.call($__global.templates, tpl));
    }

    ,getTemplateContents: function(id, ctx, cb) {
        var contx;
        if (arguments.length < 2) ctx = 'global';
        contx = ctx && HAS.call($__ctx, ctx) ? $__ctx[ctx] : $__context;
        if (is_callable(cb))
        {
            get_template_contents(id, contx, function(err, tpl) {
                cb(err, tpl);
            });
        }
        else
        {
            return get_template_contents(id, contx);
        }
    }

    ,getTemplateContentsPromise: function(id, ctx) {
        if ('function' === typeof Promise)
        {
            return new Promise(function(resolve, reject) {
                Contemplate.getTemplateContents(id, ctx, function(err, data) {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
        }
        return null;
    }

    ,findTpl: function(tpl, ctx, cb) {
        var contx;
        if (arguments.length < 2) ctx = 'global';
        contx = ctx && HAS.call($__ctx, ctx) ? $__ctx[ctx] : $__context;

        if (is_callable(cb))
        {
            var templateDirs, filename, dir,
                search_one = function search_one() {
                    if (dir >= templateDirs.length)
                    {
                        cb(null, null);
                        return;
                    }
                    var path = rtrim(templateDirs[dir],'/\\') + '/' + filename;
                    fexists_async(path, function(err, exists) {
                        if (!err && exists)
                        {
                            cb(null, path);
                        }
                        else
                        {
                            ++dir;
                            search_one();
                        }
                    });
                };
            if (is_callable(contx.templateFinder))
            {
                // supposed to be async operation with callback given
                contx.templateFinder(tpl, function(found) {
                    cb(null, found);
                });
                return;
            }
            if (contx.templateDirs && contx.templateDirs.length)
            {
                templateDirs = contx.templateDirs;
                filename = ltrim(tpl,'/\\');
                dir = 0;
                search_one();
                return;
            }
            if (contx != $__global)
            {
                contx = $__global;
                if (is_callable(contx.templateFinder))
                {
                    // supposed to be async operation with callback given
                    contx.templateFinder(tpl, function(found) {
                        cb(null, found);
                    });
                    return;
                }
                if (contx.templateDirs && contx.templateDirs.length)
                {
                    templateDirs = contx.templateDirs;
                    filename = ltrim(tpl,'/\\');
                    dir = 0;
                    search_one();
                    return;
                }
            }
            cb(null, null);
        }
        else
        {
            var filename, path, dir, l;
            if (is_callable(contx.templateFinder))
            {
                // supposed to be sync operation if no callback provided
                return contx.templateFinder(tpl);
            }

            if (contx.templateDirs && contx.templateDirs.length)
            {
                filename = ltrim(tpl, '/\\');
                for(dir=0,l=contx.templateDirs.length; dir<l; ++dir)
                {
                    path = rtrim(contx.templateDirs[dir],'/\\') + '/' + filename;
                    if (fexists(path)) return path;
                }
                return null;
            }

            if (contx != $__global)
            {
                contx = $__global
                if (is_callable(contx.templateFinder))
                {
                    // supposed to be sync operation if no callback provided
                    return contx.templateFinder(tpl);
                }

                if (contx.templateDirs && contx.templateDirs.length)
                {
                    filename = ltrim(tpl, '/\\');
                    for(dir=0,l=contx.templateDirs.length; dir<l; ++dir)
                    {
                        path = rtrim(contx.templateDirs[dir],'/\\') + '/' + filename;
                        if (fexists(path)) return path;
                    }
                    return null;
                }
            }
        }
        return null;
    }

    ,findTplPromise: function(tpl, ctx) {
        if ('function' === typeof Promise)
        {
            if (arguments.length < 2) ctx = 'global';
            return new Promise(function(resolve, reject) {
                Contemplate.findTpl(tpl, ctx, function(err, found) {
                    if (err) reject(err);
                    else resolve(found);
                });
            });
        }
        return null;
    }

    ,parseTpl: function(tpl, options, cb) {
        var parsed, leftSep, rightSep, separators, _ctx, contx = null;

        // see what context this template may use
        if (options && options.substr)
        {
            if (HAS.call($__ctx, options))
                contx = $__ctx[options]; // preset context
            else
                contx = $__global; // global context
            options = {};
        }

        options = merge({
            'separators': null
        }, options);

        if (options.context)
        {
            if (HAS.call($__ctx, options.context))
                contx = $__ctx[options.context]; // preset context
            else if (!contx)
                contx = $__global; // global context
            delete options.context;
        }
        if (!contx) contx = $__global; // global context

        leftSep = $__leftTplSep; rightSep = $__rightTplSep;
        separators = options && options.separators ? options.separators : null;
        if (separators)
        {
            leftSep = separators[0];
            rightSep = separators[1];
        }

        if (is_callable(cb))
        {
            _ctx = $__context;
            $__context = contx;
            reset_state();
            parse(tpl, leftSep, rightSep, true, function(err, parsed) {
                clear_state();
                $__context = _ctx;
                cb(err, parsed);
            });

            return null;
        }
        else
        {
            _ctx = $__context;
            $__context = contx;
            reset_state();
            parsed = parse(tpl, leftSep, rightSep, true);
            clear_state();
            $__context = _ctx;

            return parsed;
        }
    }

    ,parseTplPromise: function(tpl, options) {
        if ('function' === typeof Promise)
        {
            return new Promise(function(resolve, reject) {
                Contemplate.parseTpl(tpl, options, function(err, parsed) {
                    if (err) reject(err);
                    else resolve(parsed);
                });
            });
        }
        return null;
    }

    //
    // Main Template functions
    //

    ,tpl: function(tpl, data, options, cb) {
        cb = is_callable(cb) ? cb : null;
        var tmpl, contx, _ctx;
        if (tpl instanceof Contemplate.Template)
        {
            tmpl = tpl;
            if (cb)
            {
                // Provide some basic currying to the user
                cb(null, data && ("object" === typeof data) ? tmpl.render(data) : tmpl);
                return null;
            }
            else
            {
                // Provide some basic currying to the user
                return data && ("object" === typeof data) ? tmpl.render(data) : tmpl;
            }
        }
        else
        {
            // see what context this template may use
            contx = null;
            if (null == options) options = {};
            if (options && options.substr)
            {
                if (HAS.call($__ctx, options))
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

            if (options.context)
            {
                if (HAS.call($__ctx, options.context))
                    contx = $__ctx[options.context]; // preset context
                else if (!contx)
                    contx = $__context; // current context
                delete options.context;
            }
            if (!contx) contx = $__context; // current context

            $__escape = false !== options.escape;

            if (cb)
            {
                var proceed = function() {
                    // asynchronous loading, parsing and writing
                    if (!!options.refresh || (!contx.cache[tpl] && !$__global.cache[tpl]))
                    {
                        _ctx = $__context;
                        $__context = contx;
                        get_cached_template(tpl, contx, options, function(err, ctpl) {
                            $__context = _ctx;
                            if (err)
                            {
                                cb(err, null);
                                return;
                            }
                            contx.cache[tpl] = ctpl;
                            tmpl = contx.cache[tpl] || $__global.cache[tpl];
                            tmpl.autonomus(options.standalone);
                            cb(null, data && ("object"===typeof data) ? tmpl.render(data) : tmpl);
                        });
                    }
                    else
                    {
                        tmpl = contx.cache[tpl] || $__global.cache[tpl];
                        tmpl.autonomus(options.standalone);
                        cb(null, data && ("object"===typeof data) ? tmpl.render(data) : tmpl);
                    }
                };

                if (null == options['parsed'] && !Contemplate.hasTpl(tpl, contx.id))
                {
                    // async operation
                    Contemplate.findTpl(tpl, contx.id, function(err, path) {
                        if (!path)
                        {
                            cb(null, data && "object"===typeof data ? '' : null);
                            return;
                        }
                        var tpldef = {};
                        tpldef[tpl] = path;
                        Contemplate.add(tpldef, contx.id);
                        proceed();
                    });
                }
                else
                {
                    proceed();
                }
                return null;
            }
            else
            {
                if (null == options['parsed'] && !Contemplate.hasTpl(tpl, contx.id))
                {
                    // sync operation
                    var path = Contemplate.findTpl(tpl, contx.id);
                    if (!path) return data && "object"===typeof data ? '' : null;
                    var tpldef = {};
                    tpldef[tpl] = path;
                    Contemplate.add(tpldef, contx.id);
                }

                // Figure out if we're getting a template, or if we need to
                // load the template - and be sure to cache the result.
                if (!!options.refresh || (!contx.cache[tpl] && !$__global.cache[tpl]))
                {
                    _ctx = $__context;
                    $__context = contx;
                    contx.cache[tpl] = get_cached_template(tpl, contx, options);
                    $__context = _ctx;
                }

                tmpl = contx.cache[tpl] || $__global.cache[tpl];
                tmpl.autonomus(options.standalone);

                // Provide some basic currying to the user
                return data && ("object"===typeof data) ? tmpl.render(data) : tmpl;
            }
        }
    }


    ,tplPromise: function(tpl, data, options) {
        if ('function' === typeof Promise)
        {
            return new Promise(function(resolve, reject) {
                Contemplate.tpl(tpl, data, options, function(err, tpl) {
                    if (err) reject(err);
                    else resolve(tpl);
                });
            });
        }
        return null;
    }

    ,inline: function(tpl, reps, compiled) {
        return (tpl instanceof Contemplate.InlineTemplate)
            ? tpl.render(reps)
            : Contemplate.InlineTemplate(tpl, reps, compiled);
    }

    ,concat: function() {
        return join.call(arguments, '');
    }

    ,join: function(sep, args, skip_empty) {
        if (null == args) return '';
        skip_empty = true === skip_empty;
        if ('object' !== typeof args) return skip_empty&&!String(args).length ? '' : String(args);
        if (null == sep) sep = '';
        var i, l = args.length, s,
            out = l > 0 ? ('object'===typeof args[0] ? Contemplate.join(sep, args[0], skip_empty) : (skip_empty&&(null==args[0]||!String(args[0]).length) ? '' : String(args[0]))) : '';
        for (i=1; i<l; ++i)
        {
            s = 'object' === typeof args[i] ? Contemplate.join(sep, args[i], skip_empty) : (skip_empty&&(null==args[i]||!String(args[i]).length) ? '' : String(args[i]));
            if (!skip_empty || s.length > 0) out += sep + s;
        }
        return out;
    }

    ,keys: function(o) {
        return o ? array_keys(o) : [];
    }

    ,values: function(o) {
        return o ? array_values(o) : [];
    }

    ,items: function(o) {
        return o;
    }

    ,count: count

    ,is_array: function(v, strict) {
        var to_string = toString.call(v);
        return strict ? '[object Array]' === to_string : ('[object Array]' === to_string) || ('[object Object]' === to_string);
    }

    ,in_array: function(v, a) {
        return -1 < a.indexOf(v);
    }

    ,is_list: is_array

    ,haskey: function(v/*, key1, key2, etc.. */) {
        var args, i, tmp;
        if (!v || !Contemplate.is_array(v)) return false;
        args = arguments; tmp = v;
        for (i=1; i<args.length; ++i)
        {
            if (null == tmp || !Contemplate.is_array(tmp) || !HAS.call(tmp,args[i])) return false;
            tmp = tmp[args[i]];
        }
        return true;
    }

    ,time: php_time

    ,date: function(format, timestamp) {
        if (arguments.length < 2) timestamp = php_time();
        return php_date(format, timestamp);
    }

    ,lowercase: function(s) {
        return String(s).toLowerCase();
    }

    ,uppercase: function(s) {
        return String(s).toUpperCase();
    }

    ,striptags: function(s) {
        return s.replace(TAG_RE, '');
    }

    ,e: function(s, entities) {
        // http://jsperf.com/split-join-vs-regex-replace/10
        var i = 0, l = s.length, r = '', c, cd;
        if (entities)
        {
            for (i=0; i<l; ++i)
            {
                c = s.charAt(i); cd = c.charCodeAt(0);
                switch (cd)
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
            for (i=0; i<l; ++i)
            {
                c = s.charAt(i); cd = c.charCodeAt(0);
                switch (cd)
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

    ,json_encode: function(v) {
        return JSON.stringify(v);
    }

    ,json_decode: function(v) {
        return JSON.parse(v);
    }

    ,urlencode: urlencode

    ,urldecode: urldecode

    ,buildquery: function(data) {
        return http_build_query(data, '&');
    }

    ,parsequery: function(str) {
        return parse_str(str);
    }

    ,queryvar: function(url, add_keys, remove_keys) {
        var keys, key, value, k, l, last, q, to_str;
        if (null != remove_keys)
        {
            // https://davidwalsh.name/php-remove-variable
            keys = [].concat(remove_keys);
            l = keys.length;
            for (k=0; k<l; ++k)
            {
                url = url.replace(RE('(\\?|&)' + urlencode( keys[k] ).replace(re_9, '\\$1') + '(\\[[^\\[\\]]*\\])*(=[^&]+)?','g'), '$1');
            }
            url = url.replace(AMP_RE, '&').replace('?&', '?');
            last = url.slice(-1);
            if ('?' === last || '&' === last)
            {
                url = url.slice(0,-1);
            }
        }
        if (!!add_keys)
        {
            keys = Keys(add_keys);
            l = keys.length;
            q = -1 === url.indexOf('?') ? '?' : '&';
            for(k=0; k<l; ++k)
            {
                key = keys[k]; value = add_keys[key];
                key = urlencode(key);
                to_str = toString.call(value);
                if ('[object Array]' === to_str || '[object Object]' === to_str)
                {
                    if ('[object Array]' === to_str)
                    {
                        for (var v=0,vl=value.length; v<vl; ++v)
                        {
                            url += q + key + '[]=' + urlencode(value[v]);
                            q = '&';
                        }
                    }
                    else
                    {

                        for (var kvalue=Keys(value),v=0,vl=kvalue.length; v<vl; ++v)
                        {
                            url += q + key + '[' + urlencode(kvalue[v]) + ']=' + urlencode(value[kvalue[v]]);
                            q = '&';
                        }
                    }
                }
                else
                {
                    url += q + key + '=' + urlencode(value);
                }
                q = '&';
            }
        }
        return url;
    }

    ,get: function(v, keys, default_value) {
        default_value = null != default_value ? default_value : null;
        if (!Contemplate.is_array(keys, true)) keys = [keys];
        var o = v, k = 0, l = keys.length, found = 1, key, keyGetter;
        for (k=0; k<l; ++k)
        {
            key = String(keys[k]);
            if (HAS.call(o, key))
            {
                o = o[key];
            }
            else
            {
                keyGetter = 'get' + key.charAt(0).toUpperCase() + key.substring(1);
                if (/*HAS.call(o, keyGetter) &&*/ is_callable(o[keyGetter]))
                {
                    o = o[keyGetter]();
                }
                else
                {
                    found = 0;
                    break;
                }
            }
        }
        return found ? o : default_value;
    }

    ,uuid: function(namespace) {
        return [namespace||'UUID', ++$__uuid, php_time()].join('_');
    }

    ,merge: merge

    //,local_variable: local_variable
    //,is_local_variable: is_local_variable

    // extra for js version
    ,empty: empty
    ,trim: trim
    ,ltrim: ltrim
    ,rtrim: rtrim
    ,sprintf: sprintf
    ,vsprintf: function(fmt, args) {
        return sprintf.apply(null, [fmt].concat(args||[]));
    }
};

// Template Engine end here
//
//

var default_date_locale = {
     meridian: {am:'am', pm:'pm', AM:'AM', PM:'PM'}
    ,ordinal: {ord:{1:'st',2:'nd',3:'rd'}, nth:'th'}
    ,timezone: ['UTC','EST','MDT']
    ,timezone_short: ['UTC','EST','MDT']
    ,day: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    ,day_short: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    ,month: ['January','February','March','April','May','June','July','August','September','October','November','December']
    ,month_short: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    },
    Keys = Obj.keys, join = Arr[PROTO].join, slice = Arr[PROTO].slice, floor = Math.floor, round = Math.round, abs = Math.abs,
    re_1 = /([\s\S]*?)(&(?:#\d+|#x[\da-f]+|[a-zA-Z][\da-z]*);|$)/g,
    re_2 = /!/g, re_3 = /'/g, re_4 = /\(/g, re_5 = /\)/g, re_6 = /\*/g, re_7 = /%20/g,
    re_8 = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g,
    re_9 = /([\[\]\(\)\.\?\/\*\{\}\+\$\^\:\\])/g,
    rtrim_re = /[ \s\u00A0]+$/g,
    ltrim_re = /^[ \s\u00A0]+/g,
    trim_re = /^[ \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]+|[ \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]+$/g,

    fileurl_2_nsfile = function(file_uri) {
        // NetUtil.newURI(file_uri).QueryInterface(Ci.nsIFileURL).file
        // http://stackoverflow.com/q/24817347/3591273
        /*var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService),
            url = ios.newURI(file_uri, null, null), // url is a nsIURI
            // file is a nsIFile
            file = url.QueryInterface(Ci.nsIFileURL).file;*/
        return Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService).newURI(file_uri, null, null).QueryInterface(Ci.nsIFileURL).file;
    },

    fexists = isXPCOM
    ? function fexists(file) {
        // file is URI, i.e file://...
        return fileurl_2_nsfile(file).exists();
    }
    : (isNode
    ? function fexists(file) {
        return fs.existsSync(file);
    }
    : function fexists(file) {
        return true;
    }),
    fexists_async = isXPCOM
    ? function fexists_async(file, cb) {
        // file is URI, i.e file://...
        if (cb) cb(null, fexists(file));
    }
    : (isNode
    ? function fexists_async(file, cb) {
        // exists is deprecated due to incompatible callback signature
        //fs.exists(file, cb);
        fs.stat(file, function(err, stat) {
            if (!cb) return;
            if (!err)
            {
                // exists
                cb(null, true);
            }
            else if ('ENOENT' === err.code)
            {
                // file does not exist
                cb(null, false);
            }
            else // some other error
            {
                cb(err, null);
            }
        });
    }
    : function fexists_async(file, cb) {
        if (cb) cb(null, true);
    }),

    fis_dir = isXPCOM
    ? function fis_dir(file) {
        return fileurl_2_nsfile(file).isDirectory();
    }
    : (isNode
    ? function fis_dir(file) {
        return fs.lstatSync(file).isDirectory();
    }
    : function fis_dir(file) {
        return false;
    }),
    fis_dir_async = isXPCOM
    ? function fis_dir_async(file, cb) {
        if (cb) cb(null, fileurl_2_nsfile(file).isDirectory());
    }
    : (isNode
    ? function fis_dir_async(file, cb) {
        fs.lstat(file, function(err, stats){
            if (cb) cb(err, err ? null : stats.isDirectory());
        });
    }
    : function fis_dir_async(file, cb) {
        if (cb) cb(null, false);
    }),

    fmkdir = isXPCOM
    ? function fmkdir(file, mode) {
        var nsfile = fileurl_2_nsfile(file);
        return nsfile.create(nsfile.DIRECTORY_TYPE, mode);
    }
    : (isNode
    ? function fmkdir(file, mode) {
        return fs.mkdirSync(file, mode);
    }
    : function fmkdir(file, mode) {
        // do nothing
        return false;
    }),

    fmkdir_async = isXPCOM
    ? function fmkdir_async(file, mode, cb) {
        var res = fmkdir(file, mode);
        if (cb) cb(null, res);
    }
    : (isNode
    ? function fmkdir_async(file, mode, cb) {
        fs.mkdir(file, mode, function(err) {
            if (cb) cb(err, err ? false : true);
        });
    }
    : function fmkdir_async(file, mode, cb) {
        // do nothing
        if (cb) cb(null, false);
    }),

    fstat = isXPCOM
    ? function fstat(file) {
        // file is URI, i.e file://...
        var mtime = fileurl_2_nsfile(file).lastModifiedTime;
        return {mtime: !!mtime ? new Date(mtime) : false};
    }
    : (isNode
    ? function fstat(file) {
        return fs.statSync(file);
    }
    : function fstat(file) {
        // http://stackoverflow.com/a/5748207/3591273
        var xhr = XHR(), mtime, stats = {mtime: false};
        xhr.open('HEAD', file, false);  // 'false' makes the request synchronous
        xhr.send(null);
        if (200 === xhr.status)
        {
            mtime = new Date(xhr.getResponseHeader('Last-Modified'));
            if (xhr.toString() === 'Invalid Date') mtime = false;
            stats.mtime = mtime;
        }
        return stats;
    }),
    fstat_async = isXPCOM
    ? function fstat_async(file, cb) {
        if (cb) cb(null, fstat(file));
    }
    : (isNode
    ? function fstat_async(file, cb) {
        fs.stat(file, cb);
    }
    : function fstat_async(file, cb) {
        // http://stackoverflow.com/a/5748207/3591273
        var xhr = XHR(), mtime, stats = {mtime: false};
        xhr.open('HEAD', file, true);  // 'true' makes the request asynchronous
        xhr.onload = function() {
            if (200 === xhr.status)
            {
                mtime = new Date(xhr.getResponseHeader('Last-Modified'));
                if (mtime.toString() === 'Invalid Date') mtime = false;
                stats.mtime = mtime;
            }
            if (cb) cb(null, stats);
        };
        xhr.send(null);
    }),

    fread = isXPCOM
    ? function fread(file, enc) {
        // file is URI, i.e file://...
        var data = '', stream, conv, len, str = {value:''}, read = 0;
        // https://developer.mozilla.org/en-US/Add-ons/Code_snippets/File_I_O
        stream = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream);
        conv = Cc["@mozilla.org/intl/converter-input-stream;1"].createInstance(Ci.nsIConverterInputStream);
        stream.init(fileurl_2_nsfile(file), -1, 0, 0);
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
    ? function fread(file, enc) {
        return fs.readFileSync(file, {encoding:enc||'utf8'})/*.toString()*/;
    }
    : function fread(file, enc) {
        var xhr = XHR();
        // plain text with enc encoding format
        xhr.open('GET', file, false);  // 'false' makes the request synchronous
        // http://stackoverflow.com/questions/9855127/setting-xmlhttprequest-responsetype-forbidden-all-of-a-sudden
        xhr.setRequestHeader("Content-Type", "text/plain; charset="+(enc||'utf8')+"");
        xhr.overrideMimeType("text/plain; charset="+(enc||'utf8')+"");
        xhr.send(null);
        return 200 === xhr.status ? xhr.responseText : '';
    }),
    fread_async = isXPCOM
    ? function fread_async(file, enc, cb) {
        // file is URI, i.e file://...
        // https://developer.mozilla.org/en-US/Add-ons/Code_snippets/File_I_O
        NetUtil.asyncFetch(fileurl_2_nsfile(file), function(stream, status) {
            var err = !Components.isSuccessCode(status),
                data = err
                ? ''
                : NetUtil.readInputStreamToString(stream, stream.available(), {charset:enc||'UTF-8'});
            if (cb) cb(err, data);
        });
    }
    : (isNode
    ? function fread_async(file, enc, cb) {
        fs.readFile(file, {encoding:enc||'utf8'}, cb);
    }
    : function fread_async(file, enc, cb) {
        var xhr = XHR();
        // plain text with enc encoding format
        xhr.open('GET', file, true);  // 'true' makes the request asynchronous
        xhr.responseType = "text";
        xhr.setRequestHeader("Content-Type", "text/plain; charset="+(enc||'utf8')+"");
        xhr.overrideMimeType("text/plain; charset="+(enc||'utf8')+"");
        xhr.onload = function() {
            var err = 200 !== xhr.status,
                data = err ? '' : xhr.responseText;
            if (cb) cb(err, data);
        };
        xhr.send(null);
    }),

    // https://github.com/moxystudio/node-proper-lockfile
    // https://developer.mozilla.org/en-US/docs/Archive/Add-ons/Overlay_Extensions/Firefox_addons_developer_guide/Using_XPCOM%E2%80%94Implementing_advanced_processes
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
    fwrite = isXPCOM
    ? function fwrite(file, data, enc) {
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
        conv.writeString(data);
        conv.close(); // this closes stream
    }
    : (isNode
    ? function fwrite(file, data, enc) {
        fs.writeFileSync(file, data, {encoding:enc||'utf8'})/*.toString()*/;
    }
    : function fwrite(file, data, enc) {
    }),
    fwrite_async = isXPCOM
    ? function fwrite_async(file, data, enc, cb) {
        // file is URI, i.e file://...
        // http://stackoverflow.com/questions/9777773/reading-writing-file-on-local-machine
        var istream, ostream, conv;
        ostream = FileUtils.openSafeFileOutputStream(fileurl_2_nsfile(file));
        conv = Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);
        conv.charset = enc||"UTF-8";
        istream = conv.convertToInputStream(data);
        NetUtil.asyncCopy(istream, ostream, function(status) {
            if (cb) cb(Components.isSuccessCode(status));
        });
    }
    : (isNode
    ? function fwrite_async(file, data, enc, cb) {
        fs.writeFile(file, data, {encoding: enc||'utf8'}, function(err,res) {
            cb(err,res);
        });
    }
    : function fwrite_async(file, data, enc, cb) {
        if (cb) cb(null);
    }),
    FUNC = isXPCOM
    ? function FUNC(a, f) {
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
    : function FUNC(a, f) {
        return new Function(a, f);
    }/*,
    ASYNC_SUPPORTED = isXPCOM ? false : (function() {
        var test = null;
        try {
            test = (new Function('', 'return async function(){};'))();
        } catch (e) {
            return false;
        }
        return is_callable(test) && is_asyncf(test);
    })(),
    ASYNC_FUNC = ASYNC_SUPPORTED
    ? function ASYNC_FUNC(a, f) {
        return FUNC('', 'return async function('+a+'){'+f+'};')();
    }
    : FUNC*/
;



// utilities
function RE(r, f)
{
    return new RegExp(r, f||'');
}
function empty(o)
{
    // exactly like php's empty function
    if (!o || !Boolean(o) || "0" === o) return true;
    var to_string = toString.call(o);
    if ((o instanceof Array || o instanceof String || '[object Array]' === to_string || '[object String]' === to_string) && !o.length) return true;
    if ((o instanceof Object || '[object Object]' === to_string) && !array_keys(o).length ) return true;
    return false;
}
// php-like functions, mostly adapted and optimised from phpjs project, https://github.com/kvz/phpjs
function is_callable(o)
{
    return 'function' === typeof o;
}
/*function is_asyncf(o)
{
    return /*('function' === typeof o) &&* ('AsyncFunction' === o.constructor.name);
}*/
// http://jsperf.com/instanceof-array-vs-array-isarray/6
function is_array(o)
{
    return o && (/*(o.constructor === Arr)*/(o instanceof Arr) || ('[object Array]' === toString.call(o)));
}
function is_object(o)
{
    return o && (/*(o.constructor === Obj)(o instanceof Obj) ||*/ ('[object Object]' === toString.call(o)));
}
function count(mixed_var)
{
    return null == mixed_var
    ? 0
    : (is_array(mixed_var)
    ? mixed_var.length
    : (is_object(mixed_var)
    ? array_keys(mixed_var).length
    : 1));
}
function array_keys(o)
{
    if (is_callable(Object.keys)) return Object.keys(o);
    var v, k, l;
    if (is_array(o))
    {
        v = new Array(l=o.length);
        for(k=0; k<l; ++k)
            v[k] = String(k);
    }
    else
    {
        v = [];
        for (k in o)
            if (HAS.call(o, k))
                v.push(k);
    }
    return v;
}
function array_values(o)
{
    if (is_array(o)) return o;
    if (is_callable(Object.values)) return Object.values(o);
    var v = [], k;
    for (k in o)
        if (HAS.call(o, k))
            v.push(o[k]);
    return v;
}
function is_numeric_array(o)
{
    if (is_array(o)) return true;
    if (is_object(o))
    {
        var k = array_keys(o), i, l = k.length;
        for (i=0; i<l; ++i)
            if (i !== +k[i]) return false;
        return true;
    }
    return false;
}
function ltrim(str, charlist)
{
    return (str+'').replace(
        !charlist ? ltrim_re : RE('^[' + (charlist+'').replace(re_9, '\\$1') + ']+', 'g'),
    '');
}
function rtrim(str, charlist)
{
    return (str+'').replace(
        !charlist ? rtrim_re : RE('[' + (charlist+'').replace(re_9, '\\$1') + ']+$', 'g'),
    '');
}
function trim(str, charlist)
{
    return (str+'').replace(
        !charlist ? trim_re : RE('^[' + (charlist=(charlist+'').replace(re_9, '\\$1')) + ']+|[' + charlist + ']+$', 'g'),
    '');
}
function basename(s)
{
    var lastChar = s.charAt(s.length-1);
    if ('/' === lastChar || '\\' === lastChar)
    {
        s = s.slice(0, -1);
    }
    return s.split(DS_RE).pop();
}
function dirname(s)
{
    var lastChar = s.charAt(s.length-1);
    if ('/' === lastChar || '\\' === lastChar)
    {
        s = s.slice(0, -1);
    }
    return s.replace(BASENAME_RE, '');
}
function pad(s, len, ch)
{
    var sp = s.toString(), n = len-sp.length;
    return n > 0 ? new Array(n+1).join(ch||' ')+sp : sp;
}
function rawurlencode(str)
{
    // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
    // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
    return encodeURIComponent('' + str).replace(re_2, '%21').replace(re_3, '%27').replace(re_4, '%28').
    replace(re_5, '%29').replace(re_6, '%2A');
}
function urlencode(str)
{
    // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
    // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
    return encodeURIComponent('' + str).replace(re_2, '%21').replace(re_3, '%27').replace(re_4, '%28').
    replace(re_5, '%29').replace(re_6, '%2A').replace(re_7, '+');
}
function rawurldecode(str)
{
    return decodeURIComponent(''+str);
}
function urldecode(str)
{
    return rawurldecode(('' + str).split('+').join('%20'));
}
function parse_str(str)
{
    var strArr = str.replace(/^&+|&+$/g, '').split('&'),
        sal = strArr.length,
        i, j, ct, p, lastObj, obj, chr, tmp, key, value,
        postLeftBracketPos, keys, keysLen, lastkey,
        array = {}, possibleLists = [], prevkey, prevobj
    ;

    for (i=0; i<sal; ++i)
    {
        tmp = strArr[i].split('=');
        key = rawurldecode(trim(tmp[0]));
        value = (tmp.length < 2) ? '' : rawurldecode(trim(tmp[1]));

        j = key.indexOf('\x00');
        if (j > -1) key = key.slice(0, j);

        if (key && '[' !== key.charAt(0))
        {
            keys = [];

            postLeftBracketPos = 0;
            for (j=0; j<key.length; ++j)
            {
                if ('[' === key.charAt(j)  && !postLeftBracketPos)
                {
                    postLeftBracketPos = j + 1;
                }
                else if (']' === key.charAt(j))
                {
                    if (postLeftBracketPos)
                    {
                        if (!keys.length)
                        {
                            keys.push(key.slice(0, postLeftBracketPos - 1));
                        }
                        keys.push(key.substr(postLeftBracketPos, j - postLeftBracketPos));
                        postLeftBracketPos = 0;
                        if ('[' !== key.charAt(j + 1)) break;
                    }
                }
            }

            if (!keys.length) keys = [key];

            for (j=0; j<keys[0].length; ++j)
            {
                chr = keys[0].charAt(j);
                if (' ' === chr || '.' === chr || '[' === chr)
                {
                    keys[0] = keys[0].substr(0, j) + '_' + keys[0].substr(j + 1);
                }
                if ('[' === chr) break;
            }

            obj = array; key = null; lastObj = obj;
            lastkey = keys.length ? trim(keys[keys.length-1].replace(/^['"]|['"]$/g, '')) : null;
            for (j=0, keysLen=keys.length; j<keysLen; ++j)
            {
                prevkey = key;
                key = keys[ j ].replace(/^['"]|['"]$/g, '');
                prevobj = lastObj;
                lastObj = obj;

                if ('' !== trim(key) || 0 === j)
                {
                    if (!HAS.call(obj, key)) obj[key] = (j+1 === keysLen-1) && (''===lastkey) ? [] : {};
                    obj = obj[key];
                }
                else
                {
                    // To insert new dimension
                    /*ct = -1;
                    for ( p in obj )
                    {
                        if ( HAS.call(obj,p) )
                        {
                            if ( +p > ct && p.match(/^\d+$/g) )
                            {
                                ct = +p;
                            }
                        }
                    }
                    key = ct + 1;*/
                    key = true;
                }
            }
            if (true === key)
            {
                lastObj.push(value);
            }
            else
            {
                if (key == +key)
                    possibleLists.push({key:prevkey, obj:prevobj});
                lastObj[key] = value;
            }
        }
    }
    for (i=possibleLists.length-1; i>=0; --i)
    {
        // safe to pass multiple times same obj, it is possible
        obj = possibleLists[i].key ? possibleLists[i].obj[possibleLists[i].key] : possibleLists[i].obj;
        if (is_numeric_array(obj))
        {
            obj = array_values(obj);
            if (possibleLists[i].key)
                possibleLists[i].obj[possibleLists[i].key] = obj;
            else
                array = obj;
        }
    }
    return array;
}
function http_build_query_helper(key, val, arg_separator, PHP_QUERY_RFC3986)
{
    var k, tmp, encode = PHP_QUERY_RFC3986 ? rawurlencode : urlencode;

    if (true === val) val = "1";
    else if (false === val) val = "0";

    if (null != val)
    {
        if ("object" === typeof(val))
        {
            tmp = [];
            for (k in val)
            {
                if (HAS.call(val, k) && null != val[k])
                {
                    tmp.push(http_build_query_helper(key + "[" + k + "]", val[k], arg_separator, PHP_QUERY_RFC3986));
                }
            }
            return tmp.join(arg_separator);
        }
        else
        {
            return encode(key) + "=" + encode(val);
        }
    }
    else
    {
        return '';
    }
}
function http_build_query(data, arg_separator, PHP_QUERY_RFC3986)
{
    var value, key, query, tmp = [];

    if (arguments.length < 2) arg_separator = "&";
    if (arguments.length < 3) PHP_QUERY_RFC3986 = false;

    for (key in data)
    {
        if (!HAS.call(data, key)) continue;
        value = data[key];
        query = http_build_query_helper(key, value, arg_separator, PHP_QUERY_RFC3986);
        if ('' != query) tmp.push(query);
    }

    return tmp.join(arg_separator);
}
function php_time()
{
    return floor(new Date().getTime() / 1000);
}
function php_date(format, timestamp)
{
    var formatted_datetime, f, i, l, jsdate,
        locale = default_date_locale
    ;

    // JS Date
    if (timestamp instanceof Date) jsdate = new Date(timestamp);
    // UNIX timestamp (auto-convert to int)
    else if ("number" === typeof timestamp) jsdate = new Date(timestamp * 1000);
    // undefined
    else/*if ( null === timestamp  || undef === timestamp )*/ jsdate = new Date();

    var D = {}, tzo = jsdate.getTimezoneOffset(), atzo = abs(tzo), m = jsdate.getMonth(), jmod10;
    // 24-Hours; 0..23
    D.G = jsdate.getHours();
    // Day of month; 1..31
    D.j = jsdate.getDate(); jmod10 = D.j%10;
    // Month; 1...12
    D.n = m + 1;
    // Full year; e.g. 1980...2010
    D.Y = jsdate.getFullYear();
    // Day of week; 0[Sun]..6[Sat]
    D.w = jsdate.getDay();
    // ISO-8601 day of week; 1[Mon]..7[Sun]
    D.N = D.w || 7;
    // Day of month w/leading 0; 01..31
    D.d = pad(D.j, 2, '0');
    // Shorthand day name; Mon...Sun
    D.D = locale.day_short[D.w];
    // Full day name; Monday...Sunday
    D.l = locale.day[D.w];
    // Ordinal suffix for day of month; st, nd, rd, th
    D.S = locale.ordinal.ord[D.j] ? locale.ordinal.ord[D.j] : (locale.ordinal.ord[jmod10] ? locale.ordinal.ord[jmod10] : locale.ordinal.nth);
    // Day of year; 0..365
    D.z = round((new Date(D.Y, m, D.j) - new Date(D.Y, 0, 1)) / 864e5);
    // ISO-8601 week number
    D.W = pad(1 + round((new Date(D.Y, m, D.j - D.N + 3) - new Date(D.Y, 0, 4)) / 864e5 / 7), 2, '0');
    // Full month name; January...December
    D.F = locale.month[m];
    // Month w/leading 0; 01...12
    D.m = pad(D.n, 2, '0');
    // Shorthand month name; Jan...Dec
    D.M = locale.month_short[m];
    // Days in month; 28...31
    D.t = (new Date(D.Y, m+1, 0)).getDate();
    // Is leap year?; 0 or 1
    D.L = D.Y % 4 === 0 & D.Y % 100 !== 0 | D.Y % 400 === 0;
    // ISO-8601 year
    D.o = D.Y + (11 === m && D.W < 9 ? 1 : (0 === m && D.W > 9 ? -1 : 0));
    // Last two digits of year; 00...99
    D.y = D.Y.toString().slice(-2);
    // am or pm
    D.a = D.G > 11 ? locale.meridian.pm : locale.meridian.am;
    // AM or PM
    D.A = D.G > 11 ? locale.meridian.PM : locale.meridian.AM;
    // Swatch Internet time; 000..999
    D.B = pad(floor((jsdate.getUTCHours() * 36e2 + jsdate.getUTCMinutes() * 60 + jsdate.getUTCSeconds() + 36e2) / 86.4) % 1e3, 3, '0');
    // 12-Hours; 1..12
    D.g = (D.G % 12) || 12;
    // 12-Hours w/leading 0; 01..12
    D.h = pad(D.g, 2, '0');
    // 24-Hours w/leading 0; 00..23
    D.H = pad(D.G, 2, '0');
    // Minutes w/leading 0; 00..59
    D.i = pad(jsdate.getMinutes(), 2, '0');
    // Seconds w/leading 0; 00..59
    D.s = pad(jsdate.getSeconds(), 2, '0');
    // Microseconds; 000000-999000
    D.u = pad(jsdate.getMilliseconds() * 1000, 6, '0');
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
    for (i=0,l=format.length; i<l; ++i)
    {
        f = format.charAt(i);
        formatted_datetime += HAS.call(D, f) ? D[f] : f;
    }
    return formatted_datetime;
}
function pad_(s, n, c, right)
{
    if (null == c) c = ' ';
    var str = String(s), l = str.length, p = l < n ? new Array(n-l+1).join(c) : '';
    return !!right ? str+p : p+str;
}
function justify(value, prefix, leftJustify, minWidth, zeroPad, customPadChar)
{
    var sv = String(value), diff = minWidth - sv.length;
    if (diff > 0)
    {
        if (leftJustify || !zeroPad)
            sv = pad_(sv, minWidth, customPadChar, leftJustify);
        else
            sv = sv.slice(0, prefix.length) + pad_('', diff, '0', true) + sv.slice(prefix.length);
    }
    return sv;
}
function formatBaseX(value, base, prefix, leftJustify, minWidth, precision, zeroPad)
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
function formatString(value, leftJustify, minWidth, precision, zeroPad, customPadChar)
{
    if (null != precision) value = value.slice(0, precision);
    return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
}
function sprintf()
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
    var do_format = function do_format(substring, valueIndex, flags, minWidth, _, precision, type) {
        var number, prefix, method, textTransform, value;
        if ('%%' == substring) return '%';

        // parse flags
        var leftJustify = false, positivePrefix = '', zeroPad = false, prefixBaseX = false,
            j, customPadChar = ' ', flagsl = flags.length;
        for (j=0; flags && j < flagsl; ++j)
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
        if (!minWidth) minWidth = 0;
        else if ('*' == minWidth) minWidth = +a[i++];
        else if ('*' == minWidth.charAt(0)) minWidth = +a[minWidth.slice(1, -1)];
        else minWidth = +minWidth;

        // Note: undocumented perl feature:
        if (0 > minWidth)
        {
            minWidth = -minWidth;
            leftJustify = true;
        }

        if (!isFinite(minWidth))
        {
            throw new Error('sprintf: (minimum-)width must be finite');
        }

        if (!precision) precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : undefined;
        else if ('*' == precision) precision = +a[i++];
        else if ('*' == precision.charAt(0)) precision = +a[precision.slice(1, -1)];
        else precision = +precision;

        // grab value using valueIndex if required?
        value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

        switch (type)
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
    return fmt.replace(sprintf.format_re, do_format);
}
sprintf.format_re = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;


// init the engine on load
Contemplate.init();

// export it
return Contemplate;
});