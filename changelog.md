### ChangeLog

__1.6.0__
* define local variables that are literally accessible to literal code and vice-versa
* variable parsing became better, can use any valid expression in variable bracket
* update tests

__1.5.0__
* support including literal php/js/py code (properly indented), see examples and manual
* stop compatibility mode support
* drop localization support (user should include her own solution as plugins)
* major refactor, some utility methods renamed (eg url -> urlencode) or removed (eg data, ucfirst/lcfirst, camelcase/snakecase, addslashes/stripslashes)
* update tests

__1.4.0__
* support `php`-like object accesss notation (arrow notation `->`) to support not only strictly arrays as template data but arbitrary objects as well. Support arbitrary chained prop/method access (works same for all js/php/python engines)
* add `get` template directive to access arbitrary (nested) variable properties based on arbitrary expressions (arbitrary expressions not supported by literal object access notation above, see manual) and also access dynamic properties that use `getter` methods
* add new template functions `keys` (php-like `array_keys`), `values` (php-like `array_values`), `buildquery` (php-like `http_build_query`), `parsequery` (php-like `parse_str`)
* update tests and live examples along with contemplate grammar

__1.3.0__
* PHP/JS/PY: support custom template finder per context or even an array of possible template dirs in order to find templates dynamicaly not already added/defined (js engine supports both sync and async operations plus promise-based) (see manual for details)
* PHP/JS/PY: add template function `vsprintf` similar to `sprintf` but accepts an array of arguments instead of them being passed individualy as separate arguments during function call (can be useful when needing to format string based on arguments from data or parameters)
PY: try to implement `sprintf`/`vsprintf` functionality as close as possible to original `php`/`js` `sprintf`/`vsprintf` (uses *old-style* string formating with a couple of *hacks*, maybe in future use *new-style* `.format` method)
* JS: fix and complete async template loading, parsing and rendering (fix a small issue with async parsing not updating regex) and also do **static analysis** (during compilation) on dynamic templates used inside calling template (ie using `tpl`/`template` functions) and **pre-load them async** (if in async opreation) in order to be rendered without blocking. If sync operations, everything functions as before
PHP: handle dynamic function creation (eg for inline templates) for `PHP < 7.2.0` and `PHP >= 7.2.0` where `create_function` is deprecated

__1.2.5__
* JS: enable asynchronous template loading, parsing and writing so that performance can be even greater in `Node.js` where `sync` methods may block. `Contemplate.tpl`, `Contemplate.getTemplateContents`, `Contemplate.parseTpl` all accept a `callback` (`nodeback`) as last argument with signature `function(err, result)` which if given all processing becomes **asynchronous**. Also if `Promises` are supported *"promisified"* versions of the above methods exist i.e `Contemplate.tplPromise`, `Contemplate.getTemplateContentsPromise`, `Contemplate.parseTplPromise` all return a `Promise` which resolves and rejects accordingly.
* PHP/PY: update versions

__1.2.0__
* PHP/JS/PY: enable templates subfolders and paths. Meaning a template id can have relative path in its name and same relative path will be created and mirrored in template cacheDir and served as such. This accomodates templates used for different purposes having same basename but differing in relative path and also reflects structure and organisation of original templates. This resolves the issue and also allows more flexibility in handling many different templates and template folder structures. If path does not exist in cache folder it will be created automaticaly.
* add new template function `queryvar` to add/remove `url query` variables from given `url` (needed sometimes in templates)
* add new template function `striptags` to strip `html tags` from string
* add custom `pluralForm` callable (per context) for current locale. It specifies whether a `singular` or `plural` string is to be used based on numeric value given (eg a-la wordpress) (see manual how to set or clear)
* `locale`/`xlocale` methods slightly changed signature and can accept an optional `array`/`list` of arguments which will be used to format the string to be localised a-la `sprintf` functionality (done automaticaly) (NOTE: limited `sprintf` support for python implementation)
* JS/PY: `empty` function behaves now exactly like PHP's function, ie it returns `true` also for string with value `"0"`


__1.1.10__
* PHP: require exclusive lock when writing a compiled and cached template to disk
* PY: make sure module is reloaded in case it is out of date when loading a template (as module) from disk. Seems to fix the failure to load/import template module if created just before loading
* JS: update version

__1.1.9__
* PHP: use `class_exists($class, false)`, JS/PY: update version numbers

__1.1.8__
* `create_function` is deprecated in PHP 7.2+, so eliminate use of `create_function` and use with `@` operator to avoid php notices. It is not used but left there for compatibility. Maybe removed completely in another update

__1.1.7__
* minor changes for better code alignment/indentation
* minor changes in rendering

__1.1.6__
* minor changes for faster basic templates
* new function `join / j` to (flatly) string-concatenate arbitrary array (of arrays) with given separator

__1.1.5__
* new function `in_array` to test if array contains a value (similar to php)
* new functions `json_encode`, `json_decode` (similar to php)


__1.1.4__
* lazier init for faster performance
* new function `is_array` to test both if is `array` (`strict`) or is `object`
* new directive `local_set` to set/update a **local** variable
* some further optimisation changes


__1.1.3__
* add `continue` and `break` loop constructs/directives
* minor changes


__1.1.2__
* `iif` is a template `directive` instead of a `function`, so it functions exactly as `inlined ternary-if` statement
* `empty` is a template `directive` instead of a `function`, so it functions exactly as php's `empty` directive
* inline, at compile-time, more template functions (e.g `concat`) for faster execution
* inlined plugins can receive passed arguments (via `$` array parameter) both as (comma-separated) string (`$0`), plus each separate argument (`$1..$n`)
* lazy init and rendering for inline templates and plugins for even faster execution
* remove `plural` functions and add linguisticaly contexual localisation `xlocale`, `nxlocale` functions
* `cc` function alias of `concat`
* fix php-like `date()` function in python implementation (wrong day of week for `Sunday`)


__1.1.1__
* plugins (non-inlined) with empty arguments invalid output code generation, fixed
* localisation settings accept a callback function as well for custom dynamic localisation (with optional extra arguments)
* new localisation function `nlocale` for singular/plural dynamic localisation based on numeric parameter (1st argument)


__1.1.0__
* inline `if` function `iif()`
* php-like `empty()` function
* fix `date()` function in python implementation (wrong month,day of week)
* fix `not`, `or`, `and` operator replacements in python implementation
* minor changes


__1.0.0__
* enable multiple dynamic contexts (see examples), different parts of an application can use the engine in a **modular way**, with their contextual template settings (including templates, caching, directories, locales, plugins, etc..) **independantly**
* template `directives`, `functions` and `plugins` **no longer use** the `%` prefix i.e `%for`, `%if`, .. but `for`, `if`, .. if compatibility to older format is needed use `Contemplate.setCompatibilityMode( true )`
* `elif` **alias of** `elseif`, `fi` **alias of** `endif`
* optimisations, typo fixes

__0.9.2__
* update/optimise `date`, `localized_date` methods
* remove `%html` (`htmlentities`) method (not needed, can be added as plugin if needed, less code size)
* `ContemplateInlineTpl` minor changes

__0.9.1__
* make `%super(block)` a construct (cannot be overriden via a plugin)
* add `%getblock(block)` construct to return block content directly via function, can be useful when block content is needed as a parameter
* `%block` construct can be defined without being echoed (like a container) using `%block(blockID, false)`
* can override 'cacheDir' option in `Contemplate.tpl` call via options (experimental)

__0.9.0.1__
* add `hasTpl(tpl)` , `hasPlugin(name)` Contemplate methods

__0.9__
* make `%htmltable` , `%htmlselect` external plugins (reduce main engine code size etc)
* add `%super` template function to reference a super block directly if needed in OO manner
* defined plugins no longer take a `plg_` prefix, the plugin name is exactly same as the given name defined (this way even built-in functions can be overriden in some cases)

__0.8.4__
* inlined plugins replace code accept the plugin arguments as well
* fix subsequent plugin calls in templates, are not parsed/rendered correctly (php)

__0.8.3__
* refined BlockTag parsing (accurately parse blockTag, regardless of strings)
* test examples provide a Contemplate tutorial, API reference as well

__0.8.2.1__
* Contemplate.js remove `Function.bind` dependency
* tag new version

__0.8.2__
* `InlineTemplate.multisplit_re` method, split inlineTpl using regexps
* Contemplate.php fix `undefined __currentblock` error
* minor changes

__0.8.1__
* even faster rendering optimisations (esp. for javascript, reduce rendering function calls by one)
* minor changes

__0.8__
* new template function `%echo` (similar to php function that echoes strings to the output)
* `%tpl` (alias of `%template`, `%template` to be deprecated?)
* `%tpl`, `%template`, `%include`, `%extends`, `%block` constructs/functions accept literal strings as (1st) argument (see examples)
* minor edits
* various optimisations, faster, more refined compilation and rendering

__0.7.1__
* handle loop variables as local (block-scoped) variables (not added or accessed to/from passed data)
* various optimisations
* (re-uploaded) fix inline templates rendering issue

__0.7__
* inline templates both in Contemplate templates (e.g as parameters to other functions) or in code
* `%inline` template function, creates/renders inline templates
* templates classes extend `Contemplate.Tpl` template class (`Contemplate.InlineTpl` also?)
* minor updates

__0.6.12__
* python-style for-loops contructs (see manual and examples)

__0.6.11__
* remove `Contemplate.addInline` method, `Contemplate.add` handles both references and literal/inline templates
* minor changes/updates

__0.6.10__
* optimise custom html esc method (Contemplate.js)

__0.6.9__
* enable plugin code inlining inside the compiled template
* add a custom simpler/faster html escape function `%e`
* minimise plugin naming convention (`%plugin_pluginName`, `%plg_pluginName`)
* add html entinties escape mode as parameter (default= `"ENT_COMPAT"`)
* optimise `htmlentities`, `count` etc. methods from phpjs (Contemplate.js)


__0.6.8__
* option to create a template instance from pre-parsed template code returned from `Contemplate.parseTpl` method
* minor changes


__0.6.7__
* make parse method public as `Contemplate.parseTpl`( tpl, options )


__0.6.6__
* remove render data initialisation/copy/isolation code from inside tpl.render methods (makes rendering a lot faster), user can copy data (once) using `Contemplate.data` method if needed as needed
* minor edits/optimizations (e.g in loops)


__0.6.5__
* enable associative and non-associative `for` loops (see examples) i.e `for(o as k=>v)` `for(o as v)`
* minor edits/optimizations


__0.6.4__
* make faster and more precise (internal) template parsing/rendering
* make faster and more precise blocks and nested block parsing
* Contemplate for Node.js is **not** global anymore
* refactor/optimize


__0.6.3__
* add more options (e.g `'autoUpdate'`) per single template
* fix some typos


__0.6.2__
* parse nested blocks
* `escape` parse option (true by default), options syntax change (see manual)


__0.6.1__
* enable template separators to be defined **inside** a template or passed as **paramaters**


__0.6__
* define template separators in the 1st line of a template (each tpl can define its own separators)
* micro edits/changes


__0.5.3, 0.5.4__
* add `%isset` directive
* change `%has_key` template function to `%haskey`
* template directives parsing edits (accomodate nested directives in arguments)


__0.5.2__
* enable literal data to be used as a loop object (see examples)
* php data func (deep object) fixed


__0.5.1__
* add `%addslashes`, `%stripslashes` tpl functions
* updates / edits


__0.5__
* add support for custom (user-defined) plugins as template functions with addPlugin(name, handler) method
* add support for setting/unsetting custom variables inside template (on-the-fly) with `%set(var, val)`, `%unset(var)` directives
* refine/optimize template parsing for strings and variables
* support literal data notation with template functions and plugins also
* updates / edits


__0.4.10__
* add custom codePrefix in cached templates


__0.4.9__
* add `%uuid` function (generate universal unique id)


__0.4.8__
* change `%pluralise` signature, unify `Contemplate.add`, `Contemplate.addInline` methods, edits, optimizations


__0.4.7__
* add `%pluralise` function, `clearLocaleStrings`, `setPlurals`, `clearPlurals` methods


__0.4.6__
* add `%lowercase`, `%uppercase`, `%camelcase`, `%snakecase` template functions (see manual)

__0.4.5__
* add `%has_key` template function (see manual)

__0.4.4__
* escape single quotes and parse template variables accurately


__0.4.3__
* Contemplate Engine for Python 2.x and 3.x
* minor edits, generate formatted and anotated cached template code (better for debug)
* tidy up repo
* project stopped


__0.4.2__
* add clear (memory) method `clearCache()`
* allow inline templates with `addInline()` method (see examples)
* allow `for()` directive to handle an expression in place of an object ( so `%for($data["subdata"] as $key=>$val)` or other expressions WILL work)
* allow to refresh the (memory) cache for a specific template (ie. `Contemplate.tpl(tpl_id, data, refresh)` ) `refresh = true` will refresh the (memory) cache (default `false` )


__0.4.1__
* parse template tags a little more accurately
* minor edits/optimizations


__0.4__
* add template inheritance and block definitions
* allow client-js template engine to load templates via ajax
* add basic html/url escaping ( `htmlentities` , `urlencode` )
* minor edits/optimizations


__0.3.3__
* make Contemplate.js work with Nodejs , add nodejs server example (test.js)
* add `%count` function (number of items in an array/object)


__0.3.2__
* make `%htmltable` `%htmlselect` constructs instead of functions (so literal data can be used also)
* add `%ltrim` , `%rtrim` functions
* minor fixes, edits


__0.3.1__
* add `%q` `%dq` functions (quote, double quote)
* add `%htmltable` `%htmlselect` functions (render a html table with options, render a html select with options)
* minor fixes, edits


__0.3__
* add `%template` directive
* add template functions to manipulate dates and localized dates
* add some javascript methods from [phpjs](https://github.com/kvz/phpjs) project, (`trim`, `sprintf`, `time`, `date`), these are available as template functions (eg `%sprintf`, `%trim`, etc..)
* make the Contemplate.js class compatible with both browser, node.js and requirejs configurations


__0.2__
* add `%include` directive
* make template separators configurable (defaults are `<%` and `%>`)
* add filesystem caching, refactor, optimize


__0.1__
* add localization options and template functions
* initial release
