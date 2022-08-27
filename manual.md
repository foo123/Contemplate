### Contemplate Manual

**version 1.5.0; platforms: PHP, Python, JavaScript (Node.js, Browser, XPCOM)**


### Contents

1. [Template Separators](#template-separators)
2. [Template Variables](#template-variables)
3. [Literal Template Data](#literal-template-data)
4. [Dynamic Template Inheritance](#dynamic-template-inheritance)
5. [Dynamic Contexts](#dynamic-contexts)
6. [Template Directives](#template-directives)
7. [Template Functions and Plugins](#template-functions-and-plugins)
    1. [Differences between `include` and `template`](#differences-between-include-and-template)
8. [Contemplate API](#contemplate-api)



#### Template Separators

**IMPORTANT** As of version `0.6+`, template separators for `Contemplate` templates are defined **inside** the template itself
in the first non-empty line, separated by a space (see examples and tests). Optionally (for a single template) they can also be passed as **part of parse options** when calling the `Contemplate.tpl(tplID [, data, {separators: seps}])` method



#### Template Variables


Variables in a template are referenced using `PHP`-style Notation with `$` sign.
**Note** Object properties are referenced using (`php`-style) arrow notation (`->`)

example:

```php

// single variable
$x, $v, $foo, $bar
// etc..

// numeric/associative array access notation, equivalent notations
//================================================================
$obj["key"]
$obj.key

$obj[0]["key"]
$obj[0].key

$obj["key"][0]
$obj.key[0]

$obj["key"].key2
$obj.key["key2"]
$obj.key.key2

// access associative array property, property name is dynamic and given in variable $prop
$obj[$prop]

// object access notation
//=======================
$obj->prop
$obj->method(..args)
$obj->prop->prop2
$obj->prop->method(..args)
$obj->method1(..args)->method2(..args)
$obj->method(..args)->prop


// any valid combination of the above
// etc..


// to access variable (nested) properties based on arbitrary expressions use built-in `get` directive e.g:
get($var, [1+n($index), url("foo")])
// will try to access $var[ 1+n($index) ][ url("foo") ]

// also `get` directive can access properties which have associated dynamic getter methods,
// i.e access computed property `computed` which is dynamicaly computed by an associated `getComputed` method
get($var, ["computed","otherProp"])
// will try to access $var->getComputed()->otherProp

// etc..
```



#### Literal Template Data


Literal `object`/`array` data are constructed in a template using `JavaScript` **Literal Object-style Notation** (similar to `JSON`)

example:

```javascript

// eg. a literal object having various string values, numeric values and arrays:
{
    "stringVar"     : "stringValue",
    "numericVar"    : 123,
    "variableVar"    : $foo123,
    "arrayVar"      : [
        0, 1, "astring", 3,
        { "prop": 1 }
    ]
} // etc

```


#### Dynamic Template Inheritance

Templates can extend another template. This is accomplished using `extends` directive, **inside** the template.
This means that the super-template (id) is hardcoded inside the cached template (once compiled).

Right now there are 2 ways to have dynamic template extension according to a condition based on input data.


**1st** is to assign the super-template **id** (i.e as used in `extends(id)` ) to another template.
In this way the template id used in *extends directive* will refer to a different template.
This will change the referenced super-template for all other templates that extend the same super-template as well.


**2nd** way is on a template-by-template basis. Example:

```javascript
// fetch/parse the template
tpl = Contemplate.tpl(tplID);

// tpl may already have a super-template assigned, but one can change this
if ('json' == data.view)  tpl.extend(newSuperTemplateID);

tpl.render(data);

```

#### Dynamic Contexts

The engine can use **multiple dynanic contexts** to have contextual settings, like `templates`, `caching`, `plugins` so that different modules of an application can **use the engine independantly**.

A dynamic context is created with `Contemplate.createCtx('my-context');`
A dynamic context is disposed with `Contemplate.disposeCtx('my-context');`

If a context already exists, it is not re-created in `createCtx` method. If a context does not already exist, `disposeCtx` method does nothing.

All other `API` methods of `Contemplate` can accept a `context id` (so operations take place in that context) either via `options` (in methods that accept an `options` parameter) or via an additional `ctx` string parameter (see examples).

If no context is given, API operations take place in the `global` context `"global"`.
TEMPLATE operations take place in the `current` context (which defaults to `global` if no other context specified)



#### Template Directives

**IMPORTANT** As of version `1.0.0+`, template `directives`, `functions` and `plugins` **no longer use** the `%` prefix i.e `%for`, `%if`, .. but `for`, `if`, ..


* `set($var, expression_or_value)`  SET / UPDATE a tpl variable `$var` to given value or expression
* `local_set($var, expression_or_value)`  SET / UPDATE a **local** tpl variable `$var` to given value or expression
* `get($var, keys [, default_value=null])`  GET arbirtary (nested) variable property (given in `keys` array) based on arbitrary expressions, else return `default_value` if not found
* `unset($var)`  UNSET / DELETE tpl variable `$var`
* `isset($var)`  CHECK whether a tpl variable `$var` is set
* `iif(cond, then_value, else_value)`   inline (ternary) `IF` construct
* `empty(val)`   php-like `empty` construct
* `if(expression_or_value)`  IF construct
* `elseif(expression_or_value)` / `elif(expression_or_value)`  ELSEIF construct
* `else`  ELSE construct
* `endif` / `fi` ENDIF construct, end the IF construct
* `for(expression_or_obj as $key => $val)`  associative FOR loop (`php`-style)
* `for(expression_or_obj as $val)`  non-associative FOR loop (`php`-style)
* `for($key, $val in expression_or_obj)`  associative FOR loop (`python`-style)
* `for($val in expression_or_obj)`  non-associative FOR loop (`python`-style)
* `elsefor`   ELSEFOR, alternative code block when loop is empty
* `endfor`  ENDFOR , end the FOR loop construct
* `continue`  CONTINUE , continue the FOR loop construct
* `break`  BREAK , break from the FOR loop construct
* `extends(base_tpl_id_string)`  Current template extends the template referenced by `base_tpl_id_string` , this means that `base_tpl` layout will be used and any blocks will be overriden as defined
* `block(block_id_string, echoed=true)`  Define / Override `block` of code identified by `block_id`
* `endblock`  End of `block` definition / override
* `super(block_id_string)`  Reference a super `block` directly if needed in OO manner (mostly useful inside `block` definitions overriden by current template)
* `getblock(block_id_string)`  Get `block` output directly via function call (can be useful when `block` content is needed as a parameter)
* `include(tpl_id_string)`  INCLUDE (inline) the template referenced by `tpl_id`

As of version **1.5.0**, literal **PHP** or **JS** or **PY** code can be included in template.
Assuming template separators as `<%`, `%>` one can include programming code directly in the template, which will include it only if the language is the language of the engine (ie php will include only php code, js only js code ad py ony py code, rest will simply be ignored).

Example:

```text
<% for ($v in $list) %>
<% $v %> <%php:= "php" %><%js:= "js" %><%py:= "py" %>
<% endfor %>
```

The above will output in PHP (assuming `list = ['a', 'b', 'c']`):
```text
a php b php c php
```
The above will output in JS (assuming `list = ['a', 'b', 'c']`):
```text
a js b js c js
```
The above will output in PY (assuming `list = ['a', 'b', 'c']`):
```text
a py b py c py
```

One can include block code as well (leaving out the `=` mark)
```text
<%php:postdent(1):
foreach ($data['list'] as $v)
{
%>
<%js:postdent(1):
for (var i=0; i<data['list'].length; ++i)
{
    var v = data['list'][i];
%>
<%py:postdent(1):
for v in data['list']:
%>

<%php:= $v . " php" %><%js:= v + " js" %><%py:= v + " py" %>

<%php:predent(-1):
}
%>
<%js:predent(-1):
}
%>
<%py:predent(-1):

%>
```

The above will output exactly the same as previous example in each engine (assuming `list = ['a', 'b', 'c']`).

`:predent()/:postdent()` option specifies the indentation of the block of code (before/after) in the compiled output. It is optional for PHP/JS (only for visual purposes) but mandatory for Python since Python depends on valid indentation.

#### Template Functions and Plugins

**IMPORTANT** As of version `1.0.0+`, template `directives`, `functions` and `plugins` **no longer use** the `%` prefix i.e `%for`, `%if`, .. but `for`, `if`, .. If compatibility to older format is needed use `Contemplate.setCompatibilityMode( true )`


* `n(val)`   convert `val` to integer
* `s(val)`   convert `val` to string
* `f(val)`   convert `val` to float
* `q(val)`   wrap `val` in single-quotes
* `qq(val)` / `dq(val)`  wrap `val` in double-quotes
* `concat(val1, val2, val3, ..)` / `cc(val1, val2, val3, ..)` concatenate the values as strings
* `join(sep, [val2, val3, ..], skip_empty=false)` / `j(sep, [val2, val3, ..], skip_empty=false)` (flatly) string-concatenate with `sep` separator the passed array (of arrays)
* `is_array(val [, strict=false])`  (`php`-like) function test whether `val` is `array` (`strict`) or `object`
* `in_array(val, array)`  (`php`-like) function test whether `val` is contained in `array`
* `keys(obj)`  (`php`-like) for `array_keys`
* `values(obj)`  (`php`-like) for `array_values`
* `count(array_or_object)`  return number of items in `array_or_object` argument
* `haskey( array_or_object, key1 [,key2, ..] )`  check whether `array_or_object` argument has the given (nested) keys
* `time()` / `now()`   return current timestamp in seconds (`php`-like function)
* `date(format [, timestamp=now])`  return timestamp formatted according to format
* `striptags(string)`  strip `html tags` from string
* `e(val)`   custom fast html escape
* `json_encode(val)`  (`php`-like) function to json-encode `val`
* `json_decode(val)`  (`php`-like) function to json-decode `val`
* `urlencode(str)`  urlencode (`php`-like) function
* `urldecode(str)`  urldecode (`php`-like) function
* `buildquery(data)`  `php`-like function `http_build_query` to make a query string from structured data
* `parsequery(str)`  `php`-like function `parse_str` to parse a query string to structured data
* `queryvar(url, add_keys, remove_keys=null)`  add/remove `url query` keys, given in `add_keys` and `remove_keys` respectively, from given `url`
* `lowercase(val)`   convert `val` to `lowercase`
* `uppercase(val)`   convert `val` to `UPPERCASE`
* `ltrim(val [, delim])`   left trim `val` of delim (default to spaces)
* `rtrim(val [, delim])`   right trim `val` of delim (default to spaces)
* `trim(val [, delim])`   left/right trim `val` of delim (default to spaces)
* `sprintf(format, val1, val2, ..)`   return a formatted string using `val1`, `val2`, etc.. as arguments
* `vsprintf(format, values)`   return a formatted string using `values` array as arguments
* `uuid(namespace)`  generate a `uuid` (universal unique identifier), with optional given namespace
* `inline(tpl, [reps|data])`  create or render an `inline` template referenced in 'tpl'
* `tpl(tpl_id_string, {"var1" : val1, "var2" : val2, ..})` / `template(tpl_id_string, {"var1" : val1, "var2" : val2, ..})`  CALL a subtemplate referenced by 'tpl_id', passing the necessary data
* `pluginName([val1, val2, ..])`  call a custom (user-defined) `plugin` as a template function (see examples)


#### Differences between `include` and `template`

The main difference is that `include` will actually copy the subtemplate contents inside the calling template (thus only one final template is generated). This is similar to PHP's `include` directive.

On the contrary `tpl` directive will call and parse a subtemplate on its own (so the data need to be passed also). In this case each subtemplate will be compiled on its own and exist in the cache.

When the templates are already cached, the relative performance of these directives is similar. `include` tends to be slightly faster since it generates only a single template, while `template` will generate all needed templates. However if a subtemplate has been changed and is embedded in another template using `include` , the calling template will __NOT__ be refreshed. While if `template` is used, the calling template __WILL__ be refreshed (since the subtemplate is called as a subroutine and not copied literally inside the calling template)

The syntax for `include` is this:  `include(subtemplateId)`

The syntax for `tpl` / `template` is this: `tpl(subtemplateId, {"var1":$value1, "var2":$value2, ..})`

where the `{"var1":$value1, "var2":$value2, ..}` are the data to be passed to the called template
this is exactly how the `Contemplate.tpl(id, data)` method is called.


#### Contemplate API

**(javascript)**
```javascript

// create a custom dynamic context for modular use
Contemplate.createCtx('my-context');

// dispose a custom dynamic context (created earlier)
Contemplate.disposeCtx('my-context');

// Add templates
Contemplate.add({
    'tpl1': './path/to/template1',
    'tpl2': './path/to/template2',
    'inline_tpl': ['<% $var %>'], // inline template
    'dom_tpl': '#dom_tpl_id' // DOM template (for browser)
} [, ctx="global"]);

// set a custom template finder per context
// for javascript engine it should support both sync and async operation if callback 2nd argument is given
Contemplate.setTemplateFinder(function(tplId [,cb]){
} [, ctx="global"]);

// set an array of possible paths where contemplate may find templates per context (and custom templatefinder is not defined)
Contemplate.setTemplateDirs(templateDirs [, ctx="global"]);

// get the array of possible paths where contemplate may find templates per context (if set, else empty array)
Contemplate.getTemplateDirs([ctx="global"]);

// add plugins
Contemplate.addPlugin('print', function(v) {
    return '<pre>' + JSON.stringify(v, null, 4) + '</pre>';
} [, ctx="global"]);

// set cache directory for Node, make sure it exists
Contemplate.setCacheDir(path.join(__dirname, '/_tplcache') [, ctx="global"]);


// set caching mode for Node
// Contemplate.CACHE_TO_DISK_AUTOUPDATE, Contemplate.CACHE_TO_DISK_NOUPDATE, Contemplate.CACHE_TO_DISK_NONE
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE [, ctx="global"]);


// get a template by id, load it and cache it if needed
var tpl = Contemplate.tpl('tpl_id' [, null, options={}]);

// render template
tpl.render(data);

// render a template by id, using data, load it and cache it if needed (sync operation all engines)
Contemplate.tpl('tpl_id', data [, options]);

// Javascript-only: get or render a template by id async (promise-based), load it and cache it if needed
Contemplate.tplPromise('tpl_id', data [, options])
.then(function(tpl){
    // do something with tpl
})
.catch(function(err){
    throw err;
});

```
