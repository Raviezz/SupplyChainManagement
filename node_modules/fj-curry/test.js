"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var test = _interopRequire(require("prova"));

var stub = require("sinon").stub;
var _ = require("./");

var curry = _.curry;
var curryN = _.curryN;
var curry1 = _.curry1;
var curry2 = _.curry2;
var curry3 = _.curry3;
var curry4 = _.curry4;



test("fj-curry#curry", function (t) {
  t.plan(5);

  var spy = stub().returns(true);
  function func(a, b, c) {
    return spy.apply(this, arguments);
  }

  t.equal(typeof curry, "function");

  t.equal(curry(func)(1, 2)(3, 4), true);
  t.ok(spy.calledWith(1, 2, 3));

  t.equal(curry(func)(1)(2, 3), true);
  t.ok(spy.calledWith(1, 2, 3));
});

test("fj-curry#curryN", function (t) {
  t.plan(7);

  var spy = stub().returns(true);

  t.equal(typeof curryN, "function");
  t.equal(curryN(1, spy)(1, 2), true);
  t.ok(spy.calledWith(1));

  t.equal(curryN(3, spy)(1, 2)(3, 4), true);
  t.ok(spy.calledWith(1, 2, 3));

  t.equal(curryN(3, spy)(1)(2, 3), true);
  t.ok(spy.calledWith(1, 2, 3));
});

test("fj-curry#curry1", function (t) {
  t.plan(3);

  var spy = stub().returns(true);

  t.equal(typeof curry1, "function");
  t.equal(curry1(spy)(1, 2), true);
  t.ok(spy.calledWith(1));
});

test("fj-curry#curry2", function (t) {
  t.plan(3);

  var spy = stub().returns(true);

  t.equal(typeof curry2, "function");
  t.equal(curry2(spy)(1)(2, 3), true);
  t.ok(spy.calledWith(1, 2));
});

test("fj-curry#curry3", function (t) {
  t.plan(3);

  var spy = stub().returns(true);

  t.equal(typeof curry3, "function");
  t.equal(curry3(spy)(1)(2)(3, 4), true);
  t.ok(spy.calledWith(1, 2, 3));
});

test("fj-curry#curry4", function (t) {
  t.plan(3);

  var spy = stub().returns(true);

  t.equal(typeof curry4, "function");
  t.equal(curry4(spy)(1)(2)(3)(4, 5), true);
  t.ok(spy.calledWith(1, 2, 3, 4));
});