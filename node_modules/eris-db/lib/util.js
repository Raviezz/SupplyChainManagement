/**
 * @file util.js
 * @fileOverview Utility functions and classes for the thelonious library.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module util
 */
'use strict'
var nUtil = require('util')

/**
 * ComponentBase is used for all Thelonious API components.
 *
 * @param {module:rpc/client~Client} client - A client object.
 * @constructor
 */
function ComponentBase (server) {
  this.server = server
}

/**
 * UnsafeComponentBase is used for all Thelonious API components that makes use
 * of the unsafe class.
 *
 * @param {module:rpc/client~Client} client - A client object.
 * @param {module:unsafe~Unsafe} unsafe - The unsafe object.
 * @constructor
 */
function UnsafeComponentBase (server, unsafe) {
  ComponentBase.call(this, server)
  this._unsafe = unsafe
}

nUtil.inherits(UnsafeComponentBase, ComponentBase)

exports.createFilter = function (field, op, value) {
  if (typeof (value) !== 'string') {
    console.error('Filter value is not a string')
    return null
  }
  return {field: field, op: op, value: value}
}

var hexRe = /^[0-9a-fA-F]*$/
var addrRe = /^[0-9a-fA-F]{40}$/
var pubRe = /^[0-9a-fA-F]{64}$/
var privRe = /^[0-9a-fA-F]{128}$/

/**
 * Check if string is proper hex.
 *
 * @param {string} str - The string.
 * @returns {boolean}
 */
function isHex (str) {
  return typeof (str) === 'string' && str.match(hexRe)
}

/**
 * Check if string is proper hex of length 40 (20 bytes).
 *
 * @param {string} str - The string.
 * @returns {boolean}
 */
function isAddress (str) {
  return typeof (str) === 'string' && str.match(addrRe)
}

/**
 * Check if string is proper hex of length 64 (32 bytes).
 *
 * @param {string} str - The string.
 * @returns {boolean}
 */
function isPubKey (str) {
  return typeof (str) === 'string' && str.match(pubRe)
}

/**
 * Check if string is proper hex of length 128 (64 bytes).
 *
 * @param {string} str - The string.
 * @returns {boolean}
 */
function isPrivKey (str) {
  return typeof (str) === 'string' && str.match(privRe)
}

/**
 * Constructor for the ComponentBase class.
 *
 * @type {function}
 */
exports.ComponentBase = ComponentBase

/**
 * Constructor for the UnsafeComponentBase class.
 *
 * @type {function}
 */
exports.UnsafeComponentBase = UnsafeComponentBase

/**
 * @type {isHex}
 */
exports.isHex = isHex
/**
 * @type {isAddress}
 */
exports.isAddress = isAddress
/**
 * @type {isPubKey}
 */
exports.isPubKey = isPubKey
/**
 * @type {isPrivKey}
 */
exports.isPrivKey = isPrivKey

/**
 * A field filter.
 *
 * @typedef {Object} FieldFilter
 * @property {string} field - The field to filter on.
 * @property {string} op - The operator ( <, >, <=, >=, ==, !=)
 * @property {*} value - The value to filter against.
 */
