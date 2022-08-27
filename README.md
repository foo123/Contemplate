Contemplate
===========

**Light-weight, fast and flexible "object-oriented" template engine for PHP, Python and JavaScript (Node.js, Browser and XPCOM)**


![Contemplate](/screenshots/contemplate.jpg)


**see also:**

* [ModelView](https://github.com/foo123/modelview.js) a simple, fast, powerful and flexible MVVM framework for JavaScript
* [tico](https://github.com/foo123/tico) a tiny, super-simple MVC framework for PHP
* [LoginManager](https://github.com/foo123/LoginManager) a simple, barebones agnostic login manager for PHP, JavaScript, Python
* [SimpleCaptcha](https://github.com/foo123/simple-captcha) a simple, image-based, mathematical captcha with increasing levels of difficulty for PHP, JavaScript, Python
* [Dromeo](https://github.com/foo123/Dromeo) a flexible, and powerful agnostic router for PHP, JavaScript, Python
* [PublishSubscribe](https://github.com/foo123/PublishSubscribe) a simple and flexible publish-subscribe pattern implementation for PHP, JavaScript, Python
* [Importer](https://github.com/foo123/Importer) simple class &amp; dependency manager and loader for PHP, JavaScript, Python
* [Contemplate](https://github.com/foo123/Contemplate) a fast and versatile isomorphic template engine for PHP, JavaScript, Python
* [HtmlWidget](https://github.com/foo123/HtmlWidget) html widgets, made as simple as possible, both client and server, both desktop and mobile, can be used as (template) plugins and/or standalone for PHP, JavaScript, Python (can be used as [plugins for Contemplate](https://github.com/foo123/Contemplate/blob/master/src/js/plugins/plugins.txt))
* [Paginator](https://github.com/foo123/Paginator)  simple and flexible pagination controls generator for PHP, JavaScript, Python
* [Formal](https://github.com/foo123/Formal) a simple and versatile (Form) Data validation framework based on Rules for PHP, JavaScript, Python
* [Dialect](https://github.com/foo123/Dialect) a cross-vendor &amp; cross-platform SQL Query Builder, based on [GrammarTemplate](https://github.com/foo123/GrammarTemplate), for PHP, JavaScript, Python
* [DialectORM](https://github.com/foo123/DialectORM) an Object-Relational-Mapper (ORM) and Object-Document-Mapper (ODM), based on [Dialect](https://github.com/foo123/Dialect), for PHP, JavaScript, Python
* [Unicache](https://github.com/foo123/Unicache) a simple and flexible agnostic caching framework, supporting various platforms, for PHP, JavaScript, Python
* [Xpresion](https://github.com/foo123/Xpresion) a simple and flexible eXpression parser engine (with custom functions and variables support), based on [GrammarTemplate](https://github.com/foo123/GrammarTemplate), for PHP, JavaScript, Python
* [Regex Analyzer/Composer](https://github.com/foo123/RegexAnalyzer) Regular Expression Analyzer and Composer for PHP, JavaScript, Python


This started as a a **proof-of-concept** but developed into a **full-blown and versatile** template engine for multiple platforms.

The original inspiration came from an old post by [John Resig](https://github.com/jeresig)  (http://ejohn.org/blog/javascript-micro-templating/)


[![Contemplate](/screenshots/contemplate-interactive.png)](https://foo123.github.io/examples/contemplate/)


### Contents

* [Online Playground Example](https://foo123.github.io/examples/contemplate/)
* [Features](#features)
* [API Reference](/manual.md)
* [Dependencies](#dependencies)
* [Changelog](/changelog.md)
* [Todo](#todo)
* [Performance](#performance)


### Features:

* **Uniform functionality**, Engine Implementations for **PHP** , **Python** , **JavaScript** (**NOTE** `javascript` engine supports **both sync and async operations both callback-based and promise-based**)

* Simple and **light-weight** (only one relatively small class for each implementation, no other dependencies) `~50kB` minified, `~16kB` zipped

* **Fast**, can cache templates dynamically (filesystem caching has 3 modes, `NONE` which uses only in-memory caching, `NOUPDATE` which caches the templates only once and `AUTOUPDATE` which re-creates the cached template if original template has changed, useful for debugging)

* Generated cached template code is **formatted and annotated** with comments, for easy debugging (note: `javascript` cached templates are **`UMD` modules** which can be used in both `node.js`/`AMD`/`XPCOM`/`browser`/`es6 module fallback`)

* Syntax **close to `PHP`** (there was an effort to keep the engine syntax as close to `PHP` syntax as possible, to avoid learning another language syntax)

* Easily **extensible** , **configurable**

* **Object-oriented**, templates implement **inheritance** and **polymorphism** in a full *object-oriented* manner (see below)

* Supports multiple **dynamic contexts** , and **contextual settings** so that different modules of an application can use the engine independantly (see examples and manual)

* **Date manipulation** similar to `PHP` format (ie `date` function).

* Loops can have optional `elsefor` statement when no data, or data is empty (see tests)

* Templates can `include` other templates (similar to `PHP` `include` directive), these includes wil be compiled into the the template that called them

* Templates can *call another template* using `tpl` function, these templates are called as templates subroutines and parsed by themselves

* Templates and template functions can also have **inline templates** as parameters via `inline` template function

* **Template Inheritance** , templates can *extend/inherit other templates* using `extends` directive and *override blocks* using `block` , `endblock` directives (see examples)

* **Direct Super reference** , templates can use the `super` template function to directly reference (and call) a super block if needed in OO manner (see examples)

* **Nested Blocks** , *template `blocks`* can be nested and repeated in multiple ways (see examples)

* **Custom Plugins** , can be used as template functions to enhance/extend the engine functionality (see examples)

* **Support for literal PHP/JS/PY code**. Literal php or javascript or python code can be included as is (properly indented) and will be merged into the compiled output (see examples)


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
* support including literal php/js/python code (properly indented) directly in the template [DONE]


### Performance

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
