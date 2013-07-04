Contemplate
===========

Simple, light-weight and fast templating engine for both PHP and Javascript

This is a proof-of-concept right now, yet fully working and extensible.
The inspiration came from an old post by John Resig (http://ejohn.org/blog/javascript-micro-templating/)

##Notes:
After creating the repository i became aware of a web framework with similar name here: http://www.arlomedia.com/software/contemplate/assembled/introduction.html

*This repository and project are completely unrelated to that framework.*


#Rationale:

There are many templating engines out there, which are very elegant, fast, multipurpose (eg. mustache, twig, handlebars, jade, doT, and so on..)

Most of the sophistictated engines use a custom parser to build the engine. 

This is highly versatile:

1. but can have performance issues sometimes 
2. and / or requires to learn a (completely) new syntax for building a template.

These drawbacks can be compensated if one uses PHP itself as templating engine. PHP already IS a templating language and a very fast at it.

This can create very simple, intuitive and fast templates.

The drawbacks of this approach are:

1. It works only with PHP, and many times the same template needs to be used also by Javascript

2. It can be cumbersome to combine or iterate over templates and parts.

*Contemplate* seeks to find the best balance between these requirements.

The solution is inspired by John Resig's post ([see above](http://ejohn.org/blog/javascript-micro-templating/)) and the fact that PHP and Javascript share a common language subset.

*Contemplate* does a minimum parsing (and caching) in order to create dynamic templates (which can be used in both PHP and Javascript)
and trying to contain the needed functionality inside the common language subset.

Most of the time this can be accomplished, the rest functionality is built with custom functions which mostly resemble the PHP
syntax, yet wotk the same in Javascript.

There was an effort to keep the engine syntax as close to PHP syntax as possible
(so as to avoid the necessity to learn another language syntax)

Right now the templates are only cached dynamically for the duration of the page request,
however it is easy to add caching to the file system for a compiled template.

##Dependencies

* PHP version supported is 5.2+ and all major browsers.
* Only 2 classes are used (tpl.php, tpl.js), not other dependencies

##Tests

Use the test.php file to test the basic functionality


#Screenshots

Sample Template markup
![Template markup](/screenshots/template_markup.png)

Data to be used for the template
![Template data](/screenshots/template_data.png)

PHP and Javascript rendering of the template on same page (see test.php)
![Template output](/screenshots/template_output.png)


