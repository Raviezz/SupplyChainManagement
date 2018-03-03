/**
 * @file erisdb.js
 * @fileOverview Factory module for the ErisDB class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module erisdb
 */

'use strict'

var accountsF = require('./accounts')
var blockChainF = require('./blockchain')
var consensusF = require('./consensus')
var eventsF = require('./events')
var nameregF = require('./namereg')
var networkF = require('./network')
var transactionsF = require('./transactions')
var unsafeF = require('./unsafe')
var validation = require('./validation')

/**
 * Create a new instance of the ErisDB class.
 *
 * @param {module:rpc/client-Client} client - The networking client object.
 * @param {module:validation~Validator} validator - The validator object.
 * @returns {ErisDB} - A new instance of the ErisDB class.
 */
exports.createInstance = function (server, validator) {
  return new ErisDB(server, validator)
}

/**
 * The main class.
 *
 * @param {module:rpc/client-Client} client - The networking client object.
 * @param {module:validation~Validator} validator - The validator object.
 * @constructor
 */
function ErisDB (server, validator) {
  if (typeof (validator) === 'undefined' || validator === null) {
    validator = new validation.SinglePolicyValidator(true)
  }
  this.server = server
  var unsafe = unsafeF.createInstance(server, validator)
  var events = eventsF.createInstance(server)

  var accounts = accountsF.createInstance(server, unsafe)
  var blockChain = blockChainF.createInstance(server)
  var consensus = consensusF.createInstance(server)
  var namereg = nameregF.createInstance(server, unsafe, events)
  var network = networkF.createInstance(server)
  var transactions = transactionsF.createInstance(server, unsafe)

  this._unsafe = unsafe
  this._accounts = accounts
  this._blockChain = blockChain
  this._consensus = consensus
  this._events = events
  this._namereg = namereg
  this._network = network
  this._transactions = transactions
}

/**
 * Get the <tt>Accounts</tt> object.
 *
 * @returns {module:accounts~Accounts}
 */
ErisDB.prototype.accounts = function () {
  return this._accounts
}

/**
 * Get the <tt>BlockChain</tt> object.
 *
 * @returns {module:blockchain~BlockChain}
 */
ErisDB.prototype.blockchain = function () {
  return this._blockChain
}

/**
 * Get the <tt>Consensus</tt> object.
 *
 * @returns {module:consensus~Consensus}
 */
ErisDB.prototype.consensus = function () {
  return this._consensus
}

/**
 * Get the <tt>Events</tt> object.
 *
 * @returns {module:events~Events}
 */
ErisDB.prototype.events = function () {
  return this._events
}

/**
 * Get the <tt>NameReg</tt> object.
 *
 * @returns {module:namereg~NameReg}
 */
ErisDB.prototype.namereg = function () {
  return this._namereg
}

/**
 * Get the <tt>Network</tt> object.
 *
 * @returns {module:network~Network}
 */
ErisDB.prototype.network = function () {
  return this._network
}

/**
 * Get the <tt>Transactions</tt> object.
 *
 * @returns {module:transactions~Transactions}
 */
ErisDB.prototype.txs = function () {
  return this._transactions
}

/**
 * Set a new validator object.
 *
 * @param {module:validation~Validator} validator - The validator object.
 */
ErisDB.prototype.setValidator = function (validator) {
  return this._unsafe.setValidator(validator)
}
