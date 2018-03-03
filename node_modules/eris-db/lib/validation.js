/**
 * @file validation.js
 * @fileOverview Factory module for validators.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module validation
 */

'use strict'

var nUtil = require('util')

/**
 * Used to allow or disallow calls that send or receive private keys.
 * @constructor
 */
function CallValidator () {
}

/**
 * Validate a call.
 *
 * @param {*} [context] - Wildcard for implementation-specific input.
 * @returns {boolean}
 */
CallValidator.prototype.validate = function (context) {
  return false
}

/**
 * Validator that allows or disallows based on the provided value.
 *
 * @param {boolean} policy - Do we allow private keys to be passed over the channel or not?
 * @augments CallValidator
 * @constructor
 */
function SinglePolicyValidator (policy) {
  CallValidator.call(this)
  this._policy = policy
}

nUtil.inherits(SinglePolicyValidator, CallValidator)

/**
 * Validate a function call based on the policy.
 *
 */
SinglePolicyValidator.prototype.validate = function (context) {
  return this._policy
}

/**
 *
 * @type {CallValidator}
 */
exports.CallValidator = CallValidator

/**
 *
 * @type {SinglePolicyValidator}
 */
exports.SinglePolicyValidator = SinglePolicyValidator
