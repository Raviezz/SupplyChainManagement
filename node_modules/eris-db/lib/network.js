/**
 * @file network.js
 * @fileOverview Factory module for the Network class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module network
 */
'use strict'

var util = require('./util')
var nUtil = require('util')

/**
 * Create a new instance of the Network class.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @returns {Network} - A new instance of the Network class.
 */
exports.createInstance = function (server) {
  return new Network(server)
}

/**
 * Network has methods that deals with the peer-to-peer network.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @augments module:util~ComponentBase
 * @constructor
 */
function Network (server) {
  util.ComponentBase.call(this, server)
}

nUtil.inherits(Network, util.ComponentBase)

/**
 * Get the network info.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Network.prototype.getInfo = function (callback) {
  this.server.getNetworkInfo(callback)
}

/**
 * Get the client version
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Network.prototype.getClientVersion = function (callback) {
  this.server.getClientVersion(callback)
}

/**
 * Get the moniker
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Network.prototype.getMoniker = function (callback) {
  this.server.getMoniker(callback)
}

/**
 * Check if the node is listening for new peers.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Network.prototype.isListening = function (callback) {
  this.server.isListening(callback)
}

/**
 * Get the list of network listeners.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Network.prototype.getListeners = function (callback) {
  this.server.getListeners(callback)
}

/**
 * Get a list of all connected peers.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Network.prototype.getPeers = function (callback) {
  this.server.getPeers(callback)
}

/**
 * Get a single peer based on their address.
 * @param {string} address - The IP address of the peer. // TODO
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Network.prototype.getPeer = function (address, callback) {
  this.server.getPeer({address}, callback)
}
