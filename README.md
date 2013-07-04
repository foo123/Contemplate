Contemplate
===========

Simple, light-weight and fast templating engine for both PHP and javascript

This is a proof-of-concept right now, yet fully working and extensible.
The inspiration came from an old post by John Resig (http://ejohn.org/blog/javascript-micro-templating/)

#Rationale:

There are many templating engines out there, which are very elegant, fast, multipurpose (eg. mustache, twig, handlebars, jade, doT, and so on..)

Most of the sophistictated engines use a custom parser to build the engine. 

This is highly versatile but has performance issues sometimes and / or requires to learn a new language for building a template.
These drawbacks can be compensated if one uses PHP itself as templating engine. PHP already IS a tempalting language and very fast at it.

This can create very simple, intuitive and fast templates.

The drawbacks of this approach, are:

1. It works only with PHP, and many times the same template needs to be used by Javascript also

2. It can be cumbersome to combine or iterate over templates and parts.

Contemplate seeks to find the best balance between these requirements.

The solution is inspired by John Resig's post (see above) and the fact that PHP and Javascript share a common
language subset.

So Contemplate uses a minimum parsing (and caching) to create dynamic templates (which can be used for both PHP and Javascript)
by trying to maintain the needed functionality inside the common language subset.

Most of the time this can be accomplished, the rest functionality is built with custom functions which resemble mostly the PHP
syntax, yet wotk the same in Javascript.

There was an effort to keep the engine syntax as close to PHP as possible
(so as to avpid the necessity to learn another language syntax)

Right now the templates are only cached dynamically for the duration of the page request,
however it is easy to add caching to the file system for a compiled template.

#Dependencies

* PHP version supported is 5.2+ and all major browsers.
* Only 2 classes are used (tpl.php, tpl.js), not other dependencies

#Tests

Use the test.php file to test the basic functionality


#Screenshots

[![Template markup](/screenshots/template_markup.png)]

[![Template data](/screenshots/template_data.png)]

[![Template output](/screenshots/template_output.png)]


