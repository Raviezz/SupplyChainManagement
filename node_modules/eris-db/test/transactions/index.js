'use strict'

const assert = require('assert')
const Promise = require('bluebird')
const vector = require('../../lib/test').Vector()

before(vector.before(__dirname, {protocol: 'http:'}))
after(vector.after())

it('sends ether from one account to another',
  vector.it(function ({db, validator: {priv_key: [, privateKey]}}) {
    const destination = '0000000000000000000000000000000000000010'
    const amount = 42

    return Promise.fromCallback((callback) =>
      db.txs().sendAndHold(privateKey, destination, amount, null, callback)
    ).then(() => {
      return Promise.fromCallback((callback) =>
        db.accounts().getAccount(destination, callback)
      ).then((response) => {
        assert.equal(response.balance, 42)
      })
    })
  })
)
