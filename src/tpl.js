(function(window, escaper) {
    
    if (window.Tpl)  return;
    
    /*
    *  Simple light-weight javascript templating engine (part of php templating engine)
    *  @author: Nikos M.  http://nikos-web-development.netai.net/
    *  https://github.com/foo123/Contemplate
    *
    *  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed
    *  http://ejohn.org/blog/javascript-micro-templating/
    *
    */
    
    // private vars
    var Tpl, self,
        $escaper=null,
    
        $__locale__={},
        $cache={}, $tpls={}, $partials={},
    
        $loops=0, $ifs=0, $loopifs=0,
    
        $controlConstructs=[
            'if', 'elseif', 'else', 'endif', 
            'for', 'elsefor', 'endfor',
            'include'
        ],
        
        $funcs=[ 'l', 's', 'n', 'f', 'concat'/*, 'htmlselect', 'htmltable'*/ ],
        $regExps={
            'functions':null,
            'controlConstructs':null,
            'forExpr':null,
            'quotes':null,
            'specials':null,
            'replacements':null
        }
        ;

    /*
    *  Template Engine
    *
    */
    Tpl=self={

        init : function(escaper) {
            if (escaper)
                $escaper=escaper;
            
            // pre-compute the needed regular expressions
            $regExps['controlConstructs']=new RegExp('\\t\\s*\%('+$controlConstructs.join('|')+')\\b\\s*\\((.*)\\)', 'g');
            $regExps['forExpr']=new RegExp('^\\s*\\$([a-z0-9_]+?)\\s* as \\s*\\$([a-z0-9_]+?)\\s*=>\\s*\\$([a-z0-9_]+)\\s*$', 'i');
            $regExps['quotes']=new RegExp('\'', 'g');
            $regExps['specials']=new RegExp('[\\r\\t\\n]', 'g');
            $regExps['replacements']=new RegExp('\\t\\s*(.*?)\\s*%>', 'g');
            if ($funcs.length)  
                $regExps['functions']=new RegExp('\%('+$funcs.join('|')+')\\b', 'g');
        },
        
        //
        // Main methods
        //
        load : function($id, $tpl, $force) {
            if (!$tpls[$id] || $force)
            {
                $tpls[$id]=$tpl;
                return true;
            }
            return false;
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
                        "with($__o__) { $__p__ += '" + self.parse($tpl) + "'; } " +
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
        
        setLocaleStrings : function($l) {
            $__locale__ = $l;
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
            /*if ($loopifs>0 && 0==$ifs)
            {
                $loopifs--;
                // else attached to  for loop
                return "'; } } } else { ";
            }*/
            // regular else
            return "'; } else { ";
        },
        
        // elsefor
        t_elsefor : function() {
            // else attached to  for loop
            $loopifs--;
            return "'; } } } else { ";
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
            var $m = $for_expr.match($regExps['forExpr']),
                $o="$"+$m[1], $k="$"+$m[2], $v="$"+$m[3];
            return "'; if ("+ $o +" && Object.keys("+ $o +").length) { for (var "+ $k +" in "+ $o +") { if (Tpl.hasOwn("+ $o +", "+ $k +")) { var "+$v+"="+$o+"["+$k+"]; ";
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
        
        // include
        t_include : function($id/*, $data*/) {
            //return Tpl.log($id);
            if ($tpls[$id])
            {
                // cache it
                if (!$partials[$id])
                    $partials[$id]=" " + self.parse($tpls[$id]) + "'; ";
                return $partials[$id];
            }
            return '';
        },
        
        //
        // Basic template functions
        //
        
        // echo
        e : function($e) {
            return ($e);
        },
        
        // to String
        s : function($e) {
            return (String)($e);
        },
        
        // to Integer
        n : function($e) {
            return parseInt($e, 10);
        },
        
        // to Float
        f : function($e) {
            return parseFloat($e, 10);
        },
        
        // Concatenate strings/vars
        concat : function() {
            return Array.prototype.slice.call(arguments).join('');
        },
        
        //
        //  Localization functions
        //
        locale : function($e) {
            if ($__locale__[$e])
                return $__locale__[$e];
            return ($e);
        },
        
        l : function($e) {
            return self.locale($e);
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
                        return /*"\t" .*/ self.t_if($m[2]);
                        break;
                    case 'elseif':
                        return /*"\t" .*/ self.t_elseif($m[2]);
                        break;
                    case 'else':
                        return /*"\t" .*/ self.t_else($m[2]);
                        break;
                    case 'endif':
                        return /*"\t" .*/ self.t_endif($m[2]);
                        break;
                    case 'for':
                        return /*"\t" .*/ self.t_for($m[2]);
                        break;
                    case 'elsefor':
                        return /*"\t" .*/ self.t_elsefor($m[2]);
                        break;
                    case 'endfor':
                        return /*"\t" .*/ self.t_endfor($m[2]);
                        break;
                    case 'include':
                        return /*"\t" .*/ self.t_include($m[2]);
                        break;
                }
            }
            return $m[0];
        },
        
        parseControlConstructs : function($s) {
            $s = $s.split("%>").join("\n");
            $s =  $s.replace($regExps['controlConstructs'], function($m, $m1, $m2){ return self.doControlConstruct([$m, $m1, $m2]); });
            $s = $s.split("\n").join("%>");
            return $s;
        },
        
        parse : function($s) {
            if ($funcs.length)
            {
                return self.parseControlConstructs(
                        $s
                        .replace($regExps['specials'], " ")
                        .split("<%").join("\t")
                        .replace($regExps['quotes'], "\\'")
                    )
                    .replace($regExps['functions'], "Tpl.$1")
                    .replace($regExps['replacements'], "' + ( $1 ) + '")
                    .split("\t").join("'; ")
                    .split("%>").join(" $__p__ += '")
                    ;
            }
            else
            {
                return self.parseControlConstructs(
                        $s
                        .replace($regExps['specials'], " ")
                        .split("<%").join("\t")
                        .replace($regExps['quotes'], "\\'")
                    )
                    .replace($regExps['replacements'], "' + ( $1 ) + '")
                    .split("\t").join("'; ")
                    .split("%>").join(" $__p__ += '")
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
    
    // export it
    window.Tpl=self;
    
    // init the engine
    window.Tpl.init(/*escaper*/);
    
})(window);
