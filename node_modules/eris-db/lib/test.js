'use strict'

const childProcess = require('mz/child_process')
const deterministic = require('./deterministic')
const ErisDb = require('..')
const fs = require('mz/fs')
const G = require('g-functions')
const httpRequest = require('request-promise')
const I = require('iteray')
const jsonRpc = require('@nodeguy/json-rpc')
const os = require('os')
const path = require('path')
const Promise = require('bluebird')
const R = require('ramda')
const testVector = require('test-vector')
const url = require('url')
const WebSocket = require('ws')

const exec = R.composeP(G.trim, R.head, childProcess.exec)

const intervalAsyncIterable = (delay) => {
  let lastOutput = Date.now()

  return I.AsyncQueue((push) =>
    setTimeout(() => {
      lastOutput = Date.now()

      push(Promise.resolve({
        done: false,
        value: lastOutput
      }))
    }, delay - (Date.now() - lastOutput))
  )
}

const poll = R.curry((action, interval) => {
  const asyncIterator = I.to('Iterator', R.pipe(
    I.map(() => Promise.try(action)),
    I.pull
  )(interval))

  const next = () =>
    asyncIterator.next().catch(next)

  return next().then(R.prop('value'))
})

const dockerMachineIp = () =>
  exec('docker-machine ip $(docker-machine active)').catch(() => 'localhost')

const blockchainUrl = (protocol, name) => {
  const portPromise = exec(`
    id=$(eris chains inspect ${name} Id)
    docker inspect --format='{{(index (index .NetworkSettings.Ports "1337` +
      `/tcp") 0).HostPort}}' $id
  `)

  return Promise.all([dockerMachineIp(), portPromise])
    .spread((hostname, port) => url.format({
      protocol,
      slashes: true,
      hostname,
      port,
      pathname: protocol === 'ws:' ? '/socketrpc' : '/rpc'
    })
  )
}

const webSocketIsAvailable = (url) =>
  poll(() =>
    new Promise((resolve, reject) => {
      const socket = new WebSocket(url)

      socket.once('open', () => {
        socket.close()
        resolve()
      })

      socket.once('error', reject)
    }),
    intervalAsyncIterable(100)
  ).then(() => url)

const httpIsAvailable = (url) =>
  poll(() => httpRequest(url).catch((reason) => {
    if (reason.name === 'RequestError') {
      throw reason
    }
  }), intervalAsyncIterable(100)
  ).then(R.always(url))

const blockchainName = (dirname) =>
  `test-${path.basename(dirname).replace(/[^a-zA-Z0-9_.-]/, '_')}`

const startBlockchain = (name, {protocol = 'ws:', initDir} = {}) =>
  exec(`eris chains make ${name}`).then(() => {
    if (initDir) {
      G.forEach((file, contents) => {
        fs.writeFileSync(path.join(
          os.homedir(),
          `.eris/chains/${name}/${file}`
        ), JSON.stringify(contents, null, 2))
      }, initDir)
    }

    return exec(`eris chains start \
      --init-dir ~/.eris/chains/${name} \
      --publish ${name}
    `, {env: R.assoc('ERIS_PULL_APPROVE', true, process.env)})
      .then(() => blockchainUrl(protocol, name))
      .then((url) => {
        console.log(`Started blockchain ${name} at ${url}.`)
        return url
      })
      .then(protocol === 'ws:' ? webSocketIsAvailable : httpIsAvailable)
  })

const rmBlockchain = (name) =>
  exec(`eris chains rm --data --dir --force ${name}`)
    .then(() => {
      console.log(`Removed blockchain ${name}.`)
    })

// Base 'class' for different Vector behaviors below.
const Vector = () => ({
  after: () =>
    function () {
    }
})

// Run the tests while recording the conversation with the server.
const VectorRecord = () => {
  let db
  let dirname
  let transport
  let vector
  const vectors = {it: {}}

  const run = (callback, thisArg, save) =>
    Promise.try(callback.bind(
      thisArg,
      {db, validator: vectors.initDir['priv_validator.json']}
    )).finally(() => {
      vector.push(Promise.resolve({done: true}))
      return I.to(Array, vector).then(save)
    })

  return Object.assign(Vector(), {
    before: (newDirname, options, callback) =>
      function () {
        this.timeout(60 * 1000)
        dirname = newDirname

        return startBlockchain(blockchainName(dirname), options)
          .then((urlString) => {
            const initDirPath = path.join(
              os.homedir(),
              `.eris/chains/${blockchainName(dirname)}`
            )

            const jsonFiles = fs.readdirSync(initDirPath)
              .filter((file) => path.extname(file) === '.json')

            vectors.initDir = Object.assign({}, ...jsonFiles.map((file) =>
              ({[file]: require(path.join(initDirPath, file))}))
            )

            transport = deterministic(jsonRpc.transport(url.parse(urlString)))
            const {memoized, vector: newVector} = testVector.memoize(transport)
            vector = newVector
            db = ErisDb.createInstance(memoized)

            if (callback) {
              const save = (vectorArray) => {
                vectors.before = vectorArray
              }

              return run(callback, this, save)
            }
          })
      },

    after: () =>
      function () {
        return Promise.all([
          fs.writeFile(
            path.join(dirname, 'vector.json'),
            JSON.stringify(vectors, null, 2)
          ),

          rmBlockchain(blockchainName(dirname))
        ])
      },

    it: (callback) =>
      function () {
        const save = (vectorArray) => {
          vectors.it[this.test.title] = vectorArray
        }

        return run(callback, this, save)
      }
  })
}

// Run the tests against the previously recorded server converstion.
const VectorPlay = () => {
  let db
  let mockStatus
  const vector = I.AsyncQueue()
  let vectors

  const run = (recording, callback, thisArg) =>
    new Promise((resolve, reject) => {
      mockStatus.catch(reject)

      recording.forEach((value) => {
        vector.push(Promise.resolve({done: false, value}))
      })

      return Promise.try(() =>
        callback.call(
          thisArg,
          {db, validator: vectors.initDir['priv_validator.json']}
        )
      ).then(resolve, reject)
    })

  return Object.assign(Vector(), {
    before: (dirname, options, callback) =>
      function () {
        vectors = require(path.join(dirname, 'vector.json'))
        const {mock, status} = testVector.mockFunction(vector)
        mockStatus = status
        db = ErisDb.createInstance(mock)

        if (callback) {
          return run(vectors.before, callback, this)
        }
      },

    it: (callback) =>
      function () {
        return run(vectors.it[this.test.title], callback, this)
      }
  })
}

// Test the server against the previously recorded client conversation.
const VectorServer = () => {
  let dirname
  let transport
  let vectors

  const run = (vector) =>
    testVector.mockCaller(
      I.to('AsyncIterable', vector.concat(
        {input: {done: true}},
        {output: {done: true}}
      )),
      transport
    )

  return Object.assign(Vector(), {
    before: (newDirname, options) =>
      function () {
        this.timeout(60 * 1000)
        dirname = newDirname
        vectors = require(path.join(dirname, 'vector.json'))

        return startBlockchain(
          blockchainName(dirname),
          Object.assign({}, options, {initDir: vectors.initDir})
        ).then((urlString) => {
          transport = deterministic(jsonRpc.transport(url.parse(urlString)))

          if (vectors.before) {
            return run(vectors.before)
          }
        })
      },

    after: () =>
      function () {
        return rmBlockchain(blockchainName(dirname))
      },

    it: () =>
      function () {
        return run(vectors.it[this.test.title])
      }
  })
}

module.exports = {
  Vector: process.env.TEST === 'record'
    ? VectorRecord
    : process.env.TEST === 'server'
      ? VectorServer
      : VectorPlay
}
