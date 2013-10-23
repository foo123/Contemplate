###Manual - Keywords Reference

__Variables/Data__

Variables inside templates are referenced same as in PHP with '$' sign. ie _$x_ , _$obj["key"]_ , etc..

__IMPORTANT__ :  
Object properties and arrays are referenced with the *associative array convention* ie.

__WRONG__
$obj is a hash object (dictionary), $obj.property, $obj.property.property2

__CORRECT__
$obj is a hash object (dictionary): $obj["property"], $obj["property"]["property2"]   (use double quotes to be sure of parsed correctly)

$obj is a usual array: $obj[0], $obj[1] etc..  or $obj[0][1] etc for n-dimensional arrays

__Literal Object data__
Literal object data are constructed (inside a template) using a combination of JavaScript and PHP notation (this makes parsing easier :) )
like this:

eg. an object having various string values, numeric, values and arrays:

{ "stringVar"=> "stringValue", "numericVar"=>123, "arrayVar"=>[0, 1, "astring", 3] } etc

arbitrary level of recursion is fine as long as the convention is followed and literal strings do not contain the {, =>, } characters, variable strings (strings contained in a variable) can contain anything (see examples/tests)

eg.

this will cause the parsing to fail:

{ "stringVar"=> "string{Value" } or { "stringVar"=> "string}Value" } or { "stringVar"=> "stringValue=>" } or { "string=>Var"=> "stringValue" } etc..

while this will be fine:

assuming the (template) variable $x = "=>"

{ "stringVar" => $x } or { $x => "stringValue" } etc..



This is needed because the engine has to have uniform support for all the platforms in which it is implemented
(PHP, JavaScript, Python), Contemplate is supposed to be a light-weight template engine (no heavy parsing is done)

NOTE: It is possible in later versions a generic cross-platform dictionary class can be used (this is still light-weight if used correctly)
so any notation will be valid, however for now this is how it works.

__Control Constructs__

* *%if(expression)*  IF construct
* *%elseif(expression)*  ELSEIF construct
* *%else()*  ELSE construct
* *%endif()*   ENDIF construct, end the if construct

* *%for($obj as $key=>$val)*  FOR loop
* *%elsefor()*   ELSEFOR, alternative code block when loop is empty
* *%endfor()*  ENDFOR , end the loop construct

* *%include(tplID)*  INCLUDE (inline) the template referenced by *tplID*
* *%template(tplID, {"var1"=>val1, "var2"=>val2, ..})*  CALL a subtemplate referenced by *tplID* passing the necessary data also

* *%extends(tplID)*  Current template extends the template referenced by *tplID* , this means that *tplID* layout will be used and any blocks will be overriden as defined
* *%block(blockID)*  Define/Override block of code identified by *blockID*
* *%endblock()*  End of block definition/override


* *%htmlselect(data, options)*  render a select box from given data with given options (shorthand construct to render a select box)
* *%htmltable(data, options)*  render a table from given data with given options (shorthand construct to render a table)


###Differences between 'include' and 'template' directives
The main difference is that __include__ will actually copy the subtemplate contents inside the calling template (thus only one final template is generated). This is similar to PHP's _include_ directive.

On the contrary __template__ directive will call and parse a subtemplate on its own (so the data need to be passed also). In this case each subtemplate will be compiled on its own and exist in the cache.

When the templates are already cached, the relative performance of these directives is similar. __include__ tends to be slightly faster since it generates only a single template, while __template__ will generate all needed templates. However if a subtemplate has been changed and is embedded in another template using __include__ , the calling template will __NOT__ be refreshed. While if __template__ is used, the calling template __WILL__ be refreshed (since the subtemplate is called as a subroutine and not copied literally inside the calling template)

The syntax for __include__ is this:  %include(subtemplateId)

The syntax for __template__ is this: %template(subtemplateId, {"var1"=>$value1, "var2"=>$value2, ..}) 

where the {"var1"=>$value1, "var2"=>$value2, ..} are the data to be passed to the called template 
this is exactly how the Contemplate::tpl($id, $data) (PHP), or Contemplate.tpl(id, data) (Javascript) are called


__Functions__

* *%n(val)*   convert val to integer
* *%s(val)*   convert val to string
* *%f(val)*   convert val to float
* *%q(val)*   wrap val in single quotes
* *%dq(val)*  wrap val in double-quotes

* *%sprintf(format, val1, val2, ..)*   return a formatted string using val1, val2, etc..
* *%concat(val1, val2, val3, ..)*  string concatenate the values
* *%ltrim(val[, delim])*   left trim val of delim 
* *%rtrim(val[, delim])*   right trim val of delim 
* *%trim(val[, delim])*   left/right trim val of delim 

* *%count(arrayOrObject)*  return number of items in arrayOrObject val

* *%now()*   return current timestamp in seconds
* *%date(format, timestamp)*  return timestamp formatted according to format
* *%ldate(format, timestamp)*  return localised timestamp formatted according to format
* *%l(val)*  return localised string for val (if exists), localised strings are user-defined

* *%html(val)*  html-escape val (htmlentities)
* *%url(val)*  url-encode val (urlencode)

