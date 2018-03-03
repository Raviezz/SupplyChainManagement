"use strict";

exports.curry = curry;
exports.curryN = curryN;
var slice = Array.prototype.slice;

function _curry(n, fn, curryArgs) {
  return function () {
    var args = slice.call(arguments),
        concatArgs = curryArgs.concat(args);

    if (n > concatArgs.length) {
      return _curry(n, fn, concatArgs);
    } else {
      return fn.apply(this, slice.call(concatArgs, 0, n));
    }
  };
}

function curry(fn) {
  return _curry(fn.length, fn, []);
}

function curryN(n, fn) {
  return _curry(n, fn, []);
}

var curry1 = exports.curry1 = curryN(2, curryN)(1);
var curry2 = exports.curry2 = curryN(2, curryN)(2);
var curry3 = exports.curry3 = curryN(2, curryN)(3);
var curry4 = exports.curry4 = curryN(2, curryN)(4);
exports.__esModule = true;