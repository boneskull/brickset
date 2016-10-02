'use strict';

var _ = require('lodash'),
  config = require('./config'),
  each = _.each,
  defaults = _.defaults,
  Q = require('q');

var BricksetClient = function BricksetClient(client, opts) {
  this._client = client;
  this._opts = opts;
};

BricksetClient._wrap = function _wrap(desc, fn) {
  var inputs = _.mapValues(desc.input, function (){ return null; });

  if (desc.input.userHash) {
    return function (params, callback) {
      var call = function call() {
          delete params.username;
          delete params.password;
          return fn.call(null,
              Object.assign(inputs, {
                apiKey: this._opts.api_key,
                userHash: this._opts.user_hash
              }, params))
              .nodeify(callback);
        },
        username,
        password;
      if (!this._opts.user_hash) {
        username = params.username || this._opts.username;
        password = params.password || this._opts.password;
        if (!(username || password)) {
          return Q.reject(config.errors.NO_USERNAME_OR_PASSWORD);
        }
        return this.login({
          apiKey: this._opts.api_key,
          username: username,
          password: password
        })
          .then(function (loginResponse) {
            this._opts.user_hash = loginResponse.loginResult;
            return call.call(this);
          }.bind(this));
      } else {
        return call.call(this);
      }
    };
  }

  return function (params, callback) {
    return fn.call(null,
      Object.assign(inputs, {apiKey: this._opts.api_key}, params))
      .nodeify(callback);
  };
};

BricksetClient._reset = function _reset() {
  BricksetClient.prototype = {};
};

BricksetClient.__buildPrototype = function buildPrototype(desc, client) {
    desc = JSON.parse(desc);
    BricksetClient._reset();
    each(desc, function (service, service_name) {
      each(service, function (port, port_name) {
        each(port, function (fn, fn_name) {
          BricksetClient.prototype[fn_name] =
            BricksetClient._wrap(fn, client[service_name][port_name][fn_name]);
        });
      });
    });
  };

BricksetClient._buildPrototype = _.memoize(BricksetClient.__buildPrototype);

BricksetClient.create = function create(client, opts) {
  BricksetClient._buildPrototype(JSON.stringify(client.describe()), client);
  return new BricksetClient(client, opts);
};

module.exports = BricksetClient;
