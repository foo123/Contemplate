(function(root) {
    
   /*
    *  Simple light-weight javascript templating engine (part of php templating engine)
    *  @author: Nikos M.  http://nikos-web-development.netai.net/
    *  https://github.com/foo123/Contemplate
    *  version 0.4
    *
    *  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed
    *  http://ejohn.org/blog/javascript-micro-templating/
    *
    */
    
    // export using window object on browser, or export object on node,require
    var window=root, self;
    
    /////////////////////////////////////////////////////////////////////////
    //
    //   PHP functions adapted from phpjs project
    //   https://github.com/kvz/phpjs
    //
    ///////////////////////////////////////////////////////////////////////////
function get_html_translation_table (table, quote_style) {
  // http://kevin.vanzonneveld.net
  // +   original by: Philip Peterson
  // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: noname
  // +   bugfixed by: Alex
  // +   bugfixed by: Marco
  // +   bugfixed by: madipta
  // +   improved by: KELAN
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // +      input by: Frank Forte
  // +   bugfixed by: T.Wild
  // +      input by: Ratheous
  // %          note: It has been decided that we're not going to add global
  // %          note: dependencies to php.js, meaning the constants are not
  // %          note: real constants, but strings instead. Integers are also supported if someone
  // %          note: chooses to create the constants themselves.
  // *     example 1: get_html_translation_table('HTML_SPECIALCHARS');
  // *     returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}
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
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: nobbler
  // +    tweaked by: Jack
  // +   bugfixed by: Onno Marsman
  // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
  // +      input by: Ratheous
  // +   improved by: Rafal Kukawski (http://blog.kukawski.pl)
  // +   improved by: Dj (http://phpjs.org/functions/htmlentities:425#comment_134018)
  // -    depends on: get_html_translation_table
  // *     example 1: htmlentities('Kevin & van Zonneveld');
  // *     returns 1: 'Kevin &amp; van Zonneveld'
  // *     example 2: htmlentities("foo'bar","ENT_QUOTES");
  // *     returns 2: 'foo&#039;bar'
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
  // http://kevin.vanzonneveld.net
  // +   original by: Philip Peterson
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: AJ
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: travc
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Lars Fischer
  // +      input by: Ratheous
  // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Joris
  // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: This reflects PHP 5.3/6.0+ behavior
  // %        note 2: Please be aware that this function expects to encode into UTF-8 encoded strings, as found on
  // %        note 2: pages served as UTF-8
  // *     example 1: urlencode('Kevin van Zonneveld!');
  // *     returns 1: 'Kevin+van+Zonneveld%21'
  // *     example 2: urlencode('http://kevin.vanzonneveld.net/');
  // *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
  // *     example 3: urlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
  // *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'
  str = (str + '').toString();

  // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
  // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
  return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
  replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}
function rawurlencode (str) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // +      input by: travc
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Michael Grier
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // +      input by: Ratheous
  // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Joris
  // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: This reflects PHP 5.3/6.0+ behavior
  // %        note 2: Please be aware that this function expects to encode into UTF-8 encoded strings, as found on
  // %        note 2: pages served as UTF-8
  // *     example 1: rawurlencode('Kevin van Zonneveld!');
  // *     returns 1: 'Kevin%20van%20Zonneveld%21'
  // *     example 2: rawurlencode('http://kevin.vanzonneveld.net/');
  // *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
  // *     example 3: rawurlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
  // *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'
  str = (str + '').toString();

  // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
  // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
  return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
  replace(/\)/g, '%29').replace(/\*/g, '%2A');
}
function count (mixed_var, mode) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Waldo Malqui Silva
  // +   bugfixed by: Soren Hansen
  // +      input by: merabi
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Olivier Louvignes (http://mg-crea.com/)
  // *     example 1: count([[0,0],[0,-4]], 'COUNT_RECURSIVE');
  // *     returns 1: 6
  // *     example 2: count({'one' : [1,2,3,4,5]}, 'COUNT_RECURSIVE');
  // *     returns 2: 6
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
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Legaev Andrey
  // +   bugfixed by: Cord
  // +   bugfixed by: Manish
  // +   improved by: Onno Marsman
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Nathan Sepulveda
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: In php.js, javascript objects are like php associative arrays, thus JavaScript objects will also
  // %        note 1: return true in this function (except for objects which inherit properties, being thus used as objects),
  // %        note 1: unless you do ini_set('phpjs.objectsAsArrays', 0), in which case only genuine JavaScript arrays
  // %        note 1: will return true
  // *     example 1: is_array(['Kevin', 'van', 'Zonneveld']);
  // *     returns 1: true
  // *     example 2: is_array('Kevin van Zonneveld');
  // *     returns 2: false
  // *     example 3: is_array({0: 'Kevin', 1: 'van', 2: 'Zonneveld'});
  // *     returns 3: true
  // *     example 4: is_array(function tmp_a(){this.name = 'Kevin'});
  // *     returns 4: false
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
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      improved by: Pier Paolo Ramon (http://www.mastersoup.com/)
  // +      improved by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: array_flip( {a: 1, b: 1, c: 2} );
  // *     returns 1: {1: 'b', 2: 'c'}
  // *     example 2: ini_set('phpjs.return_phpjs_arrays', 'on');
  // *     example 2: array_flip(array({a: 0}, {b: 1}, {c: 2}))[1];
  // *     returns 2: 'b'

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
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: jd
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +   input by: P
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: array_keys( {firstname: 'Kevin', surname: 'van Zonneveld'} );
  // *     returns 1: {0: 'firstname', 1: 'surname'}

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
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      improved by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: array_values( {firstname: 'Kevin', surname: 'van Zonneveld'} );
  // *     returns 1: {0: 'Kevin', 1: 'van Zonneveld'}
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
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Erkekjetter
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Onno Marsman
  // *     example 1: ltrim('    Kevin van Zonneveld    ');
  // *     returns 1: 'Kevin van Zonneveld    '
  charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
  var re = new RegExp('^[' + charlist + ']+', 'g');
  return (str + '').replace(re, '');
}
function rtrim (str, charlist) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Erkekjetter
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Onno Marsman
  // +   input by: rem
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: rtrim('    Kevin van Zonneveld    ');
  // *     returns 1: '    Kevin van Zonneveld'
  charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');
  var re = new RegExp('[' + charlist + ']+$', 'g');
  return (str + '').replace(re, '');
}
function trim (str, charlist) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: mdsjack (http://www.mdsjack.bo.it)
  // +   improved by: Alexander Ermolaev (http://snippets.dzone.com/user/AlexanderErmolaev)
  // +      input by: Erkekjetter
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: DxGx
  // +   improved by: Steven Levithan (http://blog.stevenlevithan.com)
  // +    tweaked by: Jack
  // +   bugfixed by: Onno Marsman
  // *     example 1: trim('    Kevin van Zonneveld    ');
  // *     returns 1: 'Kevin van Zonneveld'
  // *     example 2: trim('Hello World', 'Hdle');
  // *     returns 2: 'o Wor'
  // *     example 3: trim(16, 1);
  // *     returns 3: 6
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
  // http://kevin.vanzonneveld.net
  // +   original by: GeekFG (http://geekfg.blogspot.com)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: metjay
  // +   improved by: HKM
  // *     example 1: timeStamp = time();
  // *     results 1: timeStamp > 1000000000 && timeStamp < 2000000000
  return Math.floor(new Date().getTime() / 1000);
}
function date (format, timestamp) {
  // http://kevin.vanzonneveld.net
  // +   original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
  // +      parts by: Peter-Paul Koch (http://www.quirksmode.org/js/beat.html)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: MeEtc (http://yass.meetcweb.com)
  // +   improved by: Brad Touesnard
  // +   improved by: Tim Wiel
  // +   improved by: Bryan Elliott
  //
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: David Randall
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Theriault
  // +  derived from: gettimeofday
  // +      input by: majak
  // +   bugfixed by: majak
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Alex
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Theriault
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Theriault
  // +   improved by: Thomas Beaucourt (http://www.webapp.fr)
  // +   improved by: JT
  // +   improved by: Theriault
  // +   improved by: Rafal Kukawski (http://blog.kukawski.pl)
  // +   bugfixed by: omid (http://phpjs.org/functions/380:380#comment_137122)
  // +      input by: Martin
  // +      input by: Alex Wilson
  // +   bugfixed by: Chris (http://www.devotis.nl/)
  // %        note 1: Uses global: php_js to store the default timezone
  // %        note 2: Although the function potentially allows timezone info (see notes), it currently does not set
  // %        note 2: per a timezone specified by date_default_timezone_set(). Implementers might use
  // %        note 2: this.php_js.currentTimezoneOffset and this.php_js.currentTimezoneDST set by that function
  // %        note 2: in order to adjust the dates in this function (or our other date functions!) accordingly
  // *     example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400);
  // *     returns 1: '09:09:40 m is month'
  // *     example 2: date('F j, Y, g:i a', 1062462400);
  // *     returns 2: 'September 2, 2003, 2:26 am'
  // *     example 3: date('Y W o', 1062462400);
  // *     returns 3: '2003 36 2003'
  // *     example 4: x = date('Y m d', (new Date()).getTime()/1000);
  // *     example 4: (x+'').length == 10 // 2009 01 09
  // *     returns 4: true
  // *     example 5: date('W', 1104534000);
  // *     returns 5: '53'
  // *     example 6: date('B t', 1104534000);
  // *     returns 6: '999 31'
  // *     example 7: date('W U', 1293750000.82); // 2010-12-31
  // *     returns 7: '52 1293750000'
  // *     example 8: date('W', 1293836400); // 2011-01-01
  // *     returns 8: '52'
  // *     example 9: date('W Y-m-d', 1293974054); // 2011-01-02
  // *     returns 9: '52 2011-01-02'
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
      // The following works, but requires inclusion of the very
      // large timezone_abbreviations_list() function.
/*              var abbr = '', i = 0, os = 0, default = 0;
      if (!tal.length) {
        tal = that.timezone_abbreviations_list();
      }
      if (that.php_js && that.php_js.default_timezone) {
        default = that.php_js.default_timezone;
        for (abbr in tal) {
          for (i=0; i < tal[abbr].length; i++) {
            if (tal[abbr][i].timezone_id === default) {
              return abbr.toUpperCase();
            }
          }
        }
      }
      for (abbr in tal) {
        for (i = 0; i < tal[abbr].length; i++) {
          os = -jsdate.getTimezoneOffset() * 60;
          if (tal[abbr][i].offset === os) {
            return abbr.toUpperCase();
          }
        }
      }
*/
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
function localized_date($locale, $format, $timestamp) 
{
    var $txt_words = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var $am_pm=['AM', 'PM', 'am', 'PM'];
    
    var $date=date($format, $timestamp);
    
    // localize days/months
    for (var i=0, l=$txt_words.length; i<l; i++)
    {
        if ($locale[$txt_words[i]])  $date=$date.replace($txt_words[i], $locale[$txt_words[i]]);
    }
    // localize am/pm
    for (var i=0, l=$am_pm.length; i<l; i++)
    {
        if ($locale[$am_pm[i]])  $date=$date.replace($am_pm[i], $locale[$am_pm[i]]);
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
    
    /////////////////////////////////////////////////////////////////////////////////////
    //
    //  Contemplate Engine Main Class
    //
    //////////////////////////////////////////////////////////////////////////////////////
    
    // private vars
    var 
        $__cacheMode=0, $__cache={}, $__templates={}, $__partials={},
        $__locale={}, $__leftTplSep="<%", $__rightTplSep="%>", $__preserveLines="' + \"\\n\" + '",
        $__stack=[],
        $loops=0, $ifs=0, $loopifs=0, $blockcnt=0, $blocks=[], $allblocks=[], $__extends=null,
    
        $regExps={
            'functions':null,
            'controlConstructs':null,
            'forExpr':null,
            'quotes':null,
            'specials':null,
            'replacements':null
        },
        
        $controlConstructs=[
            'if', 'elseif', 'else', 'endif', 
            'for', 'elsefor', 'endfor',
            'include', 'template', 'extends', 'block', 'endblock',
            'htmlselect', 'htmltable'
        ],
        $funcs=[ 'html', 'url', 'count', 'concat', 'ltrim', 'rtrim', 'trim', 'sprintf', 'now', 'date', 'ldate', 'q', 'dq', 'l', 's', 'n', 'f' ]
        ;
    
    /*
    *  Template Engine
    *
    */
    
    //
    //  Instance template method(s)
    //
    var ContemplateInstance=function($id, $renderFunc) 
    {
        this.id=null;  this.data=null;
        // private vars
        var $renderFunction=null, $parent=null, $blocks=null;
        
        if ($id) { this.id=$id; $renderFunction=$renderFunc; }
        
        // public methods
        this.setId=function($id) { if ($id) this.id=$id;  return this; };
        
        this.setParent=function(parent) { $parent=parent; return this;  };
        
        this.setRenderFunction=function($renderfunc) { $renderFunction=$renderfunc; return this; };
        
        this.setBlocks=function(blocks) { if (!$blocks) $blocks={}; $blocks=Contemplate.merge($blocks, blocks); return this; };
        
        this.renderBlock=function(block, __instance__) {
            if (!__instance__) __instance__=this;
            if ($blocks && $blocks[block]) return $blocks[block](__instance__);
            else if ($parent) return $parent.renderBlock(block, __instance__);
            return '';
        };
        
        this.render=function(data, __instance__) {
            var out='';
            if (!__instance__) __instance__=this;
            if ($parent) {out=$parent.render(data, __instance__);}
            else if ($renderFunction)  {__instance__.data=Contemplate.clonePHP(data); out=$renderFunction(__instance__);}
            this.data=null;
            return out;
        };
    };
    
    self={

        IS_NODEJS : false,
        NFS : null,
        ENC : 'utf8',
        
        // constants
        CACHE_TO_DISK_NONE : 0,
        CACHE_TO_DISK_AUTOUPDATE : 2,
        CACHE_TO_DISK_NOUPDATE : 4,
        
        init : function() {
            // pre-compute the needed regular expressions
            $regExps['controlConstructs']=new RegExp('\\t\\s*\%('+$controlConstructs.join('|')+')\\b\\s*\\((.*)\\)', 'g');
            $regExps['forExpr']=new RegExp('^\\s*\\$([a-z0-9_]+?)\\s* as \\s*\\$([a-z0-9_]+?)\\s*=>\\s*\\$([a-z0-9_]+)\\s*$', 'i');
            $regExps['quotes']=new RegExp('\'', 'g');
            $regExps['specials']=new RegExp('[\\r\\t]', 'g');
            $regExps['replacements']=new RegExp('\\t\\s*(.*?)\\s*'+$__rightTplSep, 'g');
            if ($funcs.length) $regExps['functions']=new RegExp('\%('+$funcs.join('|')+')\\b', 'g');
        },
        
        //
        // Main methods
        //
        setLocaleStrings : function($l) { $__locale = self.merge($__locale, $l); },
        
        setTemplateSeparators : function($left, $right)
        {
            if ($left)  $__leftTplSep=$left;
            if ($right) $__rightTplSep=$right;
            // recompute it
            if ($right)  $regExps['replacements']=new RegExp('\\t\\s*(.*?)\\s*'+$__rightTplSep, 'g');
        },
        
        setPreserveLines : function(b){ if('undefined'==typeof(b))b=true; if (b) $__preserveLines="' + \"\\n\" + '"; else $__preserveLines=""; },
        
        // whether working inside Node.js or not
        isNodeJs : function($bool, $fs) {
            self.IS_NODEJS=$bool;
            if ($bool) { /* filesystem I/O object of Nodejs */ self.NFS = $fs || require('fs'); }
            else { self.NFS = null; }
        },
        
        setCacheDir : function($dir) { $__cacheDir=rtrim($dir, '/')+'/';  },
        
        setCacheMode : function($mode) { $__cacheMode= (self.IS_NODEJS) ? $mode : self.CACHE_TO_DISK_NONE; },
        
        // add templates manually
        add : function($tpls) { $__templates=self.merge($__templates, $tpls);  },
    
        tpl : function($id, $data) {
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.
            if (!$__cache[$id])  $__cache[$id]=self.getCachedTemplate($id);
            
            var $tpl=$__cache[$id];
            
            // Provide some basic currying to the user
            if ($data)  return $tpl.render( $data );
            else  return $tpl;
        },
        
        
        //
        // Control structures
        //
    
        // if
        t_if : function($cond) { $ifs++; return "'; if ("+$cond+") { ";  },
        // elseif
        t_elseif : function($cond) { return "'; } else if ("+$cond+") { ";  },
        // else
        t_else : function() { return "'; } else { ";  },
        // endif
        t_endif : function() { $ifs--; return "'; } ";  },
        // for, foreach
        t_for : function($for_expr) {
            $loops++;  $loopifs++;
            var $m = $for_expr.match($regExps['forExpr']), $o="$"+$m[1], $k="$"+$m[2], $v="$"+$m[3];
            return "'; if ("+ $o +" && Object.keys("+ $o +").length) { for (var "+ $k +" in "+ $o +") { if (Contemplate.hasOwn("+ $o +", "+ $k +")) { var "+$v+"="+$o+"["+$k+"]; __instance__.data['"+$k+"']="+$k+"; __instance__.data['"+$v+"']="+$v+"; ";
        },
        // elsefor
        t_elsefor : function() { /* else attached to  for loop */ $loopifs--;  return "'; } } } else { "; },
        // endfor
        t_endfor : function() {
            if ($loopifs==$loops) { $loops--; $loopifs--;  return "'; } } } ";  }
            $loops--; return "'; } ";
        },
        // include file
        t_include : function($id) {
            // cache it
            if (!$__partials[$id])
            {
                //self.pushState();
                $__partials[$id]=" " + self.parse(self.getTemplateContents($id), false) + "'; ";
                //self.popState();
            }
            return $__partials[$id];
        },
        // include template
        t_template : function($args) {
            $args=$args.split(',');
            var $id=trim($args.shift());
            var $obj=$args.join(',').split($__preserveLines).join('').split('=>').join(':');
            return '\' + Contemplate.tpl("'+$id+'", '+$obj+'); ';
        },
        // extend another template
        t_extends : function($tpl) { $__extends=$tpl; return "'; "; },
        // define (overridable) block
        t_block : function($block) { $allblocks.push($block); $blockcnt++; $blocks.push($block); return "' +  __{{"+$block+"}}__";  },
        // end define (overridable) block
        t_endblock : function() { if ($blockcnt) {$blockcnt--; return "__{{/"+$blocks.pop()+"}}__";}  return '';  },
        // render html table
        t_table : function($args) {
            var $obj=$args.split($__preserveLines).join('').split('=>').join(':');
            return '\' + Contemplate.htmltable('+$obj+'); ';
        },
        // render html select
        t_select : function($args) {
            var $obj=$args.split($__preserveLines).join('').split('=>').join(':');
            return '\' + Contemplate.htmlselect('+$obj+'); ';
        },
        
        //
        // Basic template functions
        //
        
        // basic html escaping
        html : function($s) { return htmlentities($s, 'ENT_COMPAT', 'UTF-8'); },
        // basic url escaping
        url : function($s) { return urlencode($s); },
        // count items in array
        count : count,
        // quote
        q : function($e) { return "'"+$e+"'"; },
        // double quote
        dq : function($e) { return '"'+$e+'"';  },
        // to String
        s : function($e) { return (String)($e); },
        // to Integer
        n : function($e) { return parseInt($e, 10); },
        // to Float
        f : function($e) { return parseFloat($e, 10); },
        // Concatenate strings/vars
        concat : function() { return Array.prototype.slice.call(arguments).join(''); },
        // Trim strings in templates
        trim : trim,
        ltrim : ltrim,
        rtrim : rtrim,
        // Sprintf in templates
        sprintf : sprintf,
        
        //
        //  Localization functions
        //
        
        // current time in seconds
        now : function() { return time(); },
        // formatted date
        date : function($format, $time) { if (!$time) $time=time(); return date($format, $time); },
        // localized formatted date
        ldate : function($format, $time) { if (!$time) $time=time(); return localized_date($__locale, $format, $time); },
        locale : function($e) { return ($__locale[$e]) ? $__locale[$e] : $e; },
        l : function($e) { return self.locale($e); },
        
        //
        //  HTML elements
        //
        
        // html table
        htmltable : function($data, $options) {
            $options = $options || {};
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
            delete $rows;
            
            $o+=$footer;
            $o+="</table>";
            return $o;
        },
        
        // html select
        htmlselect : function($data, $options) {
            $options = $options || {};
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
        
        //
        // utility methods
        //
        doControlConstruct : function($m)  {
            if ($m[1])
            {
                switch($m[1])
                {
                    case 'if': return self.t_if($m[2]);  break;
                    case 'elseif':  return self.t_elseif($m[2]);  break;
                    case 'else': return self.t_else($m[2]);  break;
                    case 'endif': return self.t_endif($m[2]); break;
                    case 'for': return self.t_for($m[2]); break;
                    case 'elsefor': return self.t_elsefor($m[2]); break;
                    case 'endfor':  return self.t_endfor($m[2]);  break;
                    case 'extends':  return self.t_extends($m[2]);  break;
                    case 'block':  return self.t_block($m[2]);  break;
                    case 'endblock':  return self.t_endblock($m[2]);  break;
                    case 'template': return self.t_template($m[2]);  break;
                    case 'include':  return self.t_include($m[2]);  break;
                    case 'htmltable': return self.t_table($m[2]);  break;
                    case 'htmlselect': return self.t_select($m[2]);  break;
                }
            }
            return $m[0];
        },
        
        doBlocks : function($s) {
            var $blocks={}, $bl=$allblocks.length, $block, $code, $delim1, $delim2, $len1, $len2, $pos1, $pos2;
            while ($bl--)
            {
                $block=$allblocks.pop();
                $delim1='__{{'+$block+'}}__'; $delim2='__{{/'+$block+'}}__'; 
                $len1=$delim1.length; $len2=$len1+1; 
                $pos1=$s.indexOf($delim1); $pos2=$s.indexOf($delim2)-$pos1+$len2;
                $code=$s.substr($pos1, $pos2);
                if ($code!='')
                {
                    $s=$s.replace($code, " __instance__.renderBlock('"+$block+"'); ");
                    $code=$code.substring($len1, $code.length-$len2);
                    $blocks[$block]="var $__p__ = ''; with(__instance__.data) { " + $code + "'; } return $__p__;";
                }
            }
            return [$s, $blocks];
        },
        
        parseControlConstructs : function($s) {
            return $s
                .split($__rightTplSep).join("\n")
                .replace($regExps['controlConstructs'], function($m, $m1, $m2){ return self.doControlConstruct([$m, $m1, $m2]); })
                .split("\n").join($__rightTplSep);
        },
        
        parse : function($s, $withblocks) {
            $s=self.parseControlConstructs(
                    $s
                    .replace($regExps['specials'], " ")
                    .split($__leftTplSep).join("\t")
                    .replace($regExps['quotes'], "\\'")
                    .split("\n").join($__preserveLines) // preserve lines
               );
                
            if ($funcs.length) $s=$s.replace($regExps['functions'], "Contemplate.$1");
            
            if ('undefined'==typeof($withblocks)) $withblocks=true;
            if ($withblocks)
                return self.doBlocks(
                        $s.replace($regExps['replacements'], "' + ( $1 ) + '")
                            .split("\t").join("'; ")
                            .split($__rightTplSep).join(" $__p__ += '")
                    )
                    ;
            return $s.replace($regExps['replacements'], "' + ( $1 ) + '")
                        .split("\t").join("'; ")
                        .split($__rightTplSep).join(" $__p__ += '")
                ;
        },
        
        getCachedTemplateName : function($id) { return $__cacheDir + $id.replace(/[ -]/g,'_') + '.tpl.js'; },
        
        getCachedTemplateClass : function($id) { return 'Contemplate_' + $id.replace(/[ -]/g,'_') + '_Cached'; },
        
        getTemplateContents : function($id) {
            if ($__templates[$id])
            {
                // nodejs
                if (self.IS_NODEJS && self.NFS) { return self.NFS.readFileSync($__templates[$id], self.ENC); }
                // client-side js and DOM script-element given as template holder
                else if (0===$__templates[$id].indexOf('#')) { return window.document.getElementById($__templates[$id].substring(1)).innerHTML; }
                // client-side js and url given as template location
                else { return ajaxLoad('GET', $__templates[$id]); }
            }
            return '';
        },
        
        createTemplateRenderFunction : function($id) {
            self.resetState();
            var blocks=self.parse(self.getTemplateContents($id)), funcs={}, b;
            // main function
            var $func=
                // Introduce the data as local variables using with(){}
               // Convert the template into pure JavaScript
                "var $__p__ = ''; with(__instance__.data) { $__p__ += '" + blocks[0] + "'; } return $__p__;"
                ;
            // defined blocks
            for (b in blocks[1]) funcs[b]=new Function("__instance__", blocks[1][b]);
            return [new Function("__instance__", $func), funcs];
        },
        
        createCachedTemplate : function($id, $filename, $classname) {
            self.resetState();
            var blocks=self.parse(self.getTemplateContents($id)), funcs={}, b;
            // defined blocks
            var sblocks=[];
            for (b in blocks[1])  sblocks.push(" '"+b+"' : function(__instance__) { "+ blocks[1][b]+ "}");
            sblocks="$blocks={ " + sblocks.join(',') + "}; ";
            var parentCode='';
            if ($__extends) parentCode="this.setParent(Contemplate.tpl('"+$__extends+"'));";
            var $class=
                "(function(root) { " + "\n"
                +"/* Contemplate cached template '"+$id+"' */ " + "\n"
                +"function " + $classname + "($id) { this.id=$id; this.data=null; var $parent=null, $blocks=null; "
                +"this.setId=function($id) { if ($id) {this.id=$id;} return this; }; "
                +"this.setParent=function(parent) { $parent=parent; return this; }; "
                +"this.renderBlock=function(block, __instance__) { if (!__instance__) __instance__=this; "+sblocks+" if ($blocks && $blocks[block]) return $blocks[block](__instance__); else if ($parent) return $parent.renderBlock(block, __instance__); return ''; }; "
                +"this.render=function(data, __instance__) { "
                // Introduce the data as local variables using with(){}
               // Convert the template into pure JavaScript
                +"if (!__instance__) __instance__=this; var $__p__ = ''; if ($parent) {$__p__ = $parent.render(data, __instance__);} "
                +"else {__instance__.data = Contemplate.clonePHP(data); with(__instance__.data) { $__p__ += '" + blocks[0] + "'; }} "
                +"this.data=null; return $__p__; "
                +"}; "+parentCode+" }; if ('undefined' != typeof (module) && module.exports) {module.exports="+$classname+";} else if (typeof (exports) != 'undefined') {exports="+$classname+";}  else {root." + $classname + "="+$classname+";} })(this);"
                ;
            return self.setCachedTemplate($filename, $class);
        },
        
        getCachedTemplate : function($id) {
            
            if (!self.IS_NODEJS) $__cacheMode=self.CACHE_TO_DISK_NONE;
            switch($__cacheMode)
            {
                case self.CACHE_TO_DISK_NOUPDATE:
                    var $cachedTplFile=self.getCachedTemplateName($id);
                    var $cachedTplClass=self.getCachedTemplateClass($id);
                    if (!self.NFS.existsSync($cachedTplFile))
                    {
                        self.createCachedTemplate($id, $cachedTplFile, $cachedTplClass);
                    }
                    if (self.NFS.existsSync($cachedTplFile))
                    {
                        var $tplclass = require($cachedTplFile);
                        var $tpl = new $tplclass().setId($id);
                        return $tpl;
                    }
                    return null;
                    break;
                
                case self.CACHE_TO_DISK_AUTOUPDATE:
                    var $cachedTplFile=self.getCachedTemplateName($id);
                    var $cachedTplClass=self.getCachedTemplateClass($id);
                    if (!self.NFS.existsSync($cachedTplFile))
                    {
                        // if tpl not exist or is out-of-sync re-create it
                        self.createCachedTemplate($id, $cachedTplFile, $cachedTplClass);
                    }
                    else
                    {
                        var stat=self.NFS.statSync($cachedTplFile);
                        var stat2=self.NFS.statSync($__templates[$id]);
                        if (stat.mtime.getTime() <= stat2.mtime.getTime())
                        {
                            // if tpl not exist or is out-of-sync re-create it
                            self.createCachedTemplate($id, $cachedTplFile, $cachedTplClass);
                        }
                    }
                    if (self.NFS.existsSync($cachedTplFile))
                    {
                        var $tplclass = require($cachedTplFile);
                        var $tpl = new $tplclass().setId($id);
                        return $tpl;
                    }
                    return null;
                    break;
                case self.CACHE_TO_DISK_NONE:
                default:
                    // dynamic in-memory caching during page-request
                    var funcs=self.createTemplateRenderFunction($id);
                    var $tpl=new ContemplateInstance($id, funcs[0]).setBlocks(funcs[1]);
                    if ($__extends) $tpl.setParent(self.tpl($__extends));
                    return $tpl;
                    break;
            }
            return null;
        },
        
        setCachedTemplate : function($filename, $tplContents) { return self.NFS.writeFileSync($filename, $tplContents, self.ENC); },
        
        pushState : function() {
            $__stack.push({loops:$loops, loopifs:$loopifs, ifs:$ifs, blockcnt:$blockcnt, blocks:$blocks, allblocks:$allblocks, extends_:$__extends});
            // reset state
            $loops=0;  $ifs=0;  $loopifs=0;
            $blockcnt=0; $blocks=[];  $allblocks=[];  $__extends=null;
        },
        
        popState : function() {
            var state=$__stack.pop();
            $loops=state.loops; $ifs=state.ifs;  $loopifs=state.loopifs;
            $blockcnt=state.blockcnt; $blocks=state.blocks;  $allblocks=state.allblocks;  $__extends=state.extends_;
        },
        
        resetState : function() {
            // reset state
            $loops=0; $ifs=0; $loopifs=0;
            $blockcnt=0; $blocks=[];  $allblocks=[];  $__extends=null;
        },
        
        merge : function() {
            var args=Array.prototype.slice.call(arguments);
            
            if (args.length<1) return;
            
            var $merged=args.shift();
            for (var i=0, l=args.length; i<l; i++)
            {
                var o=args[i];
                if (o)
                {
                    for (var k in o) 
                    {
                        if (self.hasOwn(o, k))
                        {
                            $merged[k]=o[k];
                        }
                    }
                }
            }
            return $merged;
        },
        
        isArray : function( o ) {
            return Object.prototype.toString.call(o) === '[object Array]';
        },
        
        hasOwn : function(o, p) {
            return o /*&& p*/ && Object.prototype.hasOwnProperty.call(o, p);
        },
        
        clonePHP : function(o) {
            if (self.isArray(o)) return o.slice();
            var c=self.merge({}, o), n;
            // use php-style variables using '$' in front of var name
            for (n in c) { if (self.hasOwn(c, n)) { c['$'+n]=c[n]; delete c[n];} }
            return c;
        },
        
        log : function($m) {
            if ('undefined'!=typeof(console) && console.log)   console.log($m);
        }
    };
    
    // init the engine
    self.init();
    
    // export it
    if ('undefined' != typeof (module) && module.exports)    module.exports = self;
    else if ('undefined' != typeof (exports))    exports = self;
    else  root.Contemplate = self;
    // add it to global namespace to be available for sub-templates, same as browser
    if ('undefined' != typeof (global)) global.Contemplate = self;
    
})(this);