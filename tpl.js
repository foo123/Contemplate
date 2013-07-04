(function(window, escaper) {
    
    /*
    *  Simple light-weight javascript templating engine (part of php templating engine)
    *  @author: Nikos M.  http://nikos-web-development.netai.net/
    *
    *  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed
    *  http://ejohn.org/blog/javascript-micro-templating/
    *
    */
    
    // private vars
    var Tpl = window.Tpl || {},
        $escaper=null,
    
        $cache={}, $tpls={},
    
        $loops=0, $ifs=0, $loopifs=0,
    
        $controlConstructs=[
            'if', 'elseif', 'else', 'endif', 
            'for', 'endfor'
        ], $controlConstructsRX=null,
        
        $funcs=[ 'l', 's', 'n', 'f'/*, 'htmlselect', 'htmltable'*/ ], $funcsRX=null
        ;

    /*
    *  Template Engine
    *
    */
    var Tpl={

        init : function(escaper) {
            if (escaper)
                $escaper=escaper;
            
            $controlConstructsRX=new RegExp('\\t\\s*\%('+$controlConstructs.join('|')+')\\s*\\((.*)\\)', 'g');
            if ($funcs.length)  $funcsRX=new RegExp('\%('+$funcs.join('|')+')', 'g');
        },
        
        //
        // Main methods
        //
        load : function($id, $tpl, $force) {
            if (!$tpls[$id] || $force)
                $tpls[$id]=$tpl;
        },
        
        tmpl : function($id, $data) {
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.
            if ($tpls[$id])
            {
                var $tpl=$tpls[$id];
                if (!$cache[$id])
                {
                    var $func=
                        // use php-style variables using '$' in front of var name
                        "for (var __n__ in $__o__) { if (Tpl.hasOwn($__o__, __n__)) { $__o__['$'+__n__]=$__o__[__n__]; delete $__o__[__n__];} } " +
                        // Introduce the data as local variables using with(){}
                       // Convert the template into pure JavaScript
                        "var $__p__ = ''; " +
                        "with($__o__) { $__p__ += '" + Tpl.parse($tpl) + "'; } " +
                        "return $__p__;"
                        ;
                    //Tpl.log($func);
                    // Generate a reusable function that will serve as a template
                    // generator (and which will be cached)
                    $cache[$id] = new Function("$__o__", $func);
                }
                var $fn = $cache[$id];
                // Provide some basic currying to the user
                return $data ? $fn( $data ) : $fn;
            }
            return null;
        },
        
        //
        // Control structures
        //
    
        // if
        t_if : function($cond) {
            $ifs++;
            return "'; if ("+$cond+") { ";
        },
            
        // elseif
        t_elseif : function($cond) {
            return "'; } elseif ("+$cond+") { ";
        },
        
        // else
        t_else : function() {
            if ($loopifs>0 && 0==$ifs)
            {
                $loopifs--;
                // else attached to  for loop
                return "'; } } } else { ";
            }
            // regular else
            return "'; } else { ";
        },
        
        // endif
        t_endif : function() {
            $ifs--;
            return "'; } ";
        },
        
        // for, foreach
        t_for : function($for_expr) {
            $loops++;
            $loopifs++;
            var $m = $for_expr.match(/^\s*\$([a-z0-9_]+?)\s* as \s*\$([a-z0-9_]+?)\s*=>\s*\$([a-z0-9_]+)\s*$/i),
                $o="$"+$m[1], $k="$"+$m[2], $v="$"+$m[3];
            return "'; if (Object.keys("+ $o +").length) { for (var "+ $k +" in "+ $o +") { if (Tpl.hasOwn("+ $o +", "+ $k +")) { var "+$v+"="+$o+"["+$k+"]; ";
        },
        
        // endfor
        t_endfor : function() {
            $loops--;
            if ($loopifs>0)
            {
                $loopifs--;
                return "'; } } } ";
            }
            return "'; } ";
        },
        
        //
        // Basic template functions
        //
        e : function($e) {
            return ($e);
        },
        
        s : function($e) {
            return (String)($e);
        },
        
        n : function($e) {
            return parseInt($e, 10);
        },
        
        f : function($e) {
            return parseFloat($e, 10);
        },
        
        //
        //  Localization functions
        //
        locale : function($e) {
            // bypass for now
            return ($e);
        },
        
        l : function($e) {
            return Tpl.locale($e);
        },
        
        //
        //  HTMl elements
        //
        /* ..to be added.. */
        
        //
        // utility methods
        //
        doControlConstruct : function($m)  {
            if ($m[1])
            {
                switch($m[1])
                {
                    case 'if':
                        return /*"\t" .*/ Tpl.t_if($m[2]);
                        break;
                    case 'elseif':
                        return /*"\t" .*/ Tpl.t_elseif($m[2]);
                        break;
                    case 'else':
                        return /*"\t" .*/ Tpl.t_else($m[2]);
                        break;
                    case 'endif':
                        return /*"\t" .*/ Tpl.t_endif($m[2]);
                        break;
                    case 'for':
                        return /*"\t" .*/ Tpl.t_for($m[2]);
                        break;
                    case 'endfor':
                        return /*"\t" .*/ Tpl.t_endfor($m[2]);
                        break;
                }
            }
            return $m[0];
        },
        
        parseControlConstructs : function($s) {
            $s = $s.split("%>").join("\n");
            $s =  $s.replace($controlConstructsRX, function($m, $m1, $m2){ return Tpl.doControlConstruct([$m, $m1, $m2]); });
            $s = $s.split("\n").join("%>");
            return $s;
        },
        
        parse : function($s) {
            if ($funcs.length)
            {
                return Tpl.parseControlConstructs(
                        $s
                        .replace(/[\r\t\n]/g, " ")
                        .split("<%").join("\t")
                    )
                    .replace($funcsRX, "Tpl.$1")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t\s*(.*?)\s*%>/g, "' + ( $1 ) + '")
                    .split("\t").join("'; ")
                    .split("%>").join(" $__p__ += '")
                    .split("\r").join("'")
                    ;
            }
            else
            {
                return Tpl.parseControlConstructs(
                        $s
                        .replace(/[\r\t\n]/g, " ")
                        .split("<%").join("\t")
                    )
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t\s*(.*?)\s*%>/g, "' + ( $1 ) + '")
                    .split("\t").join("'; ")
                    .split("%>").join(" $__p__ += '")
                    .split("\r").join("'")
                    ;
            }
        },
        
        isArray : function( o ) {
            return Object.prototype.toString.call(o) === '[object Array]';
        },
        
        hasOwn : function(o, p) {
            return o /*&& p*/ && Object.prototype.hasOwnProperty.call(o, p);
        },
        
        log : function($m) {
            if (window.console && window.console.log)
                console.log($m);
        }
    };
    
    // init the engine
    Tpl.init(/*escaper*/);
    
    // export it
    window.Tpl=Tpl;
    
})(window);
