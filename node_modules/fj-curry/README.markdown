# fj-curry

[![Build Status](https://travis-ci.org/fp-js/fj-curry.svg)](https://travis-ci.org/fp-js/fj-curry) [![npm version](https://badge.fury.io/js/fj-curry.svg)](http://badge.fury.io/js/fj-curry)
> Curry a function

## Installation

`npm install fj-curry --save`

## Usage

```js
var curry = require('fj-curry').curry;
function add(a, b, c) { return a+b+c; }

curry(add)(2)(3)(4); // => 9
curry(add)(2, 3)(4); // => 9
curry(add)(2, 3, 4); // => 9
curry(add)(2)(3, 4); // => 9

var curryN = require('fj-curry').curryN;
function add(a, b, c) { return a+b+c; }

curryN(3, add)(2)(3)(4); // => 9
curryN(3, add)(2, 3)(4); // => 9
curryN(3, add)(2, 3, 4); // => 9
curryN(3, add)(2)(3, 4); // => 9

var curry1 = require('fj-curry').curry1;

parseInt('2', 2); // => NaN
curry1(parseInt)('2', 2); // => 2

var curry2 = require('fj-curry').curry2;
function add(a, b) { return a+b; }
curry2(add)(2)(3); // => 5

var curry3 = require('fj-curry').curry3;
function add(a, b, c) { return a+b+c; }
curry3(add)(2)(3)(4); // => 9

var curry4 = require('fj-curry').curry4;
function add(a, b, c, d) { return a+b+c+d; }
curry4(add)(2)(3)(4)(5); // => 14
```
