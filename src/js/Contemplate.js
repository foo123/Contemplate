/**
*  Contemplate
*  Light-weight Template Engine for PHP, Python, Node and client-side JavaScript
*
*  @version: 0.8.2.1
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
    
    var __version__ = "0.8.2.1", Contemplate, Template, InlineTemplate, 
    
        // auxilliaries
        PROTO = 'prototype', HAS = 'hasOwnProperty', 
        Obj = Object, Arr = Array, Str = String, Func = Function, 
        Keys = Obj.keys, parse_int = parseInt, parse_float = parseFloat,
        OP = Obj[PROTO], AP = Arr[PROTO], FP = Func[PROTO],
        _toString = OP.toString, //slice = AP.slice,
        isNode = "undefined" !== typeof(global) && '[object global]' === _toString.call(global),
        userAgent = "undefined"!==typeof(navigator) ? navigator.userAgent : "",
        isChrome = /Chrome\//.test(userAgent),
        
        // php-like functions, mostly adapted from phpjs project
        // http://jsperf.com/instanceof-array-vs-array-isarray/6
        is_array = function( o ) { 
            return o && ((o.constructor === Arr)/*(o instanceof Arr)*/ || ('[object Array]' === _toString.call(o))); 
        },
        is_object = function( o ) { 
            return o && ((o.constructor === Obj)/*(o instanceof Obj)*/ || ('[object Object]' === _toString.call(o))); 
        },
        count = function( mixed_var ) {
            if ( null === mixed_var || 'undefined' === typeof mixed_var ) return 0;
            else if ( is_array(mixed_var) ) return mixed_var.length;
            else if ( is_object(mixed_var) ) return Keys(mixed_var).length;
            return 1;
        },
        array_flip = function( trans ) {
            var cis = {}, k, key, keys = Keys(trans), kl = keys.length;
            for (k=0; k<kl; k++) { key = keys[ k ];  cis[ trans[ key ] ] = key; }
            return cis;
        },
        time = function( ) { return Math.floor(new Date().getTime() / 1000); },
        
        FUNC = function( a, f ) { return new Func( a, f ); },
        RE = function( r, f ) { return new RegExp( r, f||'' ); },
        
        fs = null, XMLHttp = null
        ,frealpath, frealpath_async
        ,fexists, fexists_async
        ,fstat, fstat_async
        ,fread, fread_async
        ,fwrite, fwrite_async
        
        ,re_1 = /([\s\S]*?)(&(?:#\d+|#x[\da-f]+|[a-zA-Z][\da-z]*);|$)/g
        ,re_2 = /!/g
        ,re_3 = /'/g
        ,re_4 = /\(/g
        ,re_5 = /\)/g
        ,re_6 = /\*/g
        ,re_7 = /%20/g
        ,re_8 = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g
        ,re_9 = /([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g
        
        ,date_words = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    ;

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

    function get_html_translation_table( table, quote_style )
    {
      var tblID, useTable = null,
        useQuoteStyle = null;

      useTable = !isNaN(table) ? get_html_translation_table.constMappingTable[table] : (table ? table.toUpperCase() : 'HTML_SPECIALCHARS');
      useQuoteStyle = !isNaN(quote_style) ? get_html_translation_table.constMappingQuoteStyle[quote_style] : (quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT');

      if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') 
      {
        throw new Error("Table: " + useTable + ' not supported');
        return;
      }
      // use cached table if exists
      tblID = useTable + '__' + useQuoteStyle;
      if ( get_html_translation_table.tbls[tblID] )  return get_html_translation_table.tbls[tblID];
      
      var entities = {},
        hash_map = {},
        decimal;
        
      entities['38'] = '&amp;';
      if ( useTable === 'HTML_ENTITIES' ) 
      {
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

      if ( useQuoteStyle !== 'ENT_NOQUOTES' ) 
      {
        entities['34'] = '&quot;';
      }
      if ( useQuoteStyle === 'ENT_QUOTES' ) 
      {
        entities['39'] = '&#39;';
      }
      entities['60'] = '&lt;';
      entities['62'] = '&gt;';


      // ascii decimals to real symbols
      for ( decimal in entities ) 
      {
        if ( entities.hasOwnProperty(decimal) ) 
        {
          hash_map[String.fromCharCode(decimal)] = entities[decimal];
        }
      }
      if ( useQuoteStyle === 'ENT_QUOTES' ) 
      {
        hash_map["'"] = '&#039;';
      }
      // cache the table
      return get_html_translation_table.tbls[tblID] = hash_map;
    }
    get_html_translation_table.constMappingTable = {};
    get_html_translation_table.constMappingQuoteStyle = {};
    // Translate arguments
    get_html_translation_table.constMappingTable[0] = 'HTML_SPECIALCHARS';
    get_html_translation_table.constMappingTable[1] = 'HTML_ENTITIES';
    get_html_translation_table.constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
    get_html_translation_table.constMappingQuoteStyle[2] = 'ENT_COMPAT';
    get_html_translation_table.constMappingQuoteStyle[3] = 'ENT_QUOTES';
    get_html_translation_table.tbls = {};

    function htmlentities( string, quote_style, charset, double_encode ) 
    {
      var hash_map = get_html_translation_table('HTML_ENTITIES', quote_style),
        symbol = '';
      string = string == null ? '' : string + '';

      if ( !hash_map ) 
      {
        return false;
      }

      if (!!double_encode || double_encode == null) {
        for (symbol in hash_map) {
          if (hash_map.hasOwnProperty(symbol)) {
            string = string.split(symbol).join(hash_map[symbol]);
          }
        }
      } else {
        string = string.replace(re_1, function (ignore, text, entity) {
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
    
    function urlencode( str ) 
    {
        // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
        // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
        return encodeURIComponent('' + str).replace(re_2, '%21').replace(re_3, '%27').replace(re_4, '%28').
        replace(re_5, '%29').replace(re_6, '%2A').replace(re_7, '+');
    }
    function rawurlencode( str )
    {
        // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
        // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
        return encodeURIComponent('' + str).replace(re_2, '%21').replace(re_3, '%27').replace(re_4, '%28').
        replace(re_5, '%29').replace(re_6, '%2A');
    }
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
    function date( format, timestamp )
    {
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
    
    function _localized_date( locale, format, timestamp ) 
    {
        var i, l = date_words.length, ldate = date(format, timestamp);
        
        // localize days/months
        for (i=0; i<l; i++)
        {
            if ( locale[HAS](date_words[i]) ) 
                ldate = ldate.split(date_words[i]).join(locale[date_words[i]]);
        }
        
        // return localized date
        return ldate;
    }
    
    
    /////////////////////////////////////////////////////////////////////////////////////
    //
    //  Contemplate Engine Main Class
    //
    //////////////////////////////////////////////////////////////////////////////////////
    
    // private vars
    var 
        $__isInited = false,  $__locale = {}, $__plurals = {},
        
        $__async = false, $__cacheMode = 0, $__cacheDir = './', $__cache = {}, $__templates = {}, 
        $__partials = {}, 
        
        $__leftTplSep = "<%", $__rightTplSep = "%>", $__tplStart = "", $__tplEnd = "", $__tplPrefixCode = "",
        
        $__preserveLinesDefault = "' + \"\\n\" + '", $__preserveLines = '',  
        $__EOL = "\n", $__TEOL = isNode ? require('os').EOL : "\n", $__escape = true,
        
        $__stack = null, $__level = 0, $__pad = "    ", $__idcnt = 0,
        $__locals, $__variables, $__loops = 0, $__ifs = 0, $__loopifs = 0, $__forType = 2,
        $__allblocks = null, $__allblockscnt = null,  $__openblocks = null,
        $__currentblock, $__startblock = null, $__endblock = null, $__blockptr = -1,
        $__extends = null, $__strings = null,
    
        $__uuid = 0,
        
        UNDERLN = /[\W]+/g, NEWLINE = /\n\r|\r\n|\n|\r/g, SQUOTE = /'/g,
        ALPHA = /^[a-zA-Z_]/, NUM = /^[0-9]/, ALPHANUM = /^[a-zA-Z0-9_]/i, SPACE = /^\s/,
        
        re_amp = /&/g, re_lt = /</g, re_gt = />/g, re_quot = /"/g, re_quot_s = SQUOTE,
        
        re_plugin = /^(plg_|plugin_)([a-zA-Z0-9_]+)/,
        re_controls = /(\t|[ ]?)[ ]*%([a-zA-Z_][a-zA-Z0-9_]*)\b[ ]*(\()(.*)$/g,
        
        $__controlConstructs = [
            'set', 'unset', 'isset',
            'if', 'elseif', 'else', 'endif',
            'for', 'elsefor', 'endfor',
            'extends', 'block', 'endblock',
            'include'
        ],
        
        $__funcs = [ 
            's', 'n', 'f', 'q', 'dq', 
            'echo', 'time', 'count',
            'lowercase', 'uppercase', 'ucfirst', 'lcfirst', 'sprintf',
            'date', 'ldate', 'locale', 'pluralise',
            'inline', 'tpl', 'uuid', 'haskey',
            'concat', 'ltrim', 'rtrim', 'trim', 'addslashes', 'stripslashes',
            'camelcase', 'snakecase', 
            'e','html', 'url',
            'htmlselect', 'htmltable'
        ],
        $__func_aliases = {
            'l': 'locale',
            'now': 'time',
            'template': 'tpl'
        },
        
        $__plugins = { },
        
        resetState = function( ) {
            // reset state
            $__loops = 0; $__ifs = 0; $__loopifs = 0; $__forType = 2; $__level = 0;
            $__allblocks = []; $__allblockscnt = {}; $__openblocks = [[null, -1]];
            $__extends = null; $__locals = {}; $__variables = {}; $__currentblock = '_';
            $__locals[$__currentblock] = $__locals[$__currentblock] || {};
            $__variables[$__currentblock] = $__variables[$__currentblock] || {};
            //$__escape = true;
        },
        
        clearState = function( ) {
            // clear state
            $__loops = 0; $__ifs = 0; $__loopifs = 0; $__forType = 2; $__level = 0;
            $__allblocks = null; $__allblockscnt = null; $__openblocks = null;
            /*$__extends = null;*/ $__locals = null; $__variables = null; $__currentblock = null;
            $__idcnt = 0; $__stack = [];
            $__strings = null;
        },
        
        pushState = function( ) {
            // push state
            $__stack.push([$__loops, $__ifs, $__loopifs, $__forType, $__level,
            $__allblocks, $__allblockscnt, $__openblocks, $__extends, $__locals, $__variables, $__currentblock]);
        },
        
        popState = function( ) {
            // pop state
            var t = $__stack.pop( );
            $__loops = t[0]; $__ifs = t[1]; $__loopifs = t[2]; $__forType = t[3]; $__level = t[4];
            $__allblocks = t[5]; $__allblockscnt = t[6]; $__openblocks = t[7];
            $__extends = t[8]; $__locals = t[9]; $__variables = t[10]; $__currentblock = t[11];
        },
        
        // pad lines to generate formatted code
        padLines = function( lines, level ) {
            if ( 2 > arguments.length ) level = $__level;
            
            if ( level >= 0 )
            {
                // needs one more additional level due to array.length
                level = (0===level) ? level : level+1;
                var pad = new Arr(level).join($__pad);
                lines = pad + (lines.split( NEWLINE ).join( $__TEOL + pad ));
            }
            return lines;
        },
        
        merge = function( ) {
            var args = arguments, l = args.length;
            if ( l < 1 ) return;
            var merged = args[0], i, k, o;
            for (i=1; i<l; i++)
            { 
                o = args[ i ]; 
                if ( o ) 
                { 
                    for (k in o) 
                    { 
                        if ( o[HAS](k) ) 
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
                if( $__leftTplSep == null && $__rightTplSep == null ){
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
            }
            return text;
        },
    
        // faster html escape
        // http://jsperf.com/split-join-vs-regex-replace/10
        ESC1 = function( s ) {
            var i = 0, l = s.length, r = '', c;
            while ( i < l ) 
            {
                c = s.charAt( i++ );
                switch( c.charCodeAt( 0 ) )
                {
                    case 34: r += '&quot;'; break;
                    case 38: r += '&amp;'; break;
                    case 39: r += "&#39;"; break;
                    case 60: r += "&lt;"; break;
                    case 62: r += "&gt;"; break;
                    default: r += c;
                }
            }
            return r;
        },
        /*
        // second-third faster html escape
        // http://jsperf.com/htmlencoderegex
        // http://jsperf.com/htmlencoderegex/53
        ESC2 = function( s ) {
            return s
                // http://jsperf.com/replace-vs-split-join-vs-replaceall/28
                // http://jsperf.com/replace-multi-patterns-in-a-string
                .replace(re_amp, '&amp;')
                .replace(re_lt, '&lt;')
                .replace(re_gt, '&gt;')
                .replace(re_quot, '&quot;')
                .replace(re_quot_s, '&#39;')
            ;
        },*/
        
        getTemplateContents = function( id, asyncCB ) {
            var template;
            if ( (template=$__templates[id]) )
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
        },
        
        //
        // Control structures
        //
    
        // whether var is set
        t_isset = function( varname ) {
            return '("undefined" !== typeof(' + varname + '))';
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
            return "';" + $__TEOL; 
        },
        
        // if
        t_if = function( cond ) { 
            var out = "';" + padLines( TT_IF({
                    'EOL': $__TEOL,
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
                    'EOL': $__TEOL,
                    'ELIFCOND': cond
                }) );
            $__level++;
            
            return out;
        },
        
        // else
        t_else = function( ) { 
            $__level--;
            var out = "';" + padLines( TT_ELSE({ 
                'EOL': $__TEOL
            }) );
            $__level++;
            
            return out;
        },
        
        // endif
        t_endif = function( ) { 
            $__ifs--; 
            $__level--;
            var out = "';" + padLines( TT_ENDIF({ 
                'EOL': $__TEOL
            }) );
            
            return out;
        },
        
        // for, foreach
        t_for = function( for_expr ) {
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
        },
        
        // elsefor
        t_elsefor = function( ) { 
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
        },
        
        // include file
        t_include = function( id/*, asyncCB*/ ) {
            id = trim( id );
            if ( $__strings && $__strings[HAS](id) ) id = $__strings[id];
            var ch = id.charAt(0);
            if ( '"' === ch || "'" === ch ) id = id.slice(1,-1); // quoted id
            // cache it
            if ( !$__partials[id] )
            {
                pushState();
                resetState();
                $__partials[id] = " " + parse( getSeparators( getTemplateContents( id ) ), false ) + "';" + $__TEOL;
                popState();
            }
            return padLines( $__partials[id] );
        },
        
        // extend another template
        t_extends = function( id ) { 
            id = trim( id );
            if ( $__strings && $__strings[HAS](id) ) id = $__strings[id];
            var ch = id.charAt(0);
            if ( '"' === ch || "'" === ch ) id = id.slice(1,-1); // quoted id
            
            $__extends = id;
            return "';" + $__TEOL; 
        },
        
        // define (overridable) block
        t_block = function( block ) { 
            block = trim( block );
            if ( $__strings && $__strings[HAS](block) ) block = $__strings[block];
            var ch = block.charAt(0);
            if ( '"' === ch || "'" === ch ) block = block.slice(1,-1); // quoted block
            
            $__allblocks.push( [block, -1, -1, 0, $__openblocks[ 0 ][ 1 ]] );
            $__allblockscnt[ block ] = $__allblockscnt[ block ] ? ($__allblockscnt[ block ]+1) : 1;
            $__blockptr = $__allblocks.length;
            $__openblocks.unshift( [block, $__blockptr-1] );
            $__startblock = block;
            $__endblock = null;
            $__currentblock = block;
            $__locals[$__currentblock] = $__locals[$__currentblock] || {};
            $__variables[$__currentblock] = $__variables[$__currentblock] || {};
            return "' +  #|" + block + "|#";
        },
        
        // end define (overridable) block
        t_endblock = function( ) { 
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
    
        parseConstructs = function parseConstructs( match, prefix, ctrl, startParen, rest )  {
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
                }
            }
            
            if ( $__func_aliases[HAS](ctrl) ) 
                ctrl = $__func_aliases[ctrl];
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
            
            m = ctrl.match( re_plugin );
            if ( m && m[2] && $__plugins[HAS](m[2]) )
            {
                // allow custom plugins as template functions
                prefix = prefix || '';
                var pl = $__plugins[ m[2] ];
                args = args.replace( re_controls, parseConstructs );
                out = ((pl instanceof Contemplate.InlineTemplate) ? pl.render( ) : pl) + '(' + args + ')';
                rest = rest.replace( re_controls, parseConstructs );
                return prefix + out + rest;
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
                tag = "#|" + block + "|#";
                rep = "__i__.renderBlock('" + block + "', data);";
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
        },
        
        parseVariable = function parseVariable( s, i, l )  {
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
        },
        
        parse = function( tpl, withblocks ) {
            var parts, len, parsed, s, i, isTag,
                tag, tagTpl, strings, variables, hasVariables, hasStrings, varname, id,
                countl, index, ch, out, tok, v, tokv, 
                multisplit_re = Contemplate.InlineTemplate.multisplit_re,
                special_chars = "$ \n\r\t\v'\"", ind,
                q, str_, escaped, si, space,
                str_re = /#STR\d+#/g
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
                    
                    // replacements
                    /*.replace( re_repls, "' + ($1) + '" );*/
                    if ( 9 === tag.charCodeAt(0) && 11 === tag.charCodeAt(tag.length-1) ) 
                        tag = "' + ("+tag.slice(1,-1)+") + '";
                    
                    // replace variables
                    if ( hasVariables )
                    {
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
                    
                    // replace strings (accurately)
                    if ( hasStrings )
                    {
                        tagTpl = multisplit_re(tag, str_re);
                        tag = '';
                        for (v=0; v<tagTpl.length; v++)
                        {
                            tag += (tagTpl[v][0] ? tagTpl[v][1] : strings[ tagTpl[v][1] ]);
                        }
                    }
                    
                    // replace tpl separators
                    if ( /*"\v"*/11 === tag.charCodeAt(tag.length-1) ) tag = tag.slice(0,-1) + padLines($__tplEnd);
                    if ( /*"\t"*/9 === tag.charCodeAt(0) ) tag = $__tplStart + tag.slice(1);
                    
                    // replace blocks
                    if ( $__startblock )
                    {
                        $__startblock = "#|"+$__startblock+"|#";
                        $__allblocks[ $__blockptr-1 ][ 1 ] = parsed.length + tag.indexOf( $__startblock );
                    }
                    else if ( $__endblock )
                    {
                        $__endblock = "#|/"+$__endblock+"|#";
                        $__allblocks[ $__blockptr-1 ][ 2 ] = parsed.length + tag.indexOf( $__endblock ) + $__endblock.length;
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
            
            clearState();
            
            renderf = blocks[0];
            blocks = blocks[1];
            bl = blocks.length;
            
            if ($__extends)
            {
                func = TT_FUNC({
                            'EOL': $__TEOL,
                            'FCODE': padLines("__p__ = '';", 0)
                        });
            }
            else
            {
               // Convert the template into pure JavaScript
                func = TT_FUNC({
                            'EOL': $__TEOL,
                            'FCODE': padLines("__p__ = '" + renderf + "';", 0)
                        });
            }
            
            // defined blocks
            for (b=0; b<bl; b++) funcs[blocks[b][0]] = FUNC("Contemplate,data,__i__", blocks[b][1]);
            
            //return [FUNC("Contemplate,__i__", func), funcs];
            return [FUNC("Contemplate", func), funcs];
        },
        
        createCachedTemplate = function( id, filename, classname, seps ) {
            
            resetState();
            
            var  
                funcs = {}, prefixCode, extendCode, renderCode, b, bl, sblocks,
                blocks = parse( getSeparators( getTemplateContents( id ), seps ) ), renderf
            ;
            
            clearState();
            
            renderf = blocks[0];
            blocks = blocks[1];
            bl = blocks.length;
            
            // tpl-defined blocks
            sblocks = [];
            for (b=0; b<bl; b++) 
            {
                sblocks.push( $__TEOL + TT_BlockCode({
                                    'EOL': $__TEOL,
                                    'BLOCKNAME': blocks[b][0],
                                    'BLOCKMETHODNAME': blocks[b][0],
                                    'BLOCKMETHODCODE': padLines(blocks[b][1], 1)
                                }) );
            }
            if ( sblocks.length )
            {
                sblocks = $__TEOL + 
                            "this._blocks = { " + 
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
                extendCode = "this.extend('" + $__extends + "');";
                renderCode = TT_RCODE({
                    'EOL': $__TEOL,
                    'RCODE': "__p__ = '';"
                });
            }
            else
            {
                extendCode = '';
                renderCode = TT_RCODE({
                                'EOL': $__TEOL,
                                'RCODE': "__p__ += '" + renderf + "';"
                            });
            }
            
            if ( $__tplPrefixCode )  prefixCode = $__tplPrefixCode;
            else prefixCode = '';
            
          // generate tpl class
            var classCode = TT_ClassCode({
                                'EOL': $__TEOL,
                                'CLASSNAME': classname,
                                'TPLID': id,
                                'PREFIXCODE': prefixCode,
                                'EXTENDCODE': padLines(extendCode, 2),
                                'BLOCKS': padLines(sblocks, 2),
                                'RENDERCODE': padLines(renderCode, 2)
                            });
            
            return setCachedTemplate(filename, classCode);
        },
        
        getCachedTemplate = function( id, options ) {
            var template;
            if ( (template=$__templates[id]) )
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
                        funcs = createTemplateRenderFunction( id, options.separators ); 
                        tpl = Contemplate.Template( id ).setRenderFunction( funcs[ 0 ] ).setBlocks( funcs[ 1 ] );
                    }
                    if ($__extends) tpl.extend( Contemplate.tpl($__extends) );
                    return tpl;
                }
                
                else
                {
                    if ( !isNode ) $__cacheMode = Contemplate.CACHE_TO_DISK_NONE;
                    
                    if ( true !== options.autoUpdate && Contemplate.CACHE_TO_DISK_NOUPDATE === $__cacheMode )
                    {
                        var cachedTplFile = getCachedTemplateName(id), 
                            cachedTplClass = getCachedTemplateClass(id);
                        if ( !fexists(cachedTplFile) )
                        {
                            createCachedTemplate(id, cachedTplFile, cachedTplClass, options.separators);
                        }
                        if ( fexists(cachedTplFile) )
                        {
                            var tplclass = require( cachedTplFile )( Contemplate ), 
                                tpl = new tplclass( id )/*.setId( id )*/;
                            return tpl;
                        }
                        return null;
                    }
                    
                    else if ( true === options.autoUpdate || Contemplate.CACHE_TO_DISK_AUTOUPDATE === $__cacheMode )
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
                            var stat = fstat(cachedTplFile), stat2 = fstat(template[0]);
                            if ( stat.mtime.getTime() <= stat2.mtime.getTime() )
                            {
                                // is out-of-sync re-create it
                                createCachedTemplate(id, cachedTplFile, cachedTplClass, options.separators);
                            }
                        }
                        if ( fexists(cachedTplFile) )
                        {
                            var tplclass = require( cachedTplFile )( Contemplate ), 
                                tpl = new tplclass( id )/*.setId( id )*/;
                            return tpl;
                        }
                        return null;
                    }
                            
                    else
                    {    
                        // dynamic in-memory caching during page-request
                        var funcs = createTemplateRenderFunction( id, options.separators ), 
                            tpl = Contemplate.Template( id ).setRenderFunction( funcs[ 0 ] ).setBlocks( funcs[ 1 ] );
                        if ($__extends) tpl.extend( Contemplate.tpl($__extends) );
                        return tpl;
                    }
                }
            }
            return null;
        },
        
        setCachedTemplate = function( filename, tplContents, asyncCB ) { 
            if ( asyncCB )
                fwrite_async(filename, tplContents, Contemplate.ENCODING, asyncCB);
            else
                fwrite(filename, tplContents, Contemplate.ENCODING); 
        },
        
        // generated cached tpl class code as a "heredoc" template (for Node cached templates)
        TT_ClassCode,   
    
        // generated cached tpl block method code as a "heredoc" template (for Node cached templates)
        TT_BlockCode, TT_BLOCK,

        TT_IF, TT_ELSEIF, TT_ELSE, TT_ENDIF,
    
        TT_FOR1,TT_FOR2, TT_ELSEFOR, TT_ENDFOR1,TT_ENDFOR2,
    
        TT_FUNC, TT_RCODE
    ;
    
    
    /*
    *  Template Engine
    *
    */
    
    // can use inline templates for plugins etc.. to enable non-linear plugin compile-time replacement
    InlineTemplate = function InlineTemplate( tpl, replacements, compiled ) {
        var self = this;
        if ( !(self instanceof InlineTemplate) ) return new InlineTemplate(tpl, replacements, compiled);
        self.id = null;
        self._renderer = null;
        self.tpl = InlineTemplate.multisplit( tpl||'', replacements||{} );
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
    };
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
    
    Template = function Template( id ) {
        var self = this;
        if ( !(self instanceof Template) ) return new Template( id );
        self._renderer = null;
        self._blocks = null;
        self._extends = null;
        self.id = null;
        if ( id ) self.id = id; 
    };
    Template.renderProxy = function( data, __i__ ) {
        "use strict";
        return this._extends.render(data, __i__||this);
    };
    Template[PROTO] = {
        constructor: Template
        ,id: null
        
        ,_extends: null
        ,_blocks: null
        ,_renderer: null 
        
        // public methods
        ,dispose: function( ) {
            var self = this;
            self._renderer = null;
            self._blocks = null;
            self._extends = null;
            self.id = null;
            return self;
        }
        
        ,fixRenderer: function( ) { 
            var self = this, sprTpl = self._extends;
            if ( sprTpl && (sprTpl instanceof Template) )
            {
                self.render = Template.renderProxy;
            }
            else
            {
                if ( 'function' === typeof(self._renderer) ) self.render = self._renderer;
                else self.render = self.constructor[PROTO].render;
            }
            return self;
        }
        
        ,setId: function( id ) { 
            if ( id ) this.id = id;  
            return this; 
        }
        
        ,extend: function( tpl ) { 
            if ( tpl && tpl.substr )
                this._extends = Contemplate.tpl( tpl );
            else if ( tpl instanceof Template )
                this._extends = tpl;
            else
                this._extends = null;
            return this.fixRenderer( );
        }
        
        ,setRenderFunction: function( renderfunc ) { 
            if ( 'function' === typeof renderfunc )
                this._renderer = renderfunc( Contemplate );
            else
                this._renderer = null; 
            return this.fixRenderer( );
        }
        
        ,setBlocks: function( blocks ) { 
            if ( 'object' === typeof blocks )
            {
                this._blocks = merge(this._blocks||{}, blocks); 
            }
            return this; 
        }
        
        ,renderBlock: function( block, data, __i__ ) {
            __i__ = __i__ || this;
            var blocks = this._blocks;
            if ( blocks && blocks[HAS](block) ) return blocks[block](Contemplate, data, __i__);
            else if ( this._extends ) return this._extends.renderBlock(block, data, __i__);
            return '';
        }
        
        ,render: function( data, __i__ ) {
            var __p__ = '';
            return __p__;
        }
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
        
        init: function( ) {
            if ( $__isInited ) return;
            
            // pre-compute the needed regular expressions
            $__preserveLines = $__preserveLinesDefault;
            
            $__tplStart = "';" + $__TEOL;
            $__tplEnd = $__TEOL + "__p__ += '";
            
            // make compilation templates
            TT_ClassCode = InlineTemplate.compile(InlineTemplate.multisplit([
                "#PREFIXCODE#"
                ,"!function (root, moduleName, moduleDefinition) {"
                ,"    // export the module"
                ,"    var m;"
                ,"    // node, CommonJS, etc.."
                ,"    if ( 'object' === typeof(module) && module.exports ) module.exports = moduleDefinition();"
                ,"    // browser and AMD, etc.."
                ,"    else (root[ moduleName ] = m = moduleDefinition()) && ('function' === typeof(define) && define.amd && define(moduleName,[],function(){return m;}));"
                ,"}(this, '#CLASSNAME#', function( ){"
                ,"    \"use strict\";"
                ,"    return function( Contemplate ) {"
                ,"    /* Contemplate cached template '#TPLID#' */"
                ,"    "
                ,"    /* constructor */"
                ,"    function #CLASSNAME#(id)"
                ,"    {"
                ,"        /* initialize internal vars */"
                ,"        "
                ,"        this._renderer = null;"
                ,"        this._blocks = null;"
                ,"        this._extends = null;"
                ,"        this.id = id || null;"
                ,"        "
                ,"        /* tpl-defined blocks render code starts here */"
                ,"#BLOCKS#"
                ,"        /* tpl-defined blocks render code ends here */"
                ,"        "
                ,"        /* extend tpl assign code starts here */"
                ,"#EXTENDCODE#"
                ,"        /* extend tpl assign code ends here */"
                ,"    };"
                ,"    "
                ,"    /* extends main Contemplate.Template class */"
                ,"    #CLASSNAME#.prototype = Object.create(Contemplate.Template.prototype);"
                ,"    /* tpl render method */"
                ,"    #CLASSNAME#.prototype.render = function( data, __i__ ) {"
                ,"        \"use strict\";"
                ,"        var __p__ = '';"
                ,"        __i__ = __i__ || this;"
                ,"        /* tpl main render code starts here */"
                ,"#RENDERCODE#"
                ,"        /* tpl main render code ends here */"
                ,"        return __p__;"
                ,"    };"
                ,"    "
                ,"    // export it"
                ,"    return #CLASSNAME#;"
                ,"    };"
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
                ,"'#BLOCKMETHODNAME#': function( Contemplate, data, __i__ ) {"
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
                ,"var __p__ = '';"
                ,"__i__ = __i__ || this;"
                ,"#FCODE#"
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
        
        // add custom plugins as template functions
        addPlugin: function( name, pluginCode ) {
            if ( name && pluginCode )
            {
                if ( pluginCode instanceof Contemplate.InlineTemplate )
                {
                    $__plugins[ name ] = pluginCode;
                }
                else /*if ( 'function' === typeof plugin )*/
                {
                    $__plugins[ name ] = 'Contemplate.plg_' + name;
                    Contemplate[ "plg_" + name ] = pluginCode;
                    //Contemplate[ "plugin_" + name ] = pluginCode;
                }
            }
        },
    
        setPrefixCode: function( preCode ) {
            if ( preCode ) $__tplPrefixCode = '' + preCode;
        },
    
        setLocaleStrings: function( l ) { 
            if ( "object" === typeof l )
            {
                $__locale = merge($__locale, l); 
            }
        },
        
        clearLocaleStrings: function( ) { 
            $__locale = { }; 
        },
        
        setPlurals: function( plurals ) { 
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
            $__cacheMode = ( isNode ) ? mode : Contemplate.CACHE_TO_DISK_NONE; 
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
            if ( tpl instanceof Contemplate.Template )
            {
                // Provide some basic currying to the user
                return ( "object" === typeof data ) ? tpl.render( data ) : tpl;
            }
            options = merge({
                'autoUpdate': false,
                'refresh': false,
                'escape': true,
                'separators': null
            }, options);
            
            $__escape = false !== options.escape;
            
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.
            if ( !!options.refresh || !$__cache[ tpl ] )
            {
                $__cache[ tpl ] = getCachedTemplate( tpl, options );
            }
            
            var tmpl = $__cache[ tpl ];
            
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
        e: ESC1,
        
        // basic html escaping
        html: function( s, mode ) { 
            return htmlentities(s, mode || 'ENT_COMPAT', 'UTF-8'); 
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
            return $__locale[HAS](e) ? $__locale[e] : e; 
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
        htmltable: function( data, options ) {
            // clone data to avoid mess-ups
            data = merge({}, data);
            options = merge({}, options || {});
            var o='', tk='', header='', footer='', 
                k, rows=[], row, rl, r, i, j, l, vals, col, colvals, 
                class_odd, class_even, row_class, odd=false,
                hasRowTpl = options[HAS]('tpl_row'), 
                hasCellTpl = options[HAS]('tpl_cell'), 
                rowTpl = null, cellTpl = null
            ;
            
            if ( hasRowTpl )
            {
                if ( !(options['tpl_row'] instanceof Contemplate.InlineTemplate) )
                    options['tpl_row'] = Contemplate.InlineTemplate(options['tpl_row'], {'$row_class':'row_class','$row':'row'});
                rowTpl = options['tpl_row'];
            }
            if ( hasCellTpl )
            {
                if ( !(options['tpl_cell'] instanceof Contemplate.InlineTemplate) )
                    options['tpl_cell'] = Contemplate.InlineTemplate(options['tpl_cell'], {'$cell':'cell'});
                cellTpl = options['tpl_cell'];
            }
            
            o="<table";
            
            if (options['id']) o+=" id='"+options['id']+"'";
            if (options['class']) o+=" class='"+options['class']+"'";
            if (options['style']) o+=" style='"+options['style']+"'";
            if (options['data'])
            {
                for (k in options['data'])
                {
                    if (options['data'][HAS](k))
                        o+=" data-"+k+"='"+options['data'][k]+"'";
                }
            }
            o+=">";
                
            tk='';
            if ( options['header'] || options['footer'] )
                tk="<td>"+(Contemplate.keys(data)||[]).join('</td><td>')+"</td>";
                
            header = options['header'] ? "<thead><tr>"+tk+"</tr></thead>" : '';
            footer = options['footer'] ? "<tfoot><tr>"+tk+"</tr></tfoot>" : '';
            
            o+=header;
            
            // get data rows
            rows=[];
            vals=Contemplate.values(data) || [];
            for (i in vals)
            {
                if (vals[HAS](i))
                {
                    col=vals[i];
                    if (!is_array(col))  col=[col];
                    colvals=Contemplate.values(col) || [];
                    for (j=0, l=colvals.length; j<l; j++)
                    {
                        if (!rows[j]) rows[j]=new Arr(l);
                        rows[j][i]=colvals[j];
                    }
                }
            }
            
            class_odd = options['odd'] ? options['odd'] : 'odd';
            class_even = options['even'] ? options['even'] : 'even';
                
            // render rows
            odd=false;
            for (i=0, l=rows.length; i<l; i++)
            {
                row_class = odd ? class_odd : class_even;
                
                if ( hasCellTpl )
                {
                    row = '';
                    for (r=0,rl=rows[i].length; r<rl; r++)
                        row += cellTpl.render( {cell: rows[i][r]} );
                }
                else
                {
                    row = "<td>"+rows[i].join('</td><td>')+"</td>";
                }
                if ( hasRowTpl )
                {
                    o += rowTpl.render( {row_class: row_class, row: row} );
                }
                else
                {
                    o += "<tr class='"+row_class+"'>"+row+"</tr>";
                }
                
                odd=!odd;
            }
            rows=null;
            // strict mode error, top level indentifier
            //delete $rows;
            
            o+=footer;
            o+="</table>";
            return o;
        },
        
        // html select
        htmlselect: function( data, options ) {
            // clone data to avoid mess-ups
            data = merge({}, data);
            options = merge({}, options || {});
            var o='', k, k2, v, v2,
                hasOptionTpl = options[HAS]('tpl_option'), 
                optionTpl = null
            ;
            
            if ( hasOptionTpl )
            {
                if ( !(options['tpl_option'] instanceof Contemplate.InlineTemplate) )
                    options['tpl_option'] = new Contemplate.InlineTemplate(options['tpl_option'], {'$selected':'selected','$value':'value','$option':'option'});
                optionTpl = options['tpl_option'];
            }
            
            o="<select";
            
            if (options['multiple']) o+=" multiple";
            if (options['disabled']) o+=" disabled='disabled'";
            if (options['name']) o+=" name='"+options['name']+"'";
            if (options['id']) o+=" id='"+options['id']+"'";
            if (options['class']) o+=" class='"+options['class']+"'";
            if (options['style']) o+=" style='"+options['style']+"'";
            if (options['data'])
            {
                for (k in options['data'])
                {
                    if (options['data'][HAS](k))
                        o+=" data-"+k+"='"+options['data'][k]+"'";
                }
            }
            o+=">";
            
            if (options['selected'])
            {
                if (!is_array(options['selected'])) options['selected']=[options['selected']];
                options['selected']=array_flip(options['selected']);
            }
            else
                options['selected']={};
                
            if (options['optgroups'])
            {
                if (!is_array(options['optgroups'])) options['optgroups']=[options['optgroups']];
                options['optgroups']=array_flip(options['optgroups']);
            }
        
            for (k in data)
            {
                if (data[HAS](k))
                {
                    v=data[k];
                    if (options['optgroups'] && options['optgroups'][HAS](k))
                    {
                        o+="<optgroup label='"+k+"'>";
                        for  (k2 in v)
                        {
                            if (v[HAS](k2))
                            {
                                v2=v[k2];
                                if (options['use_key'])  v2=k2;
                                else if (options['use_value']) k2=v2;
                                    
                                if ( hasOptionTpl )
                                    o += optionTpl.render({
                                        value: k2,
                                        option: v2,
                                        selected: options['selected'][HAS](k2)?' selected="selected"' : ''
                                    });
                                else if (/*$options['selected'][$k2]*/ options['selected'][HAS](k2))
                                    o += "<option value='"+k2+"' selected='selected'>"+v2+"</option>";
                                else
                                    o += "<option value='"+k2+"'>"+v2+"</option>";
                            }
                        }
                        o+="</optgroup>";
                    }
                    else
                    {
                        if (options['use_key']) v=k;
                        else if (options['use_value']) k=v;
                            
                        if ( hasOptionTpl )
                            o += optionTpl.render({
                                value: k,
                                option: v,
                                selected: options['selected'][HAS](k)?' selected="selected"' : ''
                            });
                        else if (options['selected'][HAS](k))
                            o += "<option value='"+k+"' selected='selected'>"+v+"</option>";
                        else
                            o += "<option value='"+k+"'>"+v+"</option>";
                    }
                }
            }
            o+="</select>";
            return o;
        },
        
        getTemplateContents: getTemplateContents,
        
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


    // init the engine on load
    Contemplate.init();
    
    // export it
    // add it to global namespace to be available for sub-templates, same as browser
    //if ( isNode ) global.Contemplate = Contemplate;
    return Contemplate;
});
