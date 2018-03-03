/**
 * @file index.js
 * @fileOverview Index file for the eris-db javascript API. This file contains a factory method
 * for creating a new <tt>ErisDB</tt> instance.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module index
 */
'use strict'

var erisdb = require('./lib/erisdb')
const generic = require('@nodeguy/generic')
const I = require('iteray')
const is = require('@nodeguy/type').is
const jsonRpc = require('@nodeguy/json-rpc')
const R = require('ramda')
const server = require('./lib/server')
const util = require('util')
var validation = require('./lib/validation')
var url = require('url')

const createInstance = generic.function()

const inspect = (object) =>
  util.inspect(object, {depth: null, colors: true})

const debuglog = R.compose(util.debuglog('eris'), inspect)

createInstance.method([is(Function)],
  (transport) => {
    const logged = R.pipe(
      I.forEach(debuglog),
      transport,
      I.forEach(debuglog)
    )

    var validator = new validation.SinglePolicyValidator(true)
    return erisdb.createInstance(server(logged), validator)
  }
)

/**
 * ErisDB allows you to do remote calls to a running erisdb-tendermint client.
 *
 * @param {string} URL The RPC endpoint URL.
 * @returns {module:erisdb-ErisDB}
 */
createInstance.method([is(String)],
  (urlString) => {
    const parsed = url.parse(urlString)

    if (parsed.protocol === 'ws:') {
      throw new Error('WebSocket is disabled until Eris DB complies with ' +
        'JSON-RPC.  See: https://github.com/eris-ltd/eris-db/issues/355')
    } else {
      return createInstance(jsonRpc.transport(parsed))
    }
  }
)

module.exports = {
  createInstance
}
