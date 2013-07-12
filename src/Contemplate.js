(function(window, escaper) {
    
    if (window.Contemplate)  return;
    
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
    var Contemplate, self,
        $escaper=null,
        
        $__cacheMode=0,
        
        $__cache={}, $__templates={}, $__partials={},
        $__locale={},
        $__leftTplSep="<%", $__rightTplSep="%>",
        
        $loops=0, $ifs=0, $loopifs=0,
    
        $controlConstructs=[
            'if', 'elseif', 'else', 'endif', 
            'for', 'elsefor', 'endfor',
            'embed', 'include'
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
    
    //
    //  Instance template method(s)
    //
    var ContemplateInstance=function($id, $renderFunc) 
    {
        var $renderFunction=null;
        this.id=null;
        
        if ($id)
        {
            this.id=$id;
            $renderFunction=$renderFunc;
        }
        
        this.setId=function($id) {
            if ($id) this.id=$id;
            return this;
        };
        
        this.render=function($data) {
            if ($renderFunction)
                return $renderFunction($data);
            return '';
        };
    };
    
    Contemplate=self={

        // constants
        CACHE_TO_DISK_NONE : 0,
        CACHE_TO_DISK_AUTOUPDATE : 2,
        CACHE_TO_DISK_NOUPDATE : 4,
        
        init : function(escaper) {
            if (escaper)
                $escaper=escaper;
            
            // pre-compute the needed regular expressions
            $regExps['controlConstructs']=new RegExp('\\t\\s*\%('+$controlConstructs.join('|')+')\\b\\s*\\((.*)\\)', 'g');
            $regExps['forExpr']=new RegExp('^\\s*\\$([a-z0-9_]+?)\\s* as \\s*\\$([a-z0-9_]+?)\\s*=>\\s*\\$([a-z0-9_]+)\\s*$', 'i');
            $regExps['quotes']=new RegExp('\'', 'g');
            $regExps['specials']=new RegExp('[\\r\\t]', 'g'); //new RegExp('[\\r\\t\\n]', 'g');
            $regExps['replacements']=new RegExp('\\t\\s*(.*?)\\s*'+$__rightTplSep, 'g');
            if ($funcs.length)  
                $regExps['functions']=new RegExp('\%('+$funcs.join('|')+')\\b', 'g');
        },
        
        //
        // Main methods
        //
        setLocaleStrings : function($l) {
            $__locale = self.merge($__locale, $l);
        },
        
        setTemplateSeparators : function($left, $right)
        {
            if ($left)
                $__leftTplSep=$left;
            if ($right)
                $__rightTplSep=$right;
            
            if ($right)
                // recompute it
                $regExps['replacements']=new RegExp('\\t\\s*(.*?)\\s*'+$__rightTplSep, 'g');
        },
        
        setCacheDir : function($dir) {
            $__cacheDir=$dir;
        },
        
        setCacheMode : function($mode) {
            // TODO
            $__cacheMode=/*$mode;*/ self.CACHE_TO_DISK_NONE;
        },
        
        // add templates manually
        add : function($tpls) {
            $__templates=self.merge($__templates, $tpls);
        },
    
        tpl : function($id, $data) {
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.
            if (!$__cache[$id])
            {
                $__cache[$id]=self.getCachedTemplate($id);
            }
            
            var $tpl=$__cache[$id];
            
            // Provide some basic currying to the user
            if ($data)
                return $tpl.render( $data );
            else
                return $tpl;
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
            return "'; if ("+ $o +" && Object.keys("+ $o +").length) { for (var "+ $k +" in "+ $o +") { if (Contemplate.hasOwn("+ $o +", "+ $k +")) { var "+$v+"="+$o+"["+$k+"]; ";
        },
        
        // endfor
        t_endfor : function() {
            if ($loopifs==$loops)
            {
                $loops--;
                $loopifs--;
                return "'; } } } ";
            }
            $loops--;
            return "'; } ";
        },
        
        // include, same as embed right now
        t_include : function($id/*, $data*/) {
            return t_embed($id);
        },
        
        // embed
        t_embed : function($id/*, $data*/) {
            // cache it
            if (!$__partials[$id])
                $__partials[$id]=" " + self.parse(self.getTemplateContents($id)) + "'; ";
            return $__partials[$id];
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
            if ($__locale[$e])
                return $__locale[$e];
            return $e;
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
                    case 'embed':
                    case 'include':
                        return /*"\t" .*/ self.t_embed($m[2]);
                        break;
                }
            }
            return $m[0];
        },
        
        parseControlConstructs : function($s) {
            $s = $s.split($__rightTplSep).join("\n");
            $s =  $s.replace($regExps['controlConstructs'], function($m, $m1, $m2){ return self.doControlConstruct([$m, $m1, $m2]); });
            $s = $s.split("\n").join($__rightTplSep);
            return $s;
        },
        
        parse : function($s) {
            if ($funcs.length)
            {
                return self.parseControlConstructs(
                        $s
                        .replace($regExps['specials'], " ")
                        .split($__leftTplSep).join("\t")
                        .replace($regExps['quotes'], "\\'")
                         // preserve lines
                        .split("\n").join("' + \"\\n\" + '")
                   )
                    .replace($regExps['functions'], "Contemplate.$1")
                    .replace($regExps['replacements'], "' + ( $1 ) + '")
                    .split("\t").join("'; ")
                    .split($__rightTplSep).join(" $__p__ += '")
                    ;
            }
            else
            {
                return self.parseControlConstructs(
                        $s
                        .replace($regExps['specials'], " ")
                        .split($__leftTplSep).join("\t")
                        .replace($regExps['quotes'], "\\'")
                         // preserve lines
                        .split("\n").join("' + \"\\n\" + '")
                    )
                    .replace($regExps['replacements'], "' + ( $1 ) + '")
                    .split("\t").join("'; ")
                    .split($__rightTplSep).join(" $__p__ += '")
                    ;
            }
        },
        
        getCachedTemplateName : function($id) {
            return $__cacheDir + $id.replace(/[ -]/,'_') + '.tpl.js';
        },
        
        getCachedTemplateClass : function($id) {
            return 'Contemplate_' + $id.replace(/[ -]/,'_') + '_Cached';
        },
        
        getTemplateContents : function($id) {
            if ($__templates[$id])
            {
                var scriptEl=window.document.getElementById($__templates[$id]);
                return scriptEl.innerHTML;
            }
            return '';
        },
        
        createTemplateRenderFunction : function($id) {
            self.reset();
        
            var $func=
                // use php-style variables using '$' in front of var name
                "for (var __n__ in $__o__) { if (Contemplate.hasOwn($__o__, __n__)) { $__o__['$'+__n__]=$__o__[__n__]; delete $__o__[__n__];} } "
                // Introduce the data as local variables using with(){}
               // Convert the template into pure JavaScript
                +"var $__p__ = ''; "
                +"with($__o__) { $__p__ += '" + self.parse(self.getTemplateContents($id)) + "'; } "
                +"return $__p__;"
                ;
            return new Function("$__o__", $func);
        },
        
        createCachedTemplate : function($id, $filename, $classname) {
            self.reset();
        
            var $class=
                "(function(window) { " + "\n"
                +"/* Contemplate cached template '"+$id+"' */ " + "\n"
                +"if (!window.['" + $classname + "']) { "
                +"function " + $classname + "($id) { this.id=$id; }; "
                +$classname + ".prototype.setId=function($id) { if ($id) {this.id=$id;} return this; }; "
                +$classname + ".prototype.render=function($__o__) { "
                // use php-style variables using '$' in front of var name
                +"for (var __n__ in $__o__) { if (Contemplate.hasOwn($__o__, __n__)) { $__o__['$'+__n__]=$__o__[__n__]; delete $__o__[__n__];} } "
                // Introduce the data as local variables using with(){}
               // Convert the template into pure JavaScript
                +"var $__p__ = ''; "
                +"with($__o__) { $__p__ += '" + self.parse(self.getTemplateContents($id)) + "'; } "
                +"return $__p__; "
                +"}; window.['" + $classname + "']="+$classname+"; } })(window);"
                ;
            return self.setCachedTemplate($filename, $class);
        },
        
        getCachedTemplate : function($id) {
            
            switch($__cacheMode)
            {
                case self.CACHE_TO_DISK_NOUPDATE:
                    var $cachedTplFile=self.getCachedTemplateName($id);
                    var $cachedTplClass=self.getCachedTemplateClass($id);
                    if (!is_file($cachedTplFile))
                    {
                        self.createCachedTemplate($id, $cachedTplFile, $cachedTplClass);
                    }
                    if (is_file($cachedTplFile))
                    {
                        include($cachedTplFile);
                        $tpl = new $cachedTplClass();
                        $tpl.setId($id);
                        return $tpl;
                    }
                    return null;
                    break;
                
                case self.CACHE_TO_DISK_AUTOUPDATE:
                    var $cachedTplFile=self.getCachedTemplateName($id);
                    var $cachedTplClass=self.getCachedTemplateClass($id);
                    if (!is_file($cachedTplFile) || (filemtime($cachedTplFile) <= filemtime($__templates[$id])))
                    {
                        // if tpl not exist or is out-of-sync re-create it
                        self.createCachedTemplate($id, $cachedTplFile, $cachedTplClass);
                    }
                    if (is_file($cachedTplFile))
                    {
                        include($cachedTplFile);
                        $tpl = new $cachedTplClass();
                        $tpl.setId($id);
                        return $tpl;
                    }
                    return null;
                    break;
                
                case self.CACHE_TO_DISK_NONE:
                default:
                    // dynamic in-memory caching during page-request
                    return new ContemplateInstance($id, self.createTemplateRenderFunction($id));
                    break;
            }
            return null;
        },
        
        setCachedTemplate : function($id, $tplContents) {
            // todo
            return false;/*file_put_contents(self.getCachedTemplateName($id), $tplContents);*/
        },
        
        reset : function() {
            // reset parse counters
            $loops=0;
            $ifs=0;
            $loopifs=0;
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
        
        log : function($m) {
            if (window.console && window.console.log)
                console.log($m);
        }
    };
    
    // export it
    window.Contemplate=self;
    
    // init the engine
    window.Contemplate.init(/*escaper*/);
    
})(window);
