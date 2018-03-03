import test from 'prova';
import { stub } from 'sinon';
import { curry, curryN, curry1, curry2, curry3, curry4 } from './';


test('fj-curry#curry', (t) => {
  t.plan(5);

  let spy = stub().returns(true);
  function func(a, b, c) {
    return spy.apply(this, arguments);
  }
 
  t.equal(typeof curry, 'function');
  
  t.equal(curry(func)(1, 2)(3, 4), true);
  t.ok(spy.calledWith(1, 2, 3));

  t.equal(curry(func)(1)(2, 3), true);
  t.ok(spy.calledWith(1, 2, 3));
});

test('fj-curry#curryN', (t) => {
  t.plan(7);

  let spy = stub().returns(true);
 
  t.equal(typeof curryN, 'function');
  t.equal(curryN(1, spy)(1, 2), true);
  t.ok(spy.calledWith(1));
  
  t.equal(curryN(3, spy)(1, 2)(3, 4), true);
  t.ok(spy.calledWith(1, 2, 3));

  t.equal(curryN(3, spy)(1)(2, 3), true);
  t.ok(spy.calledWith(1, 2, 3));
});

test('fj-curry#curry1', (t) => {
  t.plan(3);

  let spy = stub().returns(true);
 
  t.equal(typeof curry1, 'function');
  t.equal(curry1(spy)(1, 2), true);
  t.ok(spy.calledWith(1));
});

test('fj-curry#curry2', (t) => {
  t.plan(3);

  let spy = stub().returns(true);
 
  t.equal(typeof curry2, 'function');
  t.equal(curry2(spy)(1)(2, 3), true);
  t.ok(spy.calledWith(1, 2));
});

test('fj-curry#curry3', (t) => {
  t.plan(3);

  let spy = stub().returns(true);
 
  t.equal(typeof curry3, 'function');
  t.equal(curry3(spy)(1)(2)(3, 4), true);
  t.ok(spy.calledWith(1, 2, 3));
});

test('fj-curry#curry4', (t) => {
  t.plan(3);

  let spy = stub().returns(true);
 
  t.equal(typeof curry4, 'function');
  t.equal(curry4(spy)(1)(2)(3)(4, 5), true);
  t.ok(spy.calledWith(1, 2, 3, 4));
});
