Contemplate
===========

## Further development on this project has stopped!!


__Light-weight templating engine for PHP, client-side Javascript, Node.js and Python__

![Contemplate](/screenshots/contemplate.jpg)

This started as a a __proof-of-concept__ , yet is fully working and extensible.
The inspiration came from an old post by [John Resig](https://github.com/jeresig)  (http://ejohn.org/blog/javascript-micro-templating/)

__Note__
After creating the repository i became aware of a web framework with similar name here: http://www.arlomedia.com/software/contemplate/assembled/introduction.html

*This repository and project are completely unrelated to that framework.*

There is an older and quite different template engine for node.js named also "contemplate" [here](https://npmjs.org/package/contemplate) and [here](https://github.com/enricomarino/contemplate)

*This repository and project are completely unrelated to this engine.*

(it seems the word *contemplate* is nice for a template engine :) )

[![Contemplate](/screenshots/contemplate-interactive.png)](http://foo123.github.com/examples/contemplate/)


###Contents

* [Online Example](http://foo123.github.com/examples/contemplate/)
* [Rationale](#rationale)
* [Features](#features)
* [Keywords Reference](/manual.md)
* [Examples/Screenshots](#screenshots)
* [Dependencies](#dependencies)
* [Todo](#todo)
* [Tests](#tests)
* [Changelog](/changelog.md)

###Rationale

There are many templating engines out there, which are very elegant, fast, multipurpose (eg. _smarty_ _mustache_  _twig_  _handlebars_  _jade_  _doT_ and so on..)

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

* *Contemplate* does a *minimum parsing* (and caching) in order to create dynamic templates (which can be used in both PHP and Javascript)
and trying to contain the needed functionality inside the common language subset.

* Most of the time this can be accomplished, the rest functionality is built with __custom functions__ which mostly resemble the PHP
syntax, yet work the same in Javascript.

* Works the __same__ with _PHP_ , _client-side Javascript_ , _server-side Nodejs_ and _Python_ (to be added)

* Simple and light-weight ( __just 2 classes__ , one for php and one for javascript, no other dependencies)

* __Fast__ , can cache templates both in PHP and Javascript dynamically (filesystem caching has 3 modes, __NONE__ which uses only in-memory caching, __NOUPDATE__ which caches the templates only once and __AUTOUPDATE__ which re-creates the cached template if original template has changed, useful for debugging)

* Syntax __very close to PHP__ (there was an effort to keep the engine syntax as close to PHP syntax as possible, to avoid learning another language syntax)

* Easily __extensible__ , configurable

* __Localization__ , __Date formatting__ built-in and configurable easily ( simple __Data escaping__  is also supported)

* Date manipulation similar to PHP format (ie __date__ function). An extended, localized version of php's date function __ldate__ is also implemented in the framework

* Loops can have optional _elsefor()_ statement when no data, or data is empty (see test.php)

* Templates can *include* other templates (similar to PHP __include__ directive), these includes wil be compiled into the the template that called them

* Templates can *call another template* using __template__ directive, these templates are called as templates subroutines and parsed by themselves

* __Template Inheritance__ , templates can *extend/inherit other templates* using __extends__ directive and *override blocks* using __block__ , __endblock__ directives (see examples)

* Notes: __Literal double quotes__ should better be used inside templates (see the [manual](/manual.md))


###Screenshots

Sample Template markup
[![Template markup](/screenshots/template_markup.png)](https://github.com/foo123/Contemplate/raw/master/screenshots/template_markup.png)

Data to be used for the template
[![Template data](/screenshots/template_data.png)](https://github.com/foo123/Contemplate/raw/master/screenshots/template_data.png)

PHP and Javascript rendering of the template on same page (see test.php)
[![Template output](/screenshots/template_output.png)](https://github.com/foo123/Contemplate/raw/master/screenshots/template_output.png)


###Dependencies

* PHP version supported is 5.2+ , Node.js version supported is 0.8+, all major browsers.
* Only 2 classes are used (Contemplate.php, Contemplate.js), no other dependencies

###Todo

* allow custom plugins to extend the template engine
* implement Contemplate for Java
* keep-up with php, node, browsers, python updates


###Tests

Use the _test.php_ (or _test.js_ for nodejs) file to test the basic functionality

*URL* [Nikos Web Development](http://nikos-web-development.netai.net/ "Nikos Web Development")  
*URL* [WorkingClassCode](http://workingclasscode.uphero.com/ "Working Class Code")  
