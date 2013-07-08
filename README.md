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

* __Localization__ , __Data escaping__ can be built-in and configurable easily (localization functions are already built-in)

* Loops can have optional _elsefor()_ statement when no data, or data is empty (see test.php)

* Templates can *include* other templates (similar to PHP __include__ directive), right now these includes wil be compiled into the the template that called them

* Notes: __Literal double quotes__ should better be used inside templates


###Dependencies

* PHP version supported is 5.2+ and all major browsers.
* Only 2 classes are used (Contemplate.php, Contemplate.js), no other dependencies

###Tests

Use the _test.php_ file to test the basic functionality


###ChangeLog

__0.2__
* add filesystem caching, refactor, optimize

__0.1__
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
