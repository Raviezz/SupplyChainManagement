/**
 * @file consensus.js
 * @fileOverview Factory module for the Events class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module consensus
 */
'use strict'

var util = require('./util')
var nUtil = require('util')

// The interval for polling.
var defaultPollingInterval = 1000

/**
 * Create a new instance of the Events class. Events allow callers to listen for specific
 * events that are being fired by the server; one example being whenever a new block
 * has been added to the chain, or the code in a specific contract account is being run.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @returns {Events} - A new instance of the Events class.
 */
exports.createInstance = function (server) {
  return new Events(server)
}

/**
 * The Events class deals with event subscriptions.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @augments module:util~ComponentBase
 * @constructor
 */
function Events (server) {
  this._pollingInterval = defaultPollingInterval
  util.ComponentBase.call(this, server)

    // Always use "HTTP" style polling for now.
    // if (client instanceof TWCClient) {
    //     this._sub = WsEventSub;
    // } else {
    //     this._sub = HttpEventSub;
    // }

  this._sub = HttpEventSub
}

nUtil.inherits(Events, util.ComponentBase)

/**
 * Subscribe to a given event.
 *
 * @param {string} event_id - The event id.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Events.prototype.subscribe = function (eventId, callback) {
  this.server.eventSubscribe({event_id: eventId}, callback)
}

/**
 * Unsubscribe to a given event.
 *
 * @param {string} subId - The subscription id (provided as a response to subscribe).
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Events.prototype.unsubscribe = function (subId, callback) {
  this.server.eventUnsubscribe({sub_id: subId}, callback)
}

/**
 * Poll for new event data.
 *
 * @param {string} subId - The subscription id (provided as a response to subscribe).
 * @param {module:rpc/rpc~methodCallback} callback - The callback function. The callback
 * will receive a (potentially empty) array of events of the given type.
 */
Events.prototype.poll = function (subId, callback) {
  this.server.eventPoll({sub_id: subId}, callback)
}

/**
 * Subscribe for solidity events. This is the same as subscribing for logs.
 *
 * @param {string} address - The account to be tracked.
 * @param {module:rpc/rpc~methodCallback} createCallback - Callback for when the subscription has
 * been created. The data returned is a new EventSub object.
 * @param {module:rpc/rpc~methodCallback} eventCallback - The callback function.
 */
Events.prototype.subSolidityEvent = function (address, createCallback, eventCallback) {
    // No need to do another call here...
  this._startEventSub(logEventId(address), createCallback, eventCallback)
}

/**
 * Subscribe for log events.
 *
 * @param {string} address - The account to be tracked.
 * @param {module:rpc/rpc~methodCallback} createCallback - Callback for when the subscription has
 * been created. The data returned is a new EventSub object.
 * @param {module:rpc/rpc~methodCallback} eventCallback - The callback function.
 */
Events.prototype.subLogEvent = function (address, createCallback, eventCallback) {
    // this._startEventSub(logEventId(address), createCallback, eventCallback);
  createCallback(Error('This functionality is believed to be broken in Eris DB.  See https://github.com/eris-ltd/eris-db/issues/96.'))
}

/**
 * Subscribe for account intput events.
 *
 * @param {string} address - The account to be tracked.
 * @param {module:rpc/rpc~methodCallback} createCallback - Callback for when the subscription has
 * been created. The data returned is a new EventSub object.
 * @param {module:rpc/rpc~methodCallback} eventCallback - The callback function.
 */
Events.prototype.subAccountInput = function (address, createCallback, eventCallback) {
  this._startEventSub(accInputId(address), createCallback, eventCallback)
}

/**
 * Subscribe for account output events.
 *
 * @param {string} address - The account to be tracked.
 * @param {module:rpc/rpc~methodCallback} createCallback - Callback for when the subscription has
 * been created. The data returned is a new EventSub object.
 * @param {module:rpc/rpc~methodCallback} eventCallback - The callback function.
 */
Events.prototype.subAccountOutput = function (address, createCallback, eventCallback) {
  this._startEventSub(accOutputId(address), createCallback, eventCallback)
}

/**
 * Subscribe for account receive events.
 *
 * @deprecated Use 'subAccountCall'
 * @param {string} address - The account to be tracked.
 * @param {module:rpc/rpc~methodCallback} createCallback - Callback for when the subscription has
 * been created. The data returned is a new EventSub object.
 * @param {module:rpc/rpc~methodCallback} eventCallback - The callback function.
 */
Events.prototype.subAccountReceive = function (address, createCallback, eventCallback) {
  console.log("DEPRECATED: Use 'subAccountCall' at night.")
  this._startEventSub(accCallId(address), createCallback, eventCallback)
}

/**
 * Subscribe for account call events.
 *
 * @param {string} address - The account to be tracked.
 * @param {module:rpc/rpc~methodCallback} createCallback - Callback for when the subscription has
 * been created. The data returned is a new EventSub object.
 * @param {module:rpc/rpc~methodCallback} eventCallback - The callback function.
 */
Events.prototype.subAccountCall = function (address, createCallback, eventCallback) {
  this._startEventSub(accCallId(address), createCallback, eventCallback)
}

/**
 * Subscribe for bond events.
 *
 * @param {module:rpc/rpc~methodCallback} createCallback - Callback for when the subscription has
 * been created. The data returned is a new EventSub object.
 * @param {module:rpc/rpc~methodCallback} eventCallback - The callback function.
 */
Events.prototype.subBonds = function (createCallback, eventCallback) {
  this._startEventSub(bondId(), createCallback, eventCallback)
}

/**
 * Subscribe for unbond events.
 *
 * @param {module:rpc/rpc~methodCallback} createCallback - Callback for when the subscription has
 * been created. The data returned is a new EventSub object.
 * @param {module:rpc/rpc~methodCallback} eventCallback - The callback function.
 */
Events.prototype.subUnbonds = function (createCallback, eventCallback) {
  this._startEventSub(unbondId(), createCallback, eventCallback)
}

/**
 * Subscribe for rebond events.
 *
 * @param {module:rpc/rpc~methodCallback} createCallback - Callback for when the subscription has
 * been created. The data returned is a new EventSub object.
 * @param {module:rpc/rpc~methodCallback} eventCallback - The callback function.
 */
Events.prototype.subRebonds = function (createCallback, eventCallback) {
  this._startEventSub(rebondId(), createCallback, eventCallback)
}

/**
 * Subscribe for dupeout events.
 *
 * @param {module:rpc/rpc~methodCallback} createCallback - Callback for when the subscription has
 * been created. The data returned is a new EventSub object.
 * @param {module:rpc/rpc~methodCallback} eventCallback - The callback function.
 */
Events.prototype.subDupeouts = function (createCallback, eventCallback) {
  this._startEventSub(dupeoutId(), createCallback, eventCallback)
}

/**
 * Subscribe for new block events.
 *
 * @param {module:rpc/rpc~methodCallback} createCallback - Callback for when the subscription has
 * been created. The data returned is a new EventSub object.
 * @param {module:rpc/rpc~methodCallback} eventCallback - The callback function.
 */
Events.prototype.subNewBlocks = function (createCallback, eventCallback) {
  this._startEventSub(newBlockId(), createCallback, eventCallback)
}

/**
 * Subscribe for fork events.
 *
 * @param {module:rpc/rpc~methodCallback} createCallback - Callback for when the subscription has
 * been created. The data returned is a new EventSub object.
 * @param {module:rpc/rpc~methodCallback} eventCallback - The callback function.
 */
Events.prototype.subForks = function (createCallback, eventCallback) {
  this._startEventSub(forkId(), createCallback, eventCallback)
}

/**
 * Set the time-interval between poll requests. This does not apply when using websockets.
 *
 * @param {number} intervalMs - The time interval in milliseconds.
 */
Events.prototype.setPollingInterval = function (intervalMs) {
  this._pollingInterval = intervalMs
}

/**
 * Get the interval between poll requests.
 *
 * @returns {number}
 */
Events.prototype.getPollingInterval = function () {
  return this._pollingInterval
}

/**
 *
 * @returns {module:rpc/client~Client} The client.
 */
Events.prototype.getClient = function () {
  return this._client
}

/**
 * Create a new event subscription with the basic polling interval.
 * @param {string} eventId - The event id.
 * @param {module:rpc/rpc~methodCallback} [createCallback] - Callback for when the subscription has
 * been created. The data returned is a new EventSub object. If this is omitted, then it is assumed
 * that the sub is a 'once' sub, meaning it will automatically stop after receiving the first event.
 * Moreover, any potential startup errors will be passed into the 'eventCallback' function.
 * @param {module:rpc/rpc~methodCallback} eventCallback - The callback function.
 * @private
 */
Events.prototype._startEventSub = function (eventId, createCallback, eventCallback) {
  var startCallback
  if (!eventCallback) {
    eventCallback = createCallback
  } else {
    startCallback = createCallback
  }
  var es = new this._sub(this, eventId, eventCallback)
  es.start(startCallback)
}

/**
 * An event subscription is an object that is used to poll the server continuously to check whether
 * any new events has arrived on the event channel.
 *
 * @param {Events} events - The Events object.
 * @param {string} eventId - The event id.
 * @param {module:rpc/rpc~methodCallback} eventCallback - Callback for handling incoming data.
 * @constructor
 */
function EventSub (events, eventId, eventCallback) {
  this._run = false
  this._events = events
  this._eventId = eventId
  this._eventCallback = eventCallback
  this._once = false
  this._closeCallback = function () {
  }
}

/**
 * Start listening for new events.
 *
 * @param {module:rpc/rpc~methodCallback} callback - Provides this EventSub instance as data, or an error if it
 * fails to set up a subscription.
 */
EventSub.prototype.start = function (callback) {
  callback(new Error("Subclass does not override the 'start' method"))
}

/**
 * Used to poll manually.
 */
EventSub.prototype.poll = function () {}

/**
 * Stop subscribing.
 *
 * @param {module:rpc/rpc~methodCallback} [closeCallback] - Called when the subscription has been
 * canceled. This is optional, and will overwrite any close callback that was set when starting.
 */
EventSub.prototype.stop = function (closeCallback) {
  if (typeof (closeCallback) === 'function') {
    this._closeCallback = closeCallback
  }
  closeCallback(new Error("Subclass does not override the 'stop' method"))
}

/**
 * Get the subscriber id.
 * @returns {string}
 */
EventSub.prototype.getSubscriberId = function () {
  return this._subId
}

/**
 * Get the event id.
 * @returns {string}
 */
EventSub.prototype.getEventId = function () {
  return this._eventId
}

/**
 * An event subscription type that listens to events being sent over a websocket connection.
 *
 * // TODO change name to more general then "websocket".
 *
 * @param {Events} events - The Events object.
 * @param {string} eventId - The event id.
 * @param {module:rpc/rpc~methodCallback} eventCallback - Callback for handling incoming data. The data
 * will be an array of events.
 * @constructor
 */
function WsEventSub (events, eventId, eventCallback) {
  EventSub.call(this, events, eventId, eventCallback)
}

nUtil.inherits(WsEventSub, EventSub)

/**
 * Start listening for new events.
 *
 * @param {module:rpc/rpc~methodCallback} [callback] - Provides this EventSub instance as data, or an error if it
 * fails to set up a subscription. If omitted, the sub will stop automatically after receiving an event.
 */
WsEventSub.prototype.start = function (callback) {
  var once = !callback
  this._once = once
  if (once) {
    callback = this._eventCallback
  }
  var errorCallback = once ? this._eventCallback : callback
  var that = this
  this._events.subscribe(this._eventId, function (error, data) {
    if (error) {
      errorCallback(error)
      return
    }
    var subId = data.sub_id
    that._subId = subId
    that._run = true
    var ec
    if (once) {
      ec = function (error, data) {
        that._eventCallback(error, data)
        that.stop()
      }
    } else {
      ec = that._eventCallback
    }
    that._events.getClient().addCallback(subId, function (err, evt) {
      if (err) return ec(err)
      ec(null, evt)
    })
    if (!once) {
      callback(null, that)
    }
  })
}

/**
 * Used to poll manually.
 */
WsEventSub.prototype.poll = function () {
  console.log('Cannot poll subscriptions when using a websocket connection; events are forwarded automatically.')
}

/**
 * Stop subscribing. This will send an unsubscribe message to the server.
 *
 * @param {module:rpc/rpc~methodCallback} [closeCallback] - Called when the subscription has been
 * canceled. This is optional, and will overwrite any close callback that was set when starting.
 */
WsEventSub.prototype.stop = function (closeCallback) {
  if (typeof (closeCallback) !== 'function') {
    closeCallback = this._closeCallback
  }
  var that = this
  this._events.unsubscribe(this._subId, function (error, data) {
    that._events.getClient().removeCallback(that._subId)
    if (error) {
      closeCallback(error)
    } else {
      closeCallback(null, data)
    }
  })
  this._run = false
}

/**
 * An event subscription type that polls the server continuously to check whether
 * any new events has arrived.
 *
 * @param {Events} events - The Events object.
 * @param {string} eventId - The event id.
 * @param {module:rpc/rpc~methodCallback} eventCallback - Callback for handling incoming data. The data
 * will be an array of events.
 * @constructor
 */
function HttpEventSub (events, eventId, eventCallback) {
  EventSub.call(this, events, eventId, eventCallback)
}

nUtil.inherits(HttpEventSub, EventSub)

/**
 * Start listening for new events.
 *
 * @param {module:rpc/rpc~methodCallback} callback - Provides this EventSub instance as data, or an error if it
 * fails to set up a subscription.
 */
HttpEventSub.prototype.start = function (callback) {
  var once = !callback
  this._once = once
  var that = this
  var errorCallback = once ? this._eventCallback : callback
  this._events.subscribe(this._eventId, function (error, data) {
    if (error) {
      errorCallback(error)
      return
    }
    that._subId = data.sub_id
    that._run = true
        // Start polling.
    setTimeout(function () {
      that._call()
    }, that._events.getPollingInterval())
    if (callback) {
      callback(null, that)
    }
  })
}

// TODO some cleanup here.
HttpEventSub.prototype._call = function () {
  if (!this._run) {
    this._events.unsubscribe(this._subId, this._closeCallback)
    return
  }
    // Poll may return a number of events, so we break it down into multiple
    // calls to the callback.
  var that = this
  that.poll()
  if (!this._run) {
    this._events.unsubscribe(this._subId, this._closeCallback)
    return
  }
  setTimeout(function () {
    that._call()
  }, this._events.getPollingInterval())
}

/**
 * Used to poll manually.
 */
HttpEventSub.prototype.poll = function () {
  var that = this
  this._events.poll(this._subId, function (error, data) {
    if (error !== null) {
      that._eventCallback(error)
      that._events.unsubscribe(that._subId, that._closeCallback)
      that._run = false
      return
    }
    if (data === null || data.events.length === 0) {
      return
    }
    if (that._once) {
      // TODO All but the first is discarded. This is perfectly fine as the
      // events that are pulled in will be unique to this sub so no data-loss,
      // though it would be better if 'once' was supported all the way to the
      // server, so that a 'once' flag could be passed with the request, and the
      // server event cache would return only the first event (if it has any).
      that._eventCallback(null, data.events[0])
      that.stop()
    } else {
      for (var i = 0; i < data.events.length; i++) {
        that._eventCallback(null, data.events[i])
      }
    }
  })
}

/**
 * Stop subscribing. This will stop the polling loop and send an unsubscribe message to the server.
 *
 * @param {module:rpc/rpc~methodCallback} [closeCallback] - Called when the subscription has been
 * canceled. This is optional, and will overwrite any close callback that was set when starting.
 */
HttpEventSub.prototype.stop = function (closeCallback) {
  if (typeof (closeCallback) === 'function') {
    this._closeCallback = closeCallback
  }
  this._run = false
}

/**
 * Get log event id. This is used for solidity events as well.
 *
 * @param {string} address - The account address.
 * @returns {string}
 */
function logEventId (address) {
  return 'Log/' + address
}

/**
 * Get account input event id.
 *
 * @param {string} address - The account address.
 * @returns {string}
 */
function accInputId (address) {
  return 'Acc/' + address + '/Input'
}

/**
 * Get account output event id.
 * @param {string} address - The account address.
 * @returns {string}
 */
function accOutputId (address) {
  return 'Acc/' + address + '/Output'
}

/**
 * Get account call event id.
 *
 * @param {string} address - The account address.
 * @returns {string}
 */
function accCallId (address) {
  return 'Acc/' + address + '/Call'
}

/**
 * Get bond event id.
 *
 * @returns {string}
 */
function bondId () {
  return 'Bond'
}

/**
 * Get unbond event id.
 * @returns {string}
 */
function unbondId () {
  return 'Unbond'
}

/**
 * Get rebond event id.
 * @returns {string}
 */
function rebondId () {
  return 'Rebond'
}

/**
 * Get dupeout event id.
 * @returns {string}
 */
function dupeoutId () {
  return 'Dupeout'
}

/**
 * Get new block event id.
 * @returns {string}
 */
function newBlockId () {
  return 'NewBlock'
}

/**
 * Get fork event id.
 * @returns {string}
 */
function forkId () {
  return 'Fork'
}
