/**
 * @file namereg.js
 * @fileOverview Factory module for the NameReg class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module namereg
 */

'use strict'

var util = require('./util')
var nUtil = require('util')

var COST_PER_BLOCK = 1
var COST_PER_BYTE = 1

/**
 * Create a new instance of the NameReg class.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @param {module:unsafe~Unsafe} unsafe - The unsafe object.
 * @param {module:events~Events} events - The events object.
 * @returns {NameReg} - A new instance of the NameReg class.
 */
exports.createInstance = function (server, unsafe, events) {
  return new NameReg(server, unsafe, events)
}

/**
 * NameReg is used to work with the name registry.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @param {module:unsafe~Unsafe} unsafe - The unsafe object.
 * @param {module:events~Events} events - The events object.
 * @augments module:util~ComponentBase
 * @constructor
 */
function NameReg (server, unsafe, events) {
  util.UnsafeComponentBase.call(this, server, unsafe)
  this._events = events
}

nUtil.inherits(NameReg, util.UnsafeComponentBase)

/**
 * Get a list of entries.
 *
 * @param {module:util~FieldFilter|module:util~FieldFilter[]} [filter] - Filter the search.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
NameReg.prototype.getEntries = function (filter, callback) {
  var filters, c
  if (typeof (filter) === 'function') {
    filters = []
    c = filter
  } else if (!filter && typeof (callback) === 'function') {
    filters = []
    c = callback
  } else {
    if (!(filter instanceof Array)) {
      filters = [filter]
    } else {
      filters = filter
    }
    c = callback
  }
  this.server.getNameRegEntries({filters}, c)
}

/**
 * Get a list of all entries added from the given account.
 *
 * @param {string} accountAddress - the public address of the account.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
/* TODO put this in when tests has been made.
NameReg.prototype.getEntriesByAccount = function (accountAddress, callback) {
    var f = rpc.filterParam("owner", "==", accountAddress);
    this._client.send(rpc.methodName("getNameRegEntries"), rpc.filtersParam(f), callback);
};
*/

/**
 * Get an entry from its key.
 *
 * @param {string} name - The name, or key of the entry.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
NameReg.prototype.getEntry = function (name, callback) {
  if (!name || typeof (name) !== 'string') {
    callback(new Error("'name' is not a non-empty string."))
    return
  }
  this.server.getNameRegEntry({name}, callback)
}

/**
 * Transact to the name registry. The name registry is essentially a distributed key-value store that comes
 * with the client.
 *
 * Note: This requires a private key to be sent to the blockchain client.
 *
 * @param {string} privKey - The private key that will be used to sign the transaction.
 * @param {string} name - The key, or name.
 * @param {string} data - The data that should be stored.
 * @param {number} numBlocks - The amount of blocks until the data expires.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
NameReg.prototype.setEntry = function (privKey, name, data, numBlocks, callback) {
  var
    nameRegistry, cost

  nameRegistry = this
  cost = this.calculateCost(numBlocks, data)

  this._unsafe.transactNameReg(privKey, name, data, cost, 0, null, function (error) {
    if (error) { callback(error) } else {
        // Watch the new block being formed and call back when we can get the
        // entry after setting it.
      nameRegistry._events.subNewBlocks(function (error) {
        if (error) { callback(error) } else {
          nameRegistry.getEntry(name, function (error, data) {
            if (error) { callback(error) } else { callback(null, data) }
          })
        }
      })
    }
  })
}

NameReg.prototype.calculateCost = function (numBlocks, data) {
  return COST_PER_BLOCK * COST_PER_BYTE * (data.length + 32) * numBlocks
}
