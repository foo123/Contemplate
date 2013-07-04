(function(){
    
    var php = {
        addslashes : function(str) {
          // http://kevin.vanzonneveld.net
          // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
          // +   improved by: Ates Goral (http://magnetiq.com)
          // +   improved by: marrtins
          // +   improved by: Nate
          // +   improved by: Onno Marsman
          // +   input by: Denny Wardhana
          // +   improved by: Brett Zamir (http://brett-zamir.me)
          // +   improved by: Oskar Larsson Hogfeldt (http://oskar-lh.name/)
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
            switch (n1) {
            case '\\':
              return '\\';
            case '0':
              return '\u0000';
            case '':
              return '';
            default:
              return n1;
            }
          });
        },
        
        implode : function(glue, pieces) {
          // http://kevin.vanzonneveld.net
          // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
          // +   improved by: Waldo Malqui Silva
          // +   improved by: Itsacon (http://www.itsacon.net/)
          // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
          // *     example 1: implode(' ', ['Kevin', 'van', 'Zonneveld']);
          // *     returns 1: 'Kevin van Zonneveld'
          // *     example 2: implode(' ', {first:'Kevin', last: 'van Zonneveld'});
          // *     returns 2: 'Kevin van Zonneveld'
          var i = '',
            retVal = '',
            tGlue = '';
          if (arguments.length === 1) {
            pieces = glue;
            glue = '';
          }
          if (typeof(pieces) === 'object') {
            if (Object.prototype.toString.call(pieces) === '[object Array]') {
              return pieces.join(glue);
            } 
            for (i in pieces) {
              retVal += tGlue + pieces[i];
              tGlue = glue;
            }
            return retVal;
          }
          return pieces;
        },
        
        explode : function(delimiter, string, limit) {

          if ( arguments.length < 2 || typeof delimiter == 'undefined' || typeof string == 'undefined' ) return null;
          if ( delimiter === '' || delimiter === false || delimiter === null) return false;
          if ( typeof delimiter == 'function' || typeof delimiter == 'object' || typeof string == 'function' || typeof string == 'object'){
            return { 0: '' };
          }
          if ( delimiter === true ) delimiter = '1';
          
          // Here we go...
          delimiter += '';
          string += '';
          
          var s = string.split( delimiter );
          

          if ( typeof limit === 'undefined' ) return s;
          
          // Support for limit
          if ( limit === 0 ) limit = 1;
          
          // Positive limit
          if ( limit > 0 ){
            if ( limit >= s.length ) return s;
            return s.slice( 0, limit - 1 ).concat( [ s.slice( limit - 1 ).join( delimiter ) ] );
          }

          // Negative limit
          if ( -limit >= s.length ) return [];
          
          s.splice( s.length + limit );
          return s;
        },
        
        ltrim : function(str, charlist) {
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
        },
        
        rtrim : function(str, charlist) {
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
        },
        
        trim : function(str, charlist) {
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
        },
        
        sprintf : function() {
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
        },
        
        printf : function() {
          // http://kevin.vanzonneveld.net
          // +   original by: Ash Searle (http://hexmen.com/blog/)
          // +   improved by: Michael White (http://getsprink.com)
          // +   improved by: Brett Zamir (http://brett-zamir.me)
          // -    depends on: sprintf
          // *     example 1: printf("%01.2f", 123.1);
          // *     returns 1: 6
          var body, elmt, d = this.window.document;
          var ret = '';

          var HTMLNS = 'http://www.w3.org/1999/xhtml';
          body = d.getElementsByTagNameNS ? (d.getElementsByTagNameNS(HTMLNS, 'body')[0] ? d.getElementsByTagNameNS(HTMLNS, 'body')[0] : d.documentElement.lastChild) : d.getElementsByTagName('body')[0];

          if (!body) {
            return false;
          }

          ret = this.sprintf.apply(this, arguments);

          elmt = d.createTextNode(ret);
          body.appendChild(elmt);

          return ret.length;
        },
        
        htmlspecialchars_decode : function(string, quote_style) {
          // http://kevin.vanzonneveld.net
          // +   original by: Mirek Slugen
          // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
          // +   bugfixed by: Mateusz "loonquawl" Zalega
          // +      input by: ReverseSyntax
          // +      input by: Slawomir Kaniecki
          // +      input by: Scott Cariss
          // +      input by: Francois
          // +   bugfixed by: Onno Marsman
          // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
          // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
          // +      input by: Ratheous
          // +      input by: Mailfaker (http://www.weedem.fr/)
          // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
          // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
          // *     example 1: htmlspecialchars_decode("<p>this -&gt; &quot;</p>", 'ENT_NOQUOTES');
          // *     returns 1: '<p>this -> &quot;</p>'
          // *     example 2: htmlspecialchars_decode("&amp;quot;");
          // *     returns 2: '&quot;'
          var optTemp = 0,
            i = 0,
            noquotes = false;
          if (typeof quote_style === 'undefined') {
            quote_style = 2;
          }
          string = string.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
          var OPTS = {
            'ENT_NOQUOTES': 0,
            'ENT_HTML_QUOTE_SINGLE': 1,
            'ENT_HTML_QUOTE_DOUBLE': 2,
            'ENT_COMPAT': 2,
            'ENT_QUOTES': 3,
            'ENT_IGNORE': 4
          };
          if (quote_style === 0) {
            noquotes = true;
          }
          if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
            quote_style = [].concat(quote_style);
            for (i = 0; i < quote_style.length; i++) {
              // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
              if (OPTS[quote_style[i]] === 0) {
                noquotes = true;
              } else if (OPTS[quote_style[i]]) {
                optTemp = optTemp | OPTS[quote_style[i]];
              }
            }
            quote_style = optTemp;
          }
          if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
            string = string.replace(/&#0*39;/g, "'"); // PHP doesn't currently escape if more than one 0, but it should
            // string = string.replace(/&apos;|&#x0*27;/g, "'"); // This would also be useful here, but not a part of PHP
          }
          if (!noquotes) {
            string = string.replace(/&quot;/g, '"');
          }
          // Put this in last place to avoid escape being double-decoded
          string = string.replace(/&amp;/g, '&');

          return string;
        },
        
        htmlspecialchars : function(string, quote_style, charset, double_encode) {
          // http://kevin.vanzonneveld.net
          // +   original by: Mirek Slugen
          // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
          // +   bugfixed by: Nathan
          // +   bugfixed by: Arno
          // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
          // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
          // +      input by: Ratheous
          // +      input by: Mailfaker (http://www.weedem.fr/)
          // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
          // +      input by: felix
          // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
          // %        note 1: charset argument not supported
          // *     example 1: htmlspecialchars("<a href='test'>Test</a>", 'ENT_QUOTES');
          // *     returns 1: '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;'
          // *     example 2: htmlspecialchars("ab\"c'd", ['ENT_NOQUOTES', 'ENT_QUOTES']);
          // *     returns 2: 'ab"c&#039;d'
          // *     example 3: htmlspecialchars("my "&entity;" is still here", null, null, false);
          // *     returns 3: 'my &quot;&entity;&quot; is still here'
          var optTemp = 0,
            i = 0,
            noquotes = false;
          if (typeof quote_style === 'undefined' || quote_style === null) {
            quote_style = 2;
          }
          string = string.toString();
          if (double_encode !== false) { // Put this first to avoid double-encoding
            string = string.replace(/&/g, '&amp;');
          }
          string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');

          var OPTS = {
            'ENT_NOQUOTES': 0,
            'ENT_HTML_QUOTE_SINGLE': 1,
            'ENT_HTML_QUOTE_DOUBLE': 2,
            'ENT_COMPAT': 2,
            'ENT_QUOTES': 3,
            'ENT_IGNORE': 4
          };
          if (quote_style === 0) {
            noquotes = true;
          }
          if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
            quote_style = [].concat(quote_style);
            for (i = 0; i < quote_style.length; i++) {
              // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
              if (OPTS[quote_style[i]] === 0) {
                noquotes = true;
              }
              else if (OPTS[quote_style[i]]) {
                optTemp = optTemp | OPTS[quote_style[i]];
              }
            }
            quote_style = optTemp;
          }
          if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
            string = string.replace(/'/g, '&#039;');
          }
          if (!noquotes) {
            string = string.replace(/"/g, '&quot;');
          }

          return string;
        },
        
        htmlentities : function(string, quote_style, charset, double_encode) {
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
        },
        
        html_entity_decode : function(string, quote_style) {
          // http://kevin.vanzonneveld.net
          // +   original by: john (http://www.jd-tech.net)
          // +      input by: ger
          // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
          // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
          // +   bugfixed by: Onno Marsman
          // +   improved by: marc andreu
          // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
          // +      input by: Ratheous
          // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
          // +      input by: Nick Kolosov (http://sammy.ru)
          // +   bugfixed by: Fox
          // -    depends on: get_html_translation_table
          // *     example 1: html_entity_decode('Kevin &amp; van Zonneveld');
          // *     returns 1: 'Kevin & van Zonneveld'
          // *     example 2: html_entity_decode('&amp;lt;');
          // *     returns 2: '&lt;'
          var hash_map = {},
            symbol = '',
            tmp_str = '',
            entity = '';
          tmp_str = string.toString();

          if (false === (hash_map = this.get_html_translation_table('HTML_ENTITIES', quote_style))) {
            return false;
          }

          // fix &amp; problem
          // http://phpjs.org/functions/get_html_translation_table:416#comment_97660
          delete(hash_map['&']);
          hash_map['&'] = '&amp;';

          for (symbol in hash_map) {
            entity = hash_map[symbol];
            tmp_str = tmp_str.split(entity).join(symbol);
          }
          tmp_str = tmp_str.split('&#039;').join("'");

          return tmp_str;
        },
        
        get_html_translation_table : function(table, quote_style) {
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
    };

/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/zf2 for the canonical source repository
 * @copyright Copyright (c) 2005-2013 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

/**
 * Context specific methods for use in secure output escaping
 */
var Escaper = function() {};
Escaper.prototype = {
    /**
     * Entity Map mapping Unicode codepoints to any available named HTML entities.
     *
     * While HTML supports far more named entities, the lowest common denominator
     * has become HTML5's XML Serialisation which is restricted to the those named
     * entities that XML supports. Using HTML entities would result in this error:
     *     XML Parsing Error: undefined entity
     *
     * @var array
     */
    $htmlNamedEntityMap : {
        34 : 'quot',         // quotation mark
        38 : 'amp',          // ampersand
        60 : 'lt',           // less-than sign
        62 : 'gt',           // greater-than sign
    },

    /**
     * Current encoding for escaping. If not UTF-8, we convert strings from this encoding
     * pre-escaping and back to this encoding post-escaping.
     *
     * @var string
     */
    $encoding : 'utf-8',

    /**
     * Holds the value of the special flags passed as second parameter to
     * htmlspecialchars(). We modify these for PHP 5.4 to take advantage
     * of the new ENT_SUBSTITUTE flag for correctly dealing with invalid
     * UTF-8 sequences.
     *
     * @var string
     */
    $htmlSpecialCharsFlags : 'ENT_QUOTES',

    /**
     * Static Matcher which escapes characters for HTML Attribute contexts
     *
     * @var callable
     */
    $htmlAttrMatcher : null,

    /**
     * Static Matcher which escapes characters for Javascript contexts
     *
     * @var callable
     */
    $jsMatcher : null,

    /**
     * Static Matcher which escapes characters for CSS Attribute contexts
     *
     * @var callable
     */
    $cssMatcher : null,

    /**
     * List of all encoding supported by this class
     *
     * @var array
     */
    $supportedEncodings : [
        'iso-8859-1',   'iso8859-1',    'iso-8859-5',   'iso8859-5',
        'iso-8859-15',  'iso8859-15',   'utf-8',        'cp866',
        'ibm866',       '866',          'cp1251',       'windows-1251',
        'win-1251',     '1251',         'cp1252',       'windows-1252',
        '1252',         'koi8-r',       'koi8-ru',      'koi8r',
        'big5',         '950',          'gb2312',       '936',
        'big5-hkscs',   'shift_jis',    'sjis',         'sjis-win',
        'cp932',        '932',          'euc-jp',       'eucjp',
        'eucjp-win',    'macroman'
    ],

    /**
     * Constructor: Single parameter allows setting of global encoding for use by
     * the current object. If PHP 5.4 is detected, additional ENT_SUBSTITUTE flag
     * is set for htmlspecialchars() calls.
     *
     * @param string $encoding
     * @throws Exception\InvalidArgumentException
     */
    public function __construct($encoding = null)
    {
        if ($encoding !== null) {
            $encoding = (string) $encoding;
            if ($encoding === '') {
                throw new Exception(
                    get_class($this) . ' constructor parameter does not allow a blank value'
                );
            }

            $encoding = strtolower($encoding);
            if (!in_array($encoding, $this->supportedEncodings)) {
                throw new Exception(
                    'Value of \'' . $encoding . '\' passed to ' . get_class($this)
                    . ' constructor parameter is invalid. Provide an encoding supported by htmlspecialchars()'
                );
            }

            $this->encoding = $encoding;
        }

        if (defined('ENT_SUBSTITUTE')) {
            $this->htmlSpecialCharsFlags|= ENT_SUBSTITUTE;
        }

        // set matcher callbacks
        $this->htmlAttrMatcher = array($this, 'htmlAttrMatcher');
        $this->jsMatcher       = array($this, 'jsMatcher');
        $this->cssMatcher      = array($this, 'cssMatcher');
    }

    /**
     * Return the encoding that all output/input is expected to be encoded in.
     *
     * @return string
     */
    public function getEncoding()
    {
        return $this->encoding;
    }

    /**
     * Escape a string for the HTML Body context where there are very few characters
     * of special meaning. Internally this will use htmlspecialchars().
     *
     * @param string $string
     * @return string
     */
    public function escapeHtml($string)
    {
        $result = htmlspecialchars($string, $this->htmlSpecialCharsFlags, $this->encoding);
        return $result;
    }

    /**
     * Escape a string for the HTML Attribute context. We use an extended set of characters
     * to escape that are not covered by htmlspecialchars() to cover cases where an attribute
     * might be unquoted or quoted illegally (e.g. backticks are valid quotes for IE).
     *
     * @param string $string
     * @return string
     */
    public function escapeHtmlAttr($string)
    {
        $string = $this->toUtf8($string);
        if ($string === '' || ctype_digit($string)) {
            return $string;
        }

        $result = preg_replace_callback('/[^a-z0-9,\.\-_]/iSu', $this->htmlAttrMatcher, $string);
        return $this->fromUtf8($result);
    }

    /**
     * Escape a string for the Javascript context. This does not use json_encode(). An extended
     * set of characters are escaped beyond ECMAScript's rules for Javascript literal string
     * escaping in order to prevent misinterpretation of Javascript as HTML leading to the
     * injection of special characters and entities. The escaping used should be tolerant
     * of cases where HTML escaping was not applied on top of Javascript escaping correctly.
     * Backslash escaping is not used as it still leaves the escaped character as-is and so
     * is not useful in a HTML context.
     *
     * @param string $string
     * @return string
     */
    public function escapeJs($string)
    {
        $string = $this->toUtf8($string);
        if ($string === '' || ctype_digit($string)) {
            return $string;
        }

        $result = preg_replace_callback('/[^a-z0-9,\._]/iSu', $this->jsMatcher, $string);
        return $this->fromUtf8($result);
    }

    /**
     * Escape a string for the URI or Parameter contexts. This should not be used to escape
     * an entire URI - only a subcomponent being inserted. The function is a simple proxy
     * to rawurlencode() which now implements RFC 3986 since PHP 5.3 completely.
     *
     * @param string $string
     * @return string
     */
    public function escapeUrl($string)
    {
        return rawurlencode($string);
    }

    /**
     * Escape a string for the CSS context. CSS escaping can be applied to any string being
     * inserted into CSS and escapes everything except alphanumerics.
     *
     * @param string $string
     * @return string
     */
    public function escapeCss($string)
    {
        $string = $this->toUtf8($string);
        if ($string === '' || ctype_digit($string)) {
            return $string;
        }

        $result = preg_replace_callback('/[^a-z0-9]/iSu', $this->cssMatcher, $string);
        return $this->fromUtf8($result);
    }

    /**
     * Callback function for preg_replace_callback that applies HTML Attribute
     * escaping to all matches.
     *
     * @param array $matches
     * @return string
     */
    protected function htmlAttrMatcher($matches)
    {
        $chr = $matches[0];
        $ord = ord($chr);

        /**
         * The following replaces characters undefined in HTML with the
         * hex entity for the Unicode replacement character.
         */
        if (($ord <= 0x1f && $chr != "\t" && $chr != "\n" && $chr != "\r")
            || ($ord >= 0x7f && $ord <= 0x9f)
        ) {
            return '&#xFFFD;';
        }

        /**
         * Check if the current character to escape has a name entity we should
         * replace it with while grabbing the integer value of the character.
         */
        if (strlen($chr) > 1) {
            $chr = $this->convertEncoding($chr, 'UTF-16BE', 'UTF-8');
        }

        $hex = bin2hex($chr);
        $ord = hexdec($hex);
        if (isset(static::$htmlNamedEntityMap[$ord])) {
            return '&' . static::$htmlNamedEntityMap[$ord] . ';';
        }

        /**
         * Per OWASP recommendations, we'll use upper hex entities
         * for any other characters where a named entity does not exist.
         */
        if ($ord > 255) {
            return sprintf('&#x%04X;', $ord);
        }
        return sprintf('&#x%02X;', $ord);
    }

    /**
     * Callback function for preg_replace_callback that applies Javascript
     * escaping to all matches.
     *
     * @param array $matches
     * @return string
     */
    protected function jsMatcher($matches)
    {
        $chr = $matches[0];
        if (strlen($chr) == 1) {
            return sprintf('\\x%02X', ord($chr));
        }
        $chr = $this->convertEncoding($chr, 'UTF-16BE', 'UTF-8');
        return sprintf('\\u%04s', strtoupper(bin2hex($chr)));
    }

    /**
     * Callback function for preg_replace_callback that applies CSS
     * escaping to all matches.
     *
     * @param array $matches
     * @return string
     */
    protected function cssMatcher($matches)
    {
        $chr = $matches[0];
        if (strlen($chr) == 1) {
            $ord = ord($chr);
        } else {
            $chr = $this->convertEncoding($chr, 'UTF-16BE', 'UTF-8');
            $ord = hexdec(bin2hex($chr));
        }
        return sprintf('\\%X ', $ord);
    }

    /**
     * Converts a string to UTF-8 from the base encoding. The base encoding is set via this
     * class' constructor.
     *
     * @param string $string
     * @throws Exception\RuntimeException
     * @return string
     */
    protected function toUtf8($string)
    {
        if ($this->getEncoding() === 'utf-8') {
            $result = $string;
        } else {
            $result = $this->convertEncoding($string, 'UTF-8', $this->getEncoding());
        }

        if (!$this->isUtf8($result)) {
            throw new Exception(sprintf(
                'String to be escaped was not valid UTF-8 or could not be converted: %s', $result
            ));
        }

        return $result;
    }

    /**
     * Converts a string from UTF-8 to the base encoding. The base encoding is set via this
     * class' constructor.
     * @param string $string
     * @return string
     */
    protected function fromUtf8($string)
    {
        if ($this->getEncoding() === 'utf-8') {
            return $string;
        }

        return $this->convertEncoding($string, $this->getEncoding(), 'UTF-8');
    }

    /**
     * Checks if a given string appears to be valid UTF-8 or not.
     *
     * @param string $string
     * @return bool
     */
    protected function isUtf8($string)
    {
        return ($string === '' || preg_match('/^./su', $string));
    }

    /**
     * Encoding conversion helper which wraps iconv and mbstring where they exist or throws
     * and exception where neither is available.
     *
     * @param string $string
     * @param string $to
     * @param array|string $from
     * @throws Exception\RuntimeException
     * @return string
     */
    protected function convertEncoding($string, $to, $from)
    {
        $result = '';
        if (function_exists('iconv')) {
            $result = iconv($from, $to, $string);
        } elseif (function_exists('mb_convert_encoding')) {
            $result = mb_convert_encoding($string, $to, $from);
        } else {
            throw new Exception\RuntimeException(
                get_class($this)
                . ' requires either the iconv or mbstring extension to be installed'
                . ' when escaping for non UTF-8 strings.'
            );
        }

        if ($result === false) {
            return ''; // return non-fatal blank string on encoding errors from users
        }
        return $result;
    }
}
})();