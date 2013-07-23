Contemplate
===========

__Simple, light-weight and fast templating engine for both PHP, client-side Javascript and Node.js__

![Contemplate](/screenshots/contemplate.jpg)

This started as a a __proof-of-concept__ , yet is fully working and extensible.
The inspiration came from an old post by _John Resig_ (http://ejohn.org/blog/javascript-micro-templating/)

###Notes:
After creating the repository i became aware of a web framework with similar name here: http://www.arlomedia.com/software/contemplate/assembled/introduction.html

*This repository and project are completely unrelated to that framework.*


###Rationale

There are many templating engines out there, which are very elegant, fast, multipurpose (eg. _mustache_  _twig_  _handlebars_  _jade_  _doT_ and so on..)

Most of the sophisticated engines use a custom parser to build the engine. 

This is highly versatile:

1. but can have performance issues sometimes

2. and / or requires to learn a (completely) new syntax for building a template.

These drawbacks can be compensated if one uses PHP itself as templating engine. PHP already __IS__ a templating language and a very fast at it.

This can create very simple, intuitive and fast templates.

The drawbacks of this approach are:

1. It works only with PHP, and many times the same template needs to be used also by Javascript

2. It can be cumbersome to combine or iterate over templates and parts.

*Contemplate* seeks to find the best balance between these requirements.

The solution is inspired by _John Resig's post_ ([see above](http://ejohn.org/blog/javascript-micro-templating/)) and the fact that PHP and Javascript share a __common language subset__.

###Features:

* *Contemplate* does a minimum parsing (and caching) in order to create dynamic templates (which can be used in both PHP and Javascript)
and trying to contain the needed functionality inside the common language subset.

* Most of the time this can be accomplished, the rest functionality is built with __custom functions__ which mostly resemble the PHP
syntax, yet work the same in Javascript.

* Simple and light-weight ( __just 2 classes__ , one for php and one for javascript, no other dependencies)

* __Fast__ , can cache templates both in PHP and Javascript dynamically (filesystem caching has 3 modes, __NONE__ which uses only in-memory caching, __NOUPDATE__ which caches the templates only once and __AUTOUPDATE__ which re-creates the cached template if original template has changed, useful for debugging)

* Syntax very close to PHP (there was an effort to keep the engine syntax as __close to PHP syntax__ as possible, to avoid learning another language syntax)

* Easily __extensible__ , configurable

* __Localization__ , __Date formatting__ built-in and configurable easily ( __Data escaping__  going to be added also)

* Date manipulation similar to PHP format (ie __date__ function). An extended, localized version of php's date function __ldate__ is also implemented in the framework

* Loops can have optional _elsefor()_ statement when no data, or data is empty (see test.php)

* Templates can *include* other templates (similar to PHP __include__ directive), right now these includes wil be compiled into the the template that called them

* Templates can *call another template* using __template__ directive, these templates are called as templates subroutines and parsed by themselves

* Notes: __Literal double quotes__ should better be used inside templates

###Differences between 'include' and 'template' directives
The main difference is that __include__ will actually copy the subtemplate contents inside the calling template (thus only one final template is generated). This is similar to PHP's _include_ directive.

On the contrary __template__ directive will call and parse a subtemplate on its own (so the data need to be passed also). In this case each subtemplate will be compiled on its own and exist in the cache.

When the templates are already cached, the relative performance of these directives is similar. __include__ tends to be slightly faster since it generates only a single template, while __template__ will generate all needed templates. However if a subtemplate has been changed and is embedded in another template using __include__ , the calling template will __NOT__ be refreshed. While if __template__ is used, the calling template __WILL__ be refreshed (since the subtemplate is called as a subroutine and not copied literally inside the calling template)

The syntax for __include__ is this:  %include(subtemplate_id)

The syntax for __template__ is this: %template(subtemplate_id, {"var1"=>$value1, "var2"=>$value2, ..}) 

where the {"var1"=>$value1, "var2"=>$value2, ..} are the data to be passed to the called template 
this is exactly how the Contemplate::tpl($id, $data) (PHP), or Contemplate.tpl(id, data) (Javascript) are called

###Dependencies

* PHP version supported is 5.2+ and all major browsers.
* Only 2 classes are used (Contemplate.php, Contemplate.js), no other dependencies

###Tests

Use the _test.php_ file to test the basic functionality


###ChangeLog

__0.3__
* add *template* directive
* add template functions to manipulate dates and localized dates
* add some javascript methods from [phpjs](https://github.com/kvz/phpjs) project, (trim, sprintf, time, date), these are available as template functions (eg %sprintf, %trim, etc..)
* make the Contemplate.js class compatible with both browser, node.js and requirejs configurations

__0.2__
* add *include* directive
* make template separators configurable
* add filesystem caching, refactor, optimize

__0.1__
* add localization options and template functions
* initial release


###Screenshots

Sample Template markup
[![Template markup](/screenshots/template_markup.png)](https://github.com/foo123/Contemplate/raw/master/screenshots/template_markup.png)

Data to be used for the template
[![Template data](/screenshots/template_data.png)](https://github.com/foo123/Contemplate/raw/master/screenshots/template_data.png)

PHP and Javascript rendering of the template on same page (see test.php)
[![Template output](/screenshots/template_output.png)](https://github.com/foo123/Contemplate/raw/master/screenshots/template_output.png)


*Contributor* Nikos M.  
*URL* [Nikos Web Development](http://nikos-web-development.netai.net/ "Nikos Web Development")  
*URL* [WorkingClassCode](http://workingclasscode.uphero.com/ "Working Class Code")  
