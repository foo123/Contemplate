###Manual - Keywords Reference


__Template Separators__


**IMPORTANT** As of version 0.6+ , template separators for Contemplate templates are defined **inside** the template itself
in the first non-empty line, separated by a space (see examples and tests). Optionally (for a single template) they can also be passed as **part of parse options** when calling the *Contemplate.tpl( tplID [, data, {separators: seps}] )* method



__Template Variables__


Variables in a template are referenced using **PHP-style Notation** with '$' sign. 

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



__Literal Template Data__


Literal object/array data are constructed in a template using **JavaScript Literal Object-style Notation** (similar to JSON)

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


__Dynamic Template Inheritance__

Templates can extend another template. This is accomplished using **extends** directive, **inside** the template.
This means that the super-template (id) is hardcoded inside the cached template (once compiled).

Right now there are 2 ways to have dynamic template extension according to a condition based on input data.


**1st** is to assign the super-template **id** (i.e as used in **extends(id)** ) to another template. 
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


__Template Directives / Control Constructs__


* *%isset(var)*  CHECK whether a tpl variable *$var* is set
* *%set(var, expressionOrValue)*  SET / UPDATE a tpl variable *$var* to given value or expression
* *%unset(var)*  UNSET / DELETE tpl variable *$var*

* *%if(expressionOrValue)*  IF construct
* *%elseif(expressionOrValue)*  ELSEIF construct
* *%else()*  ELSE construct
* *%endif()*   ENDIF construct, end the if construct

* *%for($obj as $key=>$val)*  associative FOR loop
* *%for($obj as $val)*  non-associative FOR loop
* *%elsefor()*   ELSEFOR, alternative code block when loop is empty
* *%endfor()*  ENDFOR , end the loop construct

* *%include(tplID)*  INCLUDE (inline) the template referenced by *tplID*
* *%template(tplID, {"var1" : val1, "var2" : val2, ..})*  CALL a subtemplate referenced by *tplID* passing the necessary data also

* *%extends(tplID)*  Current template extends the template referenced by *tplID* , this means that *tplID* layout will be used and any blocks will be overriden as defined
* *%block(blockID)*  Define/Override block of code identified by *blockID*
* *%endblock()*  End of block definition/override



###Differences between 'include' and 'template' directives
The main difference is that __include__ will actually copy the subtemplate contents inside the calling template (thus only one final template is generated). This is similar to PHP's _include_ directive.

On the contrary __template__ directive will call and parse a subtemplate on its own (so the data need to be passed also). In this case each subtemplate will be compiled on its own and exist in the cache.

When the templates are already cached, the relative performance of these directives is similar. __include__ tends to be slightly faster since it generates only a single template, while __template__ will generate all needed templates. However if a subtemplate has been changed and is embedded in another template using __include__ , the calling template will __NOT__ be refreshed. While if __template__ is used, the calling template __WILL__ be refreshed (since the subtemplate is called as a subroutine and not copied literally inside the calling template)

The syntax for __include__ is this:  %include(subtemplateId)

The syntax for __template__ is this: %template(subtemplateId, {"var1":$value1, "var2":$value2, ..}) 

where the {"var1":$value1, "var2":$value2, ..} are the data to be passed to the called template 
this is exactly how the Contemplate::tpl($id, $data) (PHP), or Contemplate.tpl(id, data) (Javascript) are called




__Template Functions / Plugins__


* *%e(str)*   custom fast html escape
* *%n(val)*   convert val to integer
* *%s(val)*   convert val to string
* *%f(val)*   convert val to float
* *%q(val)*   wrap val in single quotes
* *%dq(val)*  wrap val in double-quotes

* *%addslashes(str)*  addslashes (php-like) function
* *%stripslashes(str)*  stripslashes (php-like) function
* *%sprintf(format, val1, val2, ..)*   return a formatted string using val1, val2, etc..
* *%concat(val1, val2, val3, ..)*  string concatenate the values
* *%ltrim(val [, delim])*   left trim val of delim 
* *%rtrim(val [, delim])*   right trim val of delim 
* *%trim(val [, delim])*   left/right trim val of delim 
* *%lowercase(val)*   convert val to lowercase
* *%uppercase(val)*   convert val to uppercase
* *%camelcase(val [,sep="_" , capitalizeFirst=false])*   convert val to **camelCase** , based on **sep** separator
* *%snakecase(val [,sep="_"])*   convert val to **snake_case** , based on **sep** separator

* *%count(arrayOrObject)*  return number of items in arrayOrObject val
* *%haskey(arrayOrObject, key1 [,key2, ..] )*  check whether array or object tplVar has the given (nested) keys
* *%uuid(namespace)*  generate a uuid (universal unique identifier)

* *%now()*   return current timestamp in seconds
* *%time()*   return current timestamp in seconds
* *%date(format, timestamp)*  return timestamp formatted according to format
* *%ldate(format, timestamp)*  return localised timestamp formatted according to format, localised strings are user-defined
* *%locale(val)* , *%l(val)*  return localised string for val (if exists), localised strings are user-defined
* *%pluralise(singular, count)*  return plural string for singular (if exists) depending on count, pluralised strings are user-defined

* *%htmlselect(data, options)*  render a select box from given data with given options (shorthand to render a select box)
* *%htmltable(data, options)*  render a table from given data with given options (shorthand to render a table)

* *%html(val)*  html-escape val (htmlentities)
* *%url(val)*  url-encode val (urlencode)

* *%plg_pluginName([val1, val2, ..])* , *%plugin_pluginName([val1, val2, ..])*  call a custom (user-defined) plugin as a template function
