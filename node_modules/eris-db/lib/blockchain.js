/**
 * @file blockchain.js
 * @fileOverview Factory module for the BlockChain class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module blockchain
 */
'use strict'

var util = require('./util')
var nUtil = require('util')
/**
 * Create a new instance of the BlockChain class.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @returns {BlockChain} - A new instance of the Blockchain class.
 */
exports.createInstance = function (server) {
  return new BlockChain(server)
}

/**
 * BlockChain has methods for querying the blockchain, getting individual blocks etc.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @augments module:util~ComponentBase
 * @constructor
 */
function BlockChain (server) {
  util.ComponentBase.call(this, server)
}

nUtil.inherits(BlockChain, util.ComponentBase)

/**
 * Get blockchain info.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
BlockChain.prototype.getInfo = function (callback) {
  this.server.getBlockchainInfo(callback)
}

/**
 * Get the chain id.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
BlockChain.prototype.getChainId = function (callback) {
  this.server.getChainId(callback)
}

/**
 * Get the genesis hash.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
BlockChain.prototype.getGenesisHash = function (callback) {
  this.server.getGenesisHash(callback)
}

/**
 * Get the latest block height.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
BlockChain.prototype.getLatestBlockHeight = function (callback) {
  this.server.getLatestBlockHeight(callback)
}

/**
 * Get the latest block.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
BlockChain.prototype.getLatestBlock = function (callback) {
  this.server.getLatestBlock(callback)
}

/**
 * Get the blocks from 'minHeight' to 'maxHeight'.
 *
 * TODO out of bounds checks?
 *
 * @param {module:util~FieldFilter|module:util~FieldFilter[]} [filter] - Filter the search.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
BlockChain.prototype.getBlocks = function (filter, callback) {
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
  this.server.getBlocks({filters}, c)
}

/**
 * Get the block with the given block-number, or 'height'.
 *
 * @param {number} height - The block height.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
BlockChain.prototype.getBlock = function (height, callback) {
  this.server.getBlock({height}, callback)
}
