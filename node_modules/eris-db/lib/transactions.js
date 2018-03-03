/**
 * @file transactions.js
 * @fileOverview Factory module for the Transactions class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module transactions
 */
'use strict'

var util = require('./util')
var nUtil = require('util')

/**
 * Create a new instance of the Transactions class.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @param {module:unsafe~Unsafe} unsafe - The unsafe object.
 * @returns {Transactions} - A new instance of the Transactions class.
 */
exports.createInstance = function (server, unsafe) {
  return new Transactions(server, unsafe)
}

/**
 * Transactions has methods for sending transactions, viewing currently pending ones etc.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @param {module:unsafe~Unsafe} unsafe - The unsafe object.
 * @augments module:util~ComponentBase
 * @constructor
 */
function Transactions (server, unsafe) {
  util.UnsafeComponentBase.call(this, server, unsafe)
}

nUtil.inherits(Transactions, util.UnsafeComponentBase)

/**
 * Get a list of all unconfirmed transactions.
 *
 * @param {methodCallback} callback - The callback function.
 */
Transactions.prototype.getUnconfirmedTxs = function (callback) {
  this.server.getUnconfirmedTxs(callback)
}

/**
 * Broadcasting a Transaction will send it to the blockchain client. The transaction needs
 * to be signed in order for this to work.
 *
 * @param {Object} tx - The transaction.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Transactions.prototype.broadcastTx = function (tx, callback) {
  this.server.broadcastTx(tx, callback)
}

/**
 * Call the account at the given address. If there is no code in the account, this will do nothing.
 * Call does not cost anything, and can not affect the state of the database. It is only used to
 * <tt>get</tt> data.
 *
 * @param {string} [fromAddress] - The address from which the call was made. The address is settable because this is a read-only operation.
 * @param {string} toAddress - The address to the target (contract) account.
 * @param {string} data - The input data.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Transactions.prototype.call = function (fromAddress, toAddress, data, callback) {
  var from, to, dta, cb
  if (typeof (data) === 'function') {
    from = ''
    to = fromAddress
    dta = toAddress
    cb = data
  } else {
    from = fromAddress
    to = toAddress
    dta = data
    cb = callback
  }

  if (!util.isAddress(to)) {
    callback(new Error("'toAddress' is not a proper address string."))
  }
  if (!util.isHex(dta)) {
    callback(new Error("'data' is not a proper hex string."))
  }
  this.server.call({from, address: to, data: dta}, cb)
}

/**
 * Call the code with the given data as input. This function runs the code in a VM
 * with the given input.
 *
 * @param {string} [fromAddress] - The address from which the call was made. The address is settable because this is a read-only operation.
 * @param {string} code - The code to be executed.
 * @param {string} data - The input data.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Transactions.prototype.callCode = function (fromAddress, code, data, callback) {
  var from, cd, dta, cb
  if (typeof (data) === 'function') {
    from = ''
    cd = fromAddress
    dta = code
    cb = data
  } else {
    from = fromAddress
    cd = code
    dta = data
    cb = callback
  }
  if (!util.isHex(cd)) {
    callback(new Error("'code' is not a proper hex string."))
  }
  if (!util.isHex(dta)) {
    callback(new Error("'data' is not a proper hex string."))
  }
  this.server.callCode({from, code: cd, data: dta}, cb)
}

/**
 * Send to the account at the given address.
 *
 * Note: This requires a private key to be sent to the blockchain client.
 *
 * @param {string} privKey - The private key that will be used to sign.
 * @param {string} toAddress - The target account address.
 * @param {number} amount - The amount to send.
 * @param {*} context - an object containing information for the validator.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Transactions.prototype.send = function (privKey, toAddress, amount, context,
  callback) {
  this._unsafe.send(privKey, toAddress, amount, context, callback)
}

/**
 * Transact to the account at the given address, and hold until the transaction has
 * been committed to a block (or not).
 *
 * @param {string} privKey - The private key that will be used to sign.
 * @param {string} toAddress - The target account address.
 * @param {number} amount - The amount to send.
 * @param {*} context - an object containing information for the validator.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Transactions.prototype.sendAndHold = function (privKey, toAddress, amount,
  context, callback) {
  this._unsafe.sendAndHold(privKey, toAddress, amount, context, callback)
}

/**
 * Transact to the account at the given address.
 *
 * Note: This requires a private key to be sent to the blockchain client.
 *
 * @param {string} privKey - The private key that will be used to sign.
 * @param {string} address - The address to the account holding the code. Set it to null if
 * doing a tx create.
 * @param {string} data - The input data.
 * @param {number} gasLimit - The gas limit.
 * @param {number} fee - The fee.
 * @param {*} context - an object containing information for the validator.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Transactions.prototype.transact = function (privKey, address, data, gasLimit, fee, context, callback) {
  this._unsafe.transact(privKey, address, data, gasLimit, fee, context, function (error, data) {
    if (error) return callback(error)
    callback(null, data)
  })
}

/**
 * Transact to the account at the given address, and hold until the transaction has
 * been committed to a block (or not).
 *
 * Note: This requires a private key to be sent to the blockchain client.
 *
 * @param {string} privKey - The private key that will be used to sign.
 * @param {string} address - The address to the account holding the code. Set it to null if
 * doing a tx create.
 * @param {string} data - The input data.
 * @param {number} gasLimit - The gas limit.
 * @param {number} fee - The fee.
 * @param {*} context - an object containing information for the validator.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Transactions.prototype.transactAndHold = function (privKey, address, data, gasLimit, fee, context, callback) {
  this._unsafe.transactAndHold(privKey, address, data, gasLimit, fee, context, function (error, data) {
    if (error) return callback(error)
    callback(null, data)
  })
}

/**
 * Transact to the name registry. The name registry is essentially a distributed key-value store that comes
 * with the client. Accessing the registry is done via the NameReg.
 *
 * Note: This requires a private key to be sent to the blockchain client.
 *
 * @param {string} privKey - The private key that will be used to sign.
 * @param {string} name - The key, or name.
 * @param {string} data - The data that should be stored.
 * @param {number} amount - The amount of tokens to send.
 * @param {number} fee - The fee.
 * @param {*} context - an object containing information for the validator.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Transactions.prototype.transactNameReg = function (privKey, name, data, amount, fee, context, callback) {
  this._unsafe.transactNameReg(privKey, name, data, amount, fee, context, callback)
}
