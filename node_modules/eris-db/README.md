# erisdb-js (Alpha)

This is a JavaScript API for communicating with a [ErisDB](https://github.com/eris-ltd/eris-db) server.

## Installation

### Prerequisites

* [Git](https://git-scm.com/)
* [Monax Eris](https://monax.io/) version 0.12
* [Node.js](https://nodejs.org/) version 6 or higher

You can check the installed version of Node.js with the command:

```shell
$ node --version
```

If your distribution of Linux has a version older than 6 then you can
update it using [NodeSource's distribution](https://github.com/nodesource/distributions).

### To Install

```shell
$ npm install eris-db
```

## Usage

If you created an ErisDB server using the [Eris CLI](https://github.com/eris-ltd/eris-cli) tool, you can find out its IP address using the following command:

```
$ eris chains inspect <name of ErisDB server> NetworkSettings.IPAddress
```

The main class is `ErisDB`. A standard `ErisDB` instance is created like this:

```JavaScript
var edbFactory = require('eris-db');

var edb = edbFactory.createInstance("http://<IP address>:1337/rpc");
```

The parameters for `createInstance` is the server URL as a string. The client-type is chosen based on the URL scheme. As of now, the supported schemes are: `http` and `ws` (websockets). No additional configuration is needed.

## API Reference

There are bindings for all the RPC methods. All functions are on the form `function(param1, param2, ... , callback)`, where the callback is a function on the form `function(error,data)` (it is documented under the name `methodCallback`). The `data` object is the same as you would get by calling the corresponding RPC method directly.

This is the over-all structure of the library. The `unsafe` flag means a private key is either sent or received, so should be used with care (dev only).

NOTE: There will be links to the proper jsdoc and integration with erisindustries.com. For now, the components point to the actual code files and methods points to the web-API method in question.

### ErisDB

| Component Name | Accessor |
| :------------- | :------- |
| Accounts | [ErisDB.accounts()](https://github.com/eris-ltd/erisdb-js/blob/master/lib/accounts.js) |
| Blockchain | [ErisDB.blockchain()](https://github.com/eris-ltd/erisdb-js/blob/master/lib/blockchain.js) |
| Consensus | [ErisDB.consensus()](https://github.com/eris-ltd/erisdb-js/blob/master/lib/consensus.js) |
| Events | [ErisDB.events()](https://github.com/eris-ltd/erisdb-js/blob/master/lib/events.js) |
| NameReg | [ErisDB.namereg()](https://github.com/eris-ltd/erisdb-js/blob/master/lib/namereg.js) |
| Network | [ErisDB.network()](https://github.com/eris-ltd/erisdb-js/blob/master/lib/network.js) |
| Transactions | [ErisDB.txs()](https://github.com/eris-ltd/erisdb-js/blob/master/lib/transactions.js) |

### Components

#### Accounts

The accounts object has methods for getting account and account-storage data.

| Method | RPC method | Notes |
| :----- | :--------- | :---- |
| Accounts.getAccounts | [erisdb.getAccounts](https://monax.io/docs/documentation/db/latest/specifications/api/#getaccounts) | |
| Accounts.getAccount | [erisdb.getAccount](https://monax.io/docs/documentation/db/latest/specifications/api/#getaccount) | |
| Accounts.getStorage | [erisdb.getStorage](https://monax.io/docs/documentation/db/latest/specifications/api/#getstorage) | |
| Accounts.getStorageAt | [erisdb.getStorageAt](https://monax.io/docs/documentation/db/latest/specifications/api/#getstorageat) | |
| Accounts.genPrivAccount | [erisdb.genPrivAccount](https://monax.io/docs/documentation/db/latest/specifications/api/#genprivaccount) | unsafe |

#### BlockChain

The accounts object has methods for getting blockchain-related data, such as a list of blocks, or individual blocks, or the hash of the genesis block.

| Method | RPC method | Notes |
| :----- | :--------- | :---- |
| BlockChain.getInfo |  [erisdb.getBlockchainInfo](https://monax.io/docs/documentation/db/latest/specifications/api/#getblockchaininfo) | |
| BlockChain.getChainId | [erisdb.getChainId](https://monax.io/docs/documentation/db/latest/specifications/api/#getchainid) | |
| BlockChain.getGenesisHash | [erisdb.getGenesisHash](https://monax.io/docs/documentation/db/latest/specifications/api/#getgenesishash) | |
| BlockChain.getLatestBlockHeight | [erisdb.getLatestBlockHeight](https://monax.io/docs/documentation/db/latest/specifications/api/#getlatestblockheight) | |
| BlockChain.getLatestBlock | [erisdb.getLatestBlock](https://monax.io/docs/documentation/db/latest/specifications/api/#getlatestblock) | |
| BlockChain.getBlocks | [erisdb.getBlocks](https://monax.io/docs/documentation/db/latest/specifications/api/#getblocks) | |
| BlockChain.getBlock | [erisdb.getBlock](https://monax.io/docs/documentation/db/latest/specifications/api/#getblock) | |

#### Consensus

The consensus object has methods for getting consensus-related data.

| Method | RPC method | Notes |
| :----- | :--------- | :---- |
| Consensus.getState |   [erisdb.getConsensusState](https://monax.io/docs/documentation/db/latest/specifications/api/#getconsensusstate) | |
| Consensus.getValidators | [erisdb.getValidators](https://monax.io/docs/documentation/db/latest/specifications/api/#getvalidators) | |

#### Events

The tendermint client will generate and fire off events when important things happen, like when a new block has been committed, or someone is transacting to an account. It is possible to subscribe to these events. These are the methods for subscribing, un-subscribing and polling.

| Method | RPC method | Notes |
| :----- | :--------- | :---- |
| Events.subscribe | [erisdb.eventSubscribe](https://monax.io/docs/documentation/db/latest/specifications/api/#eventsubscribe) | |
| Events.unsubscribe | [erisdb.eventUnsubscribe](https://monax.io/docs/documentation/db/latest/specifications/api/#eventunubscribe) | |
| Events.poll | [erisdb.eventPoll](https://monax.io/docs/documentation/db/latest/specifications/api/#eventpoll) | |

##### Helpers

The helper functions makes it easier to manage subscriptions. Normally you'd be using these functions rather then managing the subscriptions yourself.

Helper functions always contain two callback functions - a `createCallback(error, data)` and an `eventCallback(error, data)`.

The `createCallback` data is an [EventSub]() object, that can be used to do things like getting the event ID, the subscriber ID, and to stop the subscription.

The `eventCallback` data is the event object. This object is different depending on the event type. In the case of `NewBlock` it will be a block, the consensus events is a transaction object, etc. More info can be found in the [api doc]().

| Method | Arguments |
| :----- | :-------- |
| Events.subAccountInput | `account address <string>` |
| Events.subAccountOutput | `account address <string>` |
| Events.subAccountReceive | `account address <string>` |
| Events.subLogEvent | `account address <string>` |
| Events.subSolidityEvent | `account address <string>` |
| Events.subNewBlocks | `-` |
| Events.subForks | `-` |
| Events.subBonds | `-` |
| Events.subUnbonds | `-` |
| Events.subRebonds | `-` |
| Events.subDupeouts | `-` |

`subSolidityEvent` and `subLogEvent` are two different names for the same type of subscription (log events).

#### NameReg

The NameReg object has methods for accessing the name registry.

| Method | RPC method | Notes |
| :----- | :--------- | :---- |
| NameReg.getEntry | [erisdb.getNameRegEntry](https://monax.io/docs/documentation/db/latest/specifications/api/#get-namereg-entry) | |
| NameReg.getEntries | [erisdb.getNameRegEntries](https://monax.io/docs/documentation/db/latest/specifications/api/#get-namereg-entries) | |

#### Network

The accounts object has methods for getting network-related data, such as a list of all peers. It could also have been named "node".

Client Version may be a bit misplaced

| Method | RPC method | Notes |
| :----- | :--------- | :---- |
| Network.getInfo | [erisdb.getNetworkInfo](https://monax.io/docs/documentation/db/latest/specifications/api/#getnetworkinfo) |  |
| Network.getClientVersion | [erisdb.getClientVersion](https://monax.io/docs/documentation/db/latest/specifications/api/#getclientversion) | |
| Network.getMoniker | [erisdb.getMoniker](https://monax.io/docs/documentation/db/latest/specifications/api/#getmoniker) | |
| Network.isListening | [erisdb.isListening](https://monax.io/docs/documentation/db/latest/specifications/api/#islistening) | |
| Network.getListeners | [erisdb.getListeners](https://monax.io/docs/documentation/db/latest/specifications/api/#getlisteners) | |
| Network.getPeers | [erisdb.getPeers](https://monax.io/docs/documentation/db/latest/specifications/api/#getpeers) | |
| Network.getPeer | [erisdb.getPeer](https://monax.io/docs/documentation/db/latest/specifications/api/#getpeer) | |

#### Transactions

A transaction is the equivalence of a database `write` operation. They can be done in two ways. There's the "dev" way, which is to call `transact` and pass along the target address (if any), data, gas, and a private key used for signing. It is very similar to the old Ethereum way of transacting, except Tendermint does not keep accounts in the client, so a private key needs to be sent along. This means the server **should either run on the same machine as the tendermint client, or in the same, private network**.

Transacting via `broadcastTx` will be the standard way of doing things if you want the key to remain on the users machine. This requires a browser plugin for doing the actual signing, which we will add later. For now, you should stick to the `transact` method.

To get a private key for testing/developing, you can run `tendermint gen_account` if you have it installed. You can also run `tools/pa_generator.js` if you have a local node running. It will take the url as command line argument at some point...

##### Calls

Calls provide read-only access to the smart contracts. It is used mostly to get data out of a contract-accounts storage by using the contracts accessor methods, but can be used to call any method that does not change any data in any account. A trivial example would be a contract function that takes two numbers as input, adds them, and then simply returns the sum.

There are two types of calls. `Call` takes a data string and an account address and calls the code in that account (if any) using the provided data as input. This is the standard method for read-only operations.

`CallCode` works the same except you don't provide an account address but the actual compiled code instead. It's a dev tool for accessing the VM directly. "Code-execution as a service".

| Method | RPC method | Notes |
| :----- | :--------- | :---- |
| Transactions.broadcastTx | [erisdb.broadcastTx](https://monax.io/docs/documentation/db/latest/specifications/api/#broadcasttx) | see below |
| Transactions.getUnconfirmedTxs | [erisdb.getUnconfirmedTxs](https://monax.io/docs/documentation/db/latest/specifications/api/#getunconfirmedtxs) | |
| Transactions.call | [erisdb.call](https://monax.io/docs/documentation/db/latest/specifications/api/#call) | |
| Transactions.callCode | [erisdb.callCode](https://monax.io/docs/documentation/db/latest/specifications/api/#callcode) | |
| Transactions.transact | [erisdb.transact](https://monax.io/docs/documentation/db/latest/specifications/api/#transact) | unsafe |
| Transactions.transactAndHold | [erisdb.transactAndHold](https://monax.io/docs/documentation/db/latest/specifications/api/#transact-and-hold) | unsafe |
| Transactions.transactNameReg | [erisdb.transactNameReg](https://monax.io/docs/documentation/db/latest/specifications/api/#transactnamereg) | unsafe |

`broadcastTx` is useless until we add a client-side signing solution.

## Documentation

Generate documentation using the command `npm run doc`.

## Testing

To test the library against pre-recorded vectors:

```
npm test
```

To test the library against Eris DB while recording vectors:

```
TEST=record npm test
```

To test Eris DB against pre-recorded vectors without exercising the library:

```
TEST=server npm test
```

## Debugging

Debugging information will display on `stderr` if the library is run with `NODE_DEBUG=eris` in the environment.

## Copyright

Copyright 2015 Monax

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
