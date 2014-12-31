Contemplate
===========

__Light-weight, fast and flexible template engine for PHP, Python, Node and client-side JavaScript, ActionScript(TODO)__


![Contemplate](/screenshots/contemplate.jpg)


[Contemplate.js](https://raw.githubusercontent.com/foo123/Contemplate/master/src/js/Contemplate.js),  [Contemplate.min.js](https://raw.githubusercontent.com/foo123/Contemplate/master/src/js/Contemplate.min.js)


**see also:**  

* [ModelView](https://github.com/foo123/modelview.js) a light-weight and flexible MVVM framework for JavaScript/HTML5
* [ModelView MVC jQueryUI Widgets](https://github.com/foo123/modelview-widgets) plug-n-play, state-full, full-MVC widgets for jQueryUI using modelview.js (e.g calendars, datepickers, colorpickers, tables/grids, etc..) (in progress)
* [Dromeo](https://github.com/foo123/Dromeo) a flexible, agnostic router for Node/JS, PHP, Python, ActionScript
* [Xpresion](https://github.com/foo123/https://github.com/foo123/Xpresion) a simple and flexible eXpression parser engine (with custom functions and variables support) for PHP, Python, Node/JS, ActionScript
* [Regex Analyzer/Composer](https://github.com/foo123/https://github.com/foo123/RegexAnalyzer) Regular Expression Analyzer and Composer for Node/JS, PHP, Python, ActionScript
* [Dialect](https://github.com/foo123/https://github.com/foo123/Dialect) a simple and flexible SQL Query Builder for PHP, Python, Node/JS, ActionScript (in progress)
* [Asynchronous](https://github.com/foo123/asynchronous.js) a simple manager for async, linearised, parallelised, interleaved and sequential tasks for JavaScript


This started as a a __proof-of-concept__ . 
The inspiration came from an old post by [John Resig](https://github.com/jeresig)  (http://ejohn.org/blog/javascript-micro-templating/)

----------------------------------------------------------------------------------------------------------------------

**Note**
There are a couple of other frameworks named also _contemplate_

* http://www.arlomedia.com/software/contemplate/assembled/introduction.html
* There is an older and quite different template engine for node named also "contemplate" [here](https://npmjs.org/package/contemplate) and [here](https://github.com/enricomarino/contemplate)

*This repository and project is completely unrelated to these frameworks.*

(it seems the word *contemplate* is nice for a template engine :) )

----------------------------------------------------------------------------------------------------------------------

[![Contemplate](/screenshots/contemplate-interactive.png)](http://foo123.github.com/examples/contemplate/)


###Contents

* [Online Example](http://foo123.github.com/examples/contemplate/)
* [Rationale](#rationale)
* [Features](#features)
* [API Reference](/manual.md)
* [Dependencies](#dependencies)
* [Changelog](/changelog.md)
* [Todo](#todo)
* [Performance](#performance)
* [Tests](#tests)
* [Examples/Screenshots](#screenshots)


###Rationale

There are many templating engines out there, which are elegant, fast, multipurpose (eg. _smarty_ _mustache_  _twig_  _swig_ _handlebars_  _jade_  _doT_ and so on..)

Most of the sophisticated engines use a custom parser (and usually a full-fledged framework) to build the engine. 

This is highly versatile:

1. but can have performance issues sometimes

2. and / or requires to learn a (completely) new syntax for building a template.


These drawbacks can be compensated if one uses PHP itself as templating engine. PHP already **IS** a templating language and a very fast at it.

This can create very simple, intuitive and fast templates.

The drawbacks of this approach are:

1. It works only with PHP, and many times the same template needs to be used also by Javascript

2. It can be cumbersome to combine or iterate over templates and parts.


*Contemplate* seeks to find the best balance between these requirements.

The solution is inspired by _John Resig's post_ ([see above](http://ejohn.org/blog/javascript-micro-templating/)) and the fact that PHP, Python and JavaScript share a __common language subset__.



###Features:

* *Contemplate* does a __minimum parsing__ (and caching) in order to create dynamic templates
and trying to contain the needed functionality inside the common language subset(s).

* Most of the time this can be accomplished, the rest functionality is built with __custom functions__ which mostly resemble the PHP
syntax, yet work the same in all the engine's implementations.

* Engine Implementations for __PHP__ , __Python__ , __Node__  and __client-side JavaScript__

* Simple and __light-weight__ ( only one relatively small class for each implementation, no other dependencies ) ~30kB minified, ~11kB zipped

* __Fast__ , can cache templates dynamically (filesystem caching has 3 modes, __NONE__ which uses only in-memory caching, __NOUPDATE__ which caches the templates only once and __AUTOUPDATE__ which re-creates the cached template if original template has changed, useful for debugging)

* Generated cached template code is __formatted and annotated__ with comments, for easy debugging (note: javascript cached templates are UMD modules which can be used in both node/AMD/browser)

* Syntax __close to PHP__ (there was an effort to keep the engine syntax as close to PHP syntax as possible, to avoid learning another language syntax)

* Easily __extensible__ , __configurable__

* __Localization__ , __Pluralisation__ , __Date formatting__ built-in and configurable easily ( simple __Data escaping__  is also supported)

* __Date manipulation__ similar to PHP format (ie __date__ function). An extended, localized version of php's date function __ldate__ is also implemented in the framework

* Loops can have optional __elsefor()__ statement when no data, or data is empty (see tests)

* Templates can __include__ other templates (similar to PHP _include_ directive), these includes wil be compiled into the the template that called them

* Templates can *call another template* using __template__ directive, these templates are called as templates subroutines and parsed by themselves

* Templates and template functions can also have **inline templates** as parameters via __inline__ template function

* __Template Inheritance__ , templates can *extend/inherit other templates* using __extends__ directive and *override blocks* using __block__ , __endblock__ directives (see examples)

* __Nested Blocks__ , *template blocks* can be nested and repeated in multiple ways

* __Custom Plugins__ , can be used as template functions to enhance/extend the engine functionality


###Dependencies

* Only 3 classes are used (Contemplate.php, Contemplate.js, Contemplate.py), no other dependencies
* PHP 5.2+ supported
* Node 0.8+ supported
* Python 2.x or 3.x supported
* all major browsers


###Todo

* support asynchronous template loading/rendering for node/browser
* add Contemplate implementations for Perl, Java, Scala
* transform Contemplate (for PHP) into a PHP C-extension, Contemplate (for node) into standalone executable (eg. https://github.com/crcn/nexe)
* keep-up with php, node, browsers, python updates


###Performance

**Note:** The engines included in the (following) tests, have different philosophy and in general provide different features. These are only illustrative modulo all the other features.


**Render Time**

The following tests were made on a revision of a 2013 jsperf test for various javascript template engines. More tests should be done.

Contemplate (0.6.5) was 2nd place on Firefox and 3rd (or close) place on Opera, IE, while Contemplate was average to slower on Chrome. The reason was mostly that Contemplate was using a code to copy/isolate the input data every time inside the render function, which most of the time is redundant, else user can use the *Contemplate.data* method to create a shallow copy suitable to be used as render data. So this was removed, plus some minor refactoring and minor loop optimisation.

This resulted in great performance increase as shown below. (see changelog)

Previous tests are here [jsperf/0.6.5](http://jsperf.com/js-template-engines-performance/94), [jsperf/0.6.7](http://jsperf.com/js-template-engines-performance/96), [jsperf/0.7](http://jsperf.com/js-template-engines-performance/112), [jsperf/0.7.1](http://jsperf.com/js-template-engines-performance/116), [jsperf/0.8](http://jsperf.com/js-template-engines-performance/117), [jsperf/0.8.1](http://jsperf.com/js-template-engines-performance/120)

Contemplate (0.8.1) is (consistently) 1st place on almost all browsers.

[![contemplate rendering jsperf](/screenshots/jsperf-rendering.png)](http://jsperf.com/js-template-engines-performance/120)


**Parse / Compilation Time**

The following tests involve swig, handlebars contemplate and mustache javascript template engines. More tests should be done.

Previous tests are here [jsperf/0.6.7](http://jsperf.com/js-template-engines-compilation/3), [jsperf/0.7](http://jsperf.com/js-template-engines-compilation/7), [jsperf/0.7.1](http://jsperf.com/js-template-engines-compilation/8), [jsperf/0.8](http://jsperf.com/js-template-engines-compilation/11), [jsperf/0.8.1](http://jsperf.com/js-template-engines-compilation/12)

Contemplate engine (0.8.1) is (consistently) 1st place on almost all browsers.

[![contemplate parse jsperf](/screenshots/jsperf-compilation.png)](http://jsperf.com/js-template-engines-compilation/12)



###Tests

Use _test.php_ (for php), _test.js_ (for node), _test.py_ (for python)
under **tests** folder, to test the basic functionality


###Screenshots

Sample Template markup
[![Template markup](/screenshots/template_markup.png)](https://github.com/foo123/Contemplate/raw/master/screenshots/template_markup.png)

Data to be used for the template
[![Template data](/screenshots/template_data.png)](https://github.com/foo123/Contemplate/raw/master/screenshots/template_data.png)

PHP and Javascript rendering of the template on same page (see test.php)
[![Template output](/screenshots/template_output.png)](https://github.com/foo123/Contemplate/raw/master/screenshots/template_output.png)



*URL* [Nikos Web Development](http://nikos-web-development.netai.net/ "Nikos Web Development")  
*URL* [WorkingClassCode](http://workingclasscode.uphero.com/ "Working Class Code")  
