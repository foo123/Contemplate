###Contemplate Manual

**version 1.0.0; platforms: PHP, Python, Node/JS**


###Contents

1. [Template Separators](#template-separators)
2. [Template Variables](#template-variables)
3. [Literal Template Data](#literal-template-data)
4. [Dynamic Template Inheritance](#dynamic-template-inheritance)
5. [Dynamic Contexts](#dynamic-contexts)
6. [Template Directives](#template-directives)
7. [Template Functions and Plugins](#template-functions-and-plugins)
    1. [Differences between `include` and `template`](#differences-between-include-and-template)
8. [Contemplate API](#contemplate-api)



####Template Separators


**IMPORTANT** As of version `0.6+` , template separators for `Contemplate` templates are defined **inside** the template itself
in the first non-empty line, separated by a space (see examples and tests). Optionally (for a single template) they can also be passed as **part of parse options** when calling the `Contemplate.tpl( tplID [, data, {separators: seps}] )` method



####Template Variables


Variables in a template are referenced using `PHP`-style Notation with `$` sign. 

example:

```javascript

$x 

$obj["key"]

$obj.key  // this will also work

$obj[0]["key"]

$obj.0.key  // this will also work

$obj["key"].key2

$obj.key["key2"]  // this will also work

// etc..

```



####Literal Template Data


Literal `object`/`array` data are constructed in a template using `JavaScript` Literal Object-style Notation (similar to `JSON`)

example:

```javascript

// eg. a literal object having various string values, numeric, values and arrays:
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


####Dynamic Template Inheritance

Templates can extend another template. This is accomplished using `%extends` directive, **inside** the template.
This means that the super-template (id) is hardcoded inside the cached template (once compiled).

Right now there are 2 ways to have dynamic template extension according to a condition based on input data.


**1st** is to assign the super-template **id** (i.e as used in `%extends(id)` ) to another template. 
In this way the template id used in *extends directive* will refer to a different template.
This will change the referenced super-template for all other templates that extend the same super-template as well.


**2nd** way is on a template-by-template basis. Example:

```javascript
// fetch/parse the template
tpl = Contemplate.tpl( tplID );

// tpl may already have a super-template assigned, but one can change this
if ( 'json' == data.view)  tpl.extend( newSuperTemplateID );

tpl.render( data );

```

####Dynamic Contexts

The engine can use **multiple dynanic contexts** to have contextual settings, like `templates`, `locales`, `caching`, `plugins` so that different modules of an application can **use the engine independantly**.

A dynamic context is created with `Contemplate.createCtx( 'my-context' );`
A dynamic context is disposed with `Contemplate.disposeCtx( 'my-context' );`

If a context already exists, it is not re-created in `createCtx` method. If a context does not already exist, `disposeCtx` method does nothing.

All other `API` methods of `Contemplate` can accept a `context id` (so operations take place in that context) either via `options` (in methods that accept an `options` parameter) or via an additional `ctx` string parameter (see examples).

If no context is given, API operations take place in the `global` context `"__GLOBAL__"`.
TEMPLATE operations take place in the `current` context (which defaults to `global` if no other context specified)



####Template Directives


* `%set( $var, expression_or_value )`  SET / UPDATE a tpl variable `$var` to given value or expression
* `%unset( $var )`  UNSET / DELETE tpl variable `$var`
* `%isset( $var )`  CHECK whether a tpl variable `$var` is set
* `%if( expression_or_value )`  IF construct
* `%elseif( expression_or_value )` / `%elif( expression_or_value )`  ELSEIF construct
* `%else()`  ELSE construct
* `%endif()` / `%fi()` ENDIF construct, end the IF construct
* `%for( expression_or_obj as $key=>$val )`  associative FOR loop (`php`-style)
* `%for( expression_or_obj as $val )`  non-associative FOR loop (`php`-style)
* `%for( $key,$val in expression_or_obj )`  associative FOR loop (`python`-style)
* `%for( $val in expression_or_obj )`  non-associative FOR loop (`python`-style)
* `%elsefor()`   ELSEFOR, alternative code block when loop is empty
* `%endfor()`  ENDFOR , end the FOR loop construct
* `%extends( base_tpl_id_string )`  Current template extends the template referenced by `base_tpl_id_string` , this means that `base_tpl` layout will be used and any blocks will be overriden as defined
* `%block( block_id_string, echoed=true )`  Define / Override `block` of code identified by `block_id`
* `%endblock()`  End of `block` definition / override
* `%super( block_id_string )`  Reference a super `block` directly if needed in OO manner (mostly useful inside `block` definitions overriden by current template)
* `%getblock( block_id_string )`  Get `block` output directly via function call (can be useful when `block` content is needed as a parameter)
* `%include( tpl_id_string )`  INCLUDE (inline) the template referenced by `tpl_id`



####Template Functions and Plugins


* `%n( val )`   convert `val` to integer
* `%s( val )`   convert `val` to string
* `%f( val )`   convert `val` to float
* `%q( val )`   wrap `val` in single-quotes
* `%qq( val )` / `%dq( val )`  wrap `val` in double-quotes
* `%addslashes( str )`  addslashes (`php`-like) function
* `%stripslashes( str )`  stripslashes (`php`-like) function
* `%sprintf( format, val1, val2, .. )`   return a formatted string using `val1`, `val2`, etc..
* `%concat( val1, val2, val3, .. )`  string concatenate the values
* `%ltrim( val [, delim] )`   left trim `val` of delim (default to spaces)
* `%rtrim( val [, delim] )`   right trim `val` of delim (default to spaces)
* `%trim( val [, delim] )`   left/right trim `val` of delim (default to spaces)
* `%lowercase( val )`   convert `val` to `lowercase`
* `%uppercase( val )`   convert `val` to `UPPERCASE`
* `%lcfirst( val )`   convert first letter to `lOWERCASE` (`php`-like function)
* `%ucfirst( val )`   convert first letter to `Uppercase` (`php`-like function)
* `%camelcase( val [,sep="_" , capitalizeFirst=false] )`   convert `val` to `camelCase`, based on `sep` separator
* `%snakecase( val [,sep="_"] )`   convert `val` to `snake_case`, based on `sep` separator
* `%count( array_or_object )`  return number of items in `array_or_object` argument
* `%haskey( array_or_object, key1 [,key2, ..] )`  check whether `array_or_object` argument has the given (nested) keys
* `%uuid( namespace )`  generate a `uuid` (universal unique identifier), with optional given namespace
* `%time()` / `%now()`   return current timestamp in seconds (`php`-like function)
* `%date( format [, timestamp=now] )`  return timestamp formatted according to format
* `%ldate( format [, timestamp=now] )`  return localised timestamp formatted according to format, localised strings are user-defined
* `%locale( val )` / `%l( val )`  return localised string for `val`, if exists (localised strings are user-defined)
* `%plural( singular, count )`  return plural string for `singular`, if exists depending on `count` (pluralised strings are user-defined)
* `%inline( tpl, [reps|data] )`  create or render an `inline` template referenced in 'tpl'
* `%tpl( tpl_id_string, {"var1" : val1, "var2" : val2, ..} )` / `%template( tpl_id_string, {"var1" : val1, "var2" : val2, ..} )`  CALL a subtemplate referenced by 'tpl_id', passing the necessary data
* `%e( val )`   custom fast html escape
* `%url( val )`  url-encode val (`urlencode`)
* `%pluginName( [val1, val2, ..] )`  call a custom (user-defined) `plugin` as a template function (see examples)




####Differences between `include` and `template`

The main difference is that `%include` will actually copy the subtemplate contents inside the calling template (thus only one final template is generated). This is similar to PHP's `include` directive.

On the contrary `%tpl` directive will call and parse a subtemplate on its own (so the data need to be passed also). In this case each subtemplate will be compiled on its own and exist in the cache.

When the templates are already cached, the relative performance of these directives is similar. `%include` tends to be slightly faster since it generates only a single template, while `%template` will generate all needed templates. However if a subtemplate has been changed and is embedded in another template using `%include` , the calling template will __NOT__ be refreshed. While if `%template` is used, the calling template __WILL__ be refreshed (since the subtemplate is called as a subroutine and not copied literally inside the calling template)

The syntax for `%include` is this:  `%include( subtemplateId )`

The syntax for `%tpl` / `%template` is this: `%tpl( subtemplateId, {"var1":$value1, "var2":$value2, ..} )` 

where the `{"var1":$value1, "var2":$value2, ..}` are the data to be passed to the called template 
this is exactly how the `Contemplate.tpl(id, data)` method is called.


####Contemplate API

**(javascript)**
```javascript

// create a custom dynamic context for modular use
Contemplate.createCtx( 'my-context' );

// dispose a custom dynamic context (created earlier)
Contemplate.disposeCtx( 'my-context' );

// Add templates
Contemplate.add({
    'tpl1': './path/to/template1',
    'tpl2': './path/to/template2',
    'inline_tpl': ['<% $var %>'], // inline template
    'dom_tpl': '#dom_tpl_id' // DOM template (for browser)
} [, ctx="__GLOBAL__"]);

// add localisation
Contemplate.setLocales({
    "locale": "γλωσσική περιοχή"
} [, ctx="__GLOBAL__"]);

Contemplate.clearLocales([ctx="__GLOBAL__"]);

// add pluralisation
Contemplate.setPlurals({
    'item': 'items'
} [, ctx="__GLOBAL__"]);

Contemplate.clearPlurals([ctx="__GLOBAL__"]);

// add plugins
Contemplate.addPlugin('print', function(v){
    return '<pre>' + JSON.stringify(v, null, 4) + '</pre>';
} [, ctx="__GLOBAL__"]);

// set cache directory for Node, make sure it exists
Contemplate.setCacheDir( fs.realpathSync(path.join(__dirname, '/_tplcache')) [, ctx="__GLOBAL__"] );


// set caching mode for Node
// Contemplate.CACHE_TO_DISK_AUTOUPDATE, Contemplate.CACHE_TO_DISK_NOUPDATE, Contemplate.CACHE_TO_DISK_NONE
Contemplate.setCacheMode( Contemplate.CACHE_TO_DISK_AUTOUPDATE [, ctx="__GLOBAL__"] );


// get a template by id, load it and cache it if needed
var tpl = Contemplate.tpl('tpl_id' [, null, options={}]);

// render template
tpl.render(data);

// render a template by id, load it and cache it if needed
Contemplate.tpl('tpl_id', data [, options]);

```
