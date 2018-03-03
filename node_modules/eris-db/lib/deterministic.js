// A proxy that makes Eris DB's communication appear deterministic in order to
// ease testing.

'use strict'

const generic = require('@nodeguy/generic')
const _ = generic._
const I = require('iteray')
const {is} = require('@nodeguy/type')
const R = require('ramda')

module.exports = (transport) => {
  let subIds = new Map()

  const newRequest = generic.function()

  newRequest.method(_, R.identity)

  newRequest.method(
    [{
      params: {
        sub_id: is(String)
      }
    }],
    (request) =>
      R.assocPath(
        ['params', 'sub_id'],
        subIds.get(request.params.sub_id),
        request
      )
  )

  const newResponse = generic.function()

  newResponse.method(_, R.identity)

  newResponse.method(
    [{
      result: {
        sub_id: is(String)
      }
    }],
    (response) => {
      const newId = String(subIds.size)
      subIds.set(newId, response.result.sub_id)
      return R.assocPath(['result', 'sub_id'], newId, response)
    }
  )

  // Override the nondeterministic 'tx_hash' with the deterministic JSON-RPC id.
  newResponse.method([{
    id: is(String),
    result: {
      tx_hash: is(String)
    }
  }], (response) =>
    R.assocPath(['result', 'tx_hash'], response.id, response)
  )

  return (input) =>
    I.map(newResponse, transport(I.map(newRequest, input)))
}
