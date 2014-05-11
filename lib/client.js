'use strict';

var _ = require('lodash-node'),
  config = require('./config'),
  each = _.each,
  defaults = _.defaults;


var BricksetClient = function BricksetClient(client, opts) {
  this._client = client;
  this._opts = opts;
};

BricksetClient._wrap = function _wrap(fn) {
  if (fn.input.userHash) {
    return function (params) {
      var call = function call() {
        return fn.call(this._client,
          defaults(params,
            {apiKey: this._opts.api_key, userHash: this._opts.user_hash}));
      };
      if (!this._opts.user_hash) {
        if (!(this._opts.username || this._opts.password)) {
          throw new Error(config.errors.NO_USERNAME_OR_PASSWORD);
        }
        return this.login(defaults(params,
            {username: this._opts.username, password: this._opts.password}))
          .then(function (res) {
            this._opts.user_hash = res.userHash;
            return call.call(this);
          }.bind(this));
      } else {
        return call.call(this);
      }
    };
  }

  return function (params) {
    return fn.call(this._client,
      defaults(params, {apiKey: this._opts.api_key}));
  };
};

BricksetClient._reset = function _reset() {
  BricksetClient.prototype = {};
};

BricksetClient._buildPrototype =
  _.memoize(function buildPrototype(desc) {
    desc = JSON.parse(desc);
    BricksetClient._reset();
    each(desc, function (service) {
      each(service, function (port) {
        each(port, function (fn, fn_name) {
          BricksetClient.prototype[fn_name] = BricksetClient._wrap(fn);
        });
      });
    });
  });

BricksetClient.create = function create(client, opts) {
  BricksetClient._buildPrototype(JSON.stringify(client.describe()));
  return new BricksetClient(client, opts);
};

module.exports = BricksetClient;
