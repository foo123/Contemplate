Contemplate
===========

__Light-weight, fast and flexible "object-oriented" template engine for PHP, Python, Node.js, Browser client-side and XPCOM JavaScript__


![Contemplate](/screenshots/contemplate.jpg)


[Contemplate.js](https://raw.githubusercontent.com/foo123/Contemplate/master/src/js/Contemplate.js),  [Contemplate.min.js](https://raw.githubusercontent.com/foo123/Contemplate/master/src/js/Contemplate.min.js)


[Meaning of Yoga in Indian Philosophy (wikipedia)](https://en.wikipedia.org/wiki/Yoga)
(*"unifying through yoga, contemplate and attain mastery"*)


**see also:**  

* [HtmlWidget](https://github.com/foo123/HtmlWidget) html widgets used as (template) plugins and/or standalone for PHP, Python, Node.js / Browser / XPCOM Javascript both client and server-side (can be used as [plugins for Contemplate](/src/js/plugins/plugins.txt))
* [Tao](https://github.com/foo123/Tao.js) A simple, tiny, isomorphic, precise and fast template engine for handling both string and live dom based templates
* [ModelView](https://github.com/foo123/modelview.js) a light-weight and flexible MVVM framework for JavaScript/HTML5
* [ModelView MVC jQueryUI Widgets](https://github.com/foo123/modelview-widgets) plug-n-play, state-full, full-MVC widgets for jQueryUI using modelview.js (e.g calendars, datepickers, colorpickers, tables/grids, etc..) (in progress)
* [Importer](https://github.com/foo123/Importer) simple class &amp; dependency manager and loader for PHP, Python, Node.js / Browser / XPCOM Javascript
* [PublishSubscribe](https://github.com/foo123/PublishSubscribe) a simple and flexible publish-subscribe pattern implementation for PHP, Python, Node.js / Browser / XPCOM Javascript
* [Dromeo](https://github.com/foo123/Dromeo) a flexible, and powerfull agnostic router for PHP, Python, Node.js / Browser / XPCOM Javascript
* [Dialect](https://github.com/foo123/Dialect) a simple cross-vendor &amp; cross-platform SQL construction for PHP, Python, Node.js / Browser / XPCOM Javascript
* [Xpresion](https://github.com/foo123/Xpresion) a simple and flexible eXpression parser engine (with custom functions and variables support) for PHP, Python, Node.js / Browser / XPCOM Javascript
* [GrammarTemplate](https://github.com/foo123/GrammarTemplate) versatile and intuitive grammar-based templating for PHP, Python, Node.js / Browser / XPCOM Javascript
* [GrammarPattern](https://github.com/foo123/GrammarPattern) versatile grammar-based pattern-matching for Node / XPCOM / JS (IN PROGRESS)
* [Regex Analyzer/Composer](https://github.com/foo123/RegexAnalyzer) Regular Expression Analyzer and Composer for PHP, Python, Node.js / Browser / XPCOM Javascript
* [DateX](https://github.com/foo123/DateX) eXtended &amp; localised Date parsing, diffing, formatting and validation for PHP, Python, Node.js / Browser / XPCOM Javascript
* [Abacus](https://github.com/foo123/Abacus) a fast combinatorics and computation library for PHP, Python, Node.js / Browser / XPCOM Javascript
* [RT](https://github.com/foo123/RT) client-side real-time communication for Node/XPCOM/JS with support for Poll / BOSH / WebSockets
* [Asynchronous](https://github.com/foo123/asynchronous.js) a simple manager for async, linearised, parallelised, interleaved and sequential tasks for JavaScript


This started as a a __proof-of-concept__ but developed into a __full-blown and versatile__ template engine.

The original inspiration came from an old post by [John Resig](https://github.com/jeresig)  (http://ejohn.org/blog/javascript-micro-templating/)

----------------------------------------------------------------------------------------------------------------------

**Note**
There are a couple of other frameworks named also `contemplate`

* http://www.arlomedia.com/software/contemplate/assembled/introduction.html
* There is an older and quite different template engine for `node` named also `"contemplate"` [here](https://npmjs.org/package/contemplate) and [here](https://github.com/enricomarino/contemplate)


**This repository and project is completely unrelated to these frameworks.**

----------------------------------------------------------------------------------------------------------------------

[![Contemplate](/screenshots/contemplate-interactive.png)](https://foo123.github.com/examples/contemplate/)


### Contents

* [Online Playground Example](https://foo123.github.com/examples/contemplate/)
* [Rationale](#rationale)
* [Features](#features)
* [API Reference](/manual.md)
* [Dependencies](#dependencies)
* [Changelog](/changelog.md)
* [Todo](#todo)
* [Performance](#performance)
* [Tests](#tests)
* [Examples/Screenshots](#screenshots)


**If you use `Contemplate` in your application and you want to share it, feel free to submit an example link**


### Rationale

There are many templating engines out there, which are elegant, fast, multipurpose  and so on..
Most of the sophisticated engines use a custom parser (and usually a full-fledged framework) to build the engine. 

This is highly versatile:

1. but can have performance issues sometimes

2. and / or requires to learn a (completely) new syntax for building a template.


These drawbacks can be compensated if one uses `PHP` itself as templating engine. `PHP` already **IS** a templating language and a very fast at it.

This can create very simple, intuitive and fast templates.

The drawbacks of this approach are:

1. It works only with `PHP`, and many times the same template needs to be used also by `JavaScript`

2. It can be cumbersome to combine or iterate over templates and parts.


`Contemplate` seeks to find the best balance between these requirements.

The solution is inspired by _John Resig's post_ ([see above](http://ejohn.org/blog/javascript-micro-templating/)) and the fact that `PHP`, `Python` and `JavaScript` share a __common language subset__.



### Features:

* `Contemplate` does a __minimum parsing__ (and caching) in order to create dynamic templates
and trying to contain the needed functionality inside the common language subset(s).

* Most of the time this can be accomplished, the rest functionality is built with __custom functions__ which mostly resemble the `PHP` syntax, yet work the same in all the engine's implementations.

* __Uniform functionality__, Engine Implementations for __PHP__ , __Python__ , __Node.js__ , __XPCOM__ and __Browser client-side JavaScript__ (**NOTE** `javascript` engine supports **both sync and async operations both callback-based and promise-based**)

* Simple and __light-weight__ ( only one relatively small class for each implementation, no other dependencies ) `~50kB` minified, `~16kB` zipped

* __Fast__ , can cache templates dynamically (filesystem caching has 3 modes, `NONE` which uses only in-memory caching, `NOUPDATE` which caches the templates only once and `AUTOUPDATE` which re-creates the cached template if original template has changed, useful for debugging)

* Generated cached template code is __formatted and annotated__ with comments, for easy debugging (note: `javascript` cached templates are **`UMD` modules** which can be used in both `node.js`/`AMD`/`XPCOM`/`browser`/`es6 module fallback`)

* Syntax __close to `PHP`__ (there was an effort to keep the engine syntax as close to `PHP` syntax as possible, to avoid learning another language syntax)

* Easily __extensible__ , __configurable__

* __Object-oriented__ , templates implement **inheritance** and **polymorphism** in a full *object-oriented* manner (see below)

* Supports multiple __dynamic contexts__ , and __contextual settings__ so that different modules of an application can use the engine independantly (see examples and manual)

* __Localization__ , __Pluralisation__ , __Date formatting__ built-in and configurable easily ( simple __Data escaping__  is also supported)

* `X-GetText` / `POEdit` translation-friendly localisation (**keywords:** `locale`, `xlocale:1,2c`, `nlocale:2`, `nlocale:3`, `nxlocale:2,4c`, `nxlocale:3,4c`)

* __Date manipulation__ similar to `PHP` format (ie `date` function). An extended, localized version of `php`'s date function `ldate` is also implemented in the framework

* Loops can have optional `elsefor` statement when no data, or data is empty (see tests)

* Templates can `include` other templates (similar to `PHP` `include` directive), these includes wil be compiled into the the template that called them

* Templates can *call another template* using `tpl` function, these templates are called as templates subroutines and parsed by themselves

* Templates and template functions can also have **inline templates** as parameters via `inline` template function

* __Template Inheritance__ , templates can *extend/inherit other templates* using `extends` directive and *override blocks* using `block` , `endblock` directives (see examples)

* __Direct Super reference__ , templates can use the `super` template function to directly reference (and call) a super block if needed in OO manner (see examples)

* __Nested Blocks__ , *template `blocks`* can be nested and repeated in multiple ways (see examples)

* __Custom Plugins__ , can be used as template functions to enhance/extend the engine functionality (see examples)

* **custom plugins can be also inlined**, i.e their code can be **expanded at compile-time** using `Contemplate::inline` templates in their definition, e.g saving unnecessary look-ups at render-time (see examples)


### Dependencies

* Only 3 classes are used (`Contemplate.php`, `Contemplate.js`, `Contemplate.py`), no other dependencies
* `PHP` `5.2+` supported
* `Node` `0.8+` supported
* `Python` `2.x` or `3.x` supported
* all browsers
* `Contemplate` is also a `XPCOM JavaScript Component` (Firefox) (e.g to be used in firefox browser addons/plugins for templating)


### Todo

* add support for multiple `contexts` (which include separate `templates`, `cache` directories and related parameters) so that the engine can be **used in same application by different modules independantly** [DONE]
* simplify template `directives`, `functions` and `plugins` notation by eliminating the `%` prefix (compatibility mode to older versions also supported) [DONE]
* support **asynchronous template loading/parsing/rendering/writing** for `node/browser` [DONE]
* add `Contemplate` implementations for `ActionScript, Perl, Java, Scala` [TODO?]
* transform `Contemplate` (for `PHP`) into a `PHP` `C`-extension, `Contemplate` (for node) into standalone executable (eg. https://github.com/crcn/nexe) [TODO?]
* keep-up with `php`, `node`, `python`, browsers updates


### Performance

*(for `php` see `/tests/perf/perf.php`)*


**Note:** The engines included in the (following) tests, have different philosophy and in general provide different features. These are only illustrative modulo all the other features.



**Render Time**

The following tests were made on a revision of a 2013 jsperf test for `resig micro-templating`, `handlebars`, `contemplate`, `mustache`, `underscore`, `doT` and `kendoui` template engines. More tests should be done.

`Contemplate` (`0.6.5`) was 2nd place on Firefox and 3rd (or close) place on Opera, IE, while `Contemplate` was average to slower on Chrome. The reason was mostly that `Contemplate` was using a code to copy/isolate the input data every time inside the render function, which most of the time is redundant, else user can use the `Contemplate.data` method to create a shallow copy suitable to be used as render data. So this was removed, plus some minor refactoring and minor loop optimisation.

This resulted in great performance increase as shown below. (see changelog)

Previous tests are here [jsperf/0.6.5](http://jsperf.com/js-template-engines-performance/94), [jsperf/0.6.7](http://jsperf.com/js-template-engines-performance/96), [jsperf/0.7](http://jsperf.com/js-template-engines-performance/112), [jsperf/0.7.1](http://jsperf.com/js-template-engines-performance/116), [jsperf/0.8](http://jsperf.com/js-template-engines-performance/117), [jsperf/0.8.1](http://jsperf.com/js-template-engines-performance/120),
[jsperf/1.0.0](http://jsperf.com/js-template-engines-performance/161),
[jsperf/1.0.0 (1.0.0+ format)](http://jsperf.com/js-template-engines-performance/164)

`Contemplate` (`1.0.0`) is (consistently) near 1st place on all browsers.

[![contemplate rendering jsperf](/screenshots/jsperf-rendering.png)](http://jsperf.com/js-template-engines-performance/164)


**Parse / Compilation Time**

The following tests involve `swig`, `handlebars`, `contemplate` and `mustache` template engines. More tests should be done.

Previous tests are here [jsperf/0.6.7](http://jsperf.com/js-template-engines-compilation/3), [jsperf/0.7](http://jsperf.com/js-template-engines-compilation/7), [jsperf/0.7.1](http://jsperf.com/js-template-engines-compilation/8), [jsperf/0.8](http://jsperf.com/js-template-engines-compilation/11), [jsperf/0.8.1](http://jsperf.com/js-template-engines-compilation/12),
[jsperf/1.0.0](http://jsperf.com/js-template-engines-compilation/14)

`Contemplate` (`1.0.0`) is (consistently) 1st place on all browsers.

[![contemplate parse jsperf](/screenshots/jsperf-compilation.png)](http://jsperf.com/js-template-engines-compilation/14)



### Tests

Use `test.php` (for `php`), `test.js` (for `node`), `test.py` (for `python`)
under `/tests` folder, to test the basic functionality


### Screenshots

Sample Template markup
[![Template markup](/screenshots/template_markup.png)](https://github.com/foo123/Contemplate/raw/master/screenshots/template_markup.png)

Data to be used for the template
[![Template data](/screenshots/template_data.png)](https://github.com/foo123/Contemplate/raw/master/screenshots/template_data.png)

`PHP` and `JavaScript` rendering of the template on same page (see `test.php`)
[![Template output](/screenshots/template_output.png)](https://github.com/foo123/Contemplate/raw/master/screenshots/template_output.png)
