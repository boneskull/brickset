'use strict';

var soap = require('./soap'),
  config = require('./config'),
  _ = require('lodash-node'),
  Q = require('q');

var Brickset = function Brickset(options) {
  var url = process.env.BRICKSET_API_URL || config.brickset.API_URL,
    api_key;

  if (!options.api_key) {
    throw new Error(config.errors.NO_API_KEY);
  }

  this.opts = _.defaults(options, {
    username: process.env.BRICKSET_USERNAME,
    password: process.env.BRICKSET_PASSWORD,
    api_key: process.env.BRICKSET_API_KEY
  });

  api_key = this.opts.api_key;

  try {
    this.client = soap.createClient(url);
    this.client.done(function (client) {
      this.client = client;
      _.each(this.client.describe(), function (service) {
        _.each(service, function (port) {
          _.each(port, function (fn, fn_name) {
            this[fn_name] = function (params) {
              return fn.call(port,
                _.defaults(params, {apiKey: api_key}));
            };
          }, this);
        }, this);
      }, this);
      return client;
    }.bind(this), function () {
      throw new Error();
    });
  } catch (e) {
    throw new Error(config.errors.BAD_WSDL);
  }

};
/**
 *
 *
 if (!opts.username) {
    throw new Error(config.errors.NO_USERNAME);
  }
 if (!opts.password) {
    throw new Error(config.errors.NO_PASSWORD);
  }
 *       return client.login({
        username: opts.username,
        password: opts.password,
        api_key: opts.api_key
      });
 .then(function(userhash) {
      if(userhash === 'INVALIDKEY') {
        throw new Error(config.errors.INVALID_API_KEY);
      }
      _.each(this.client.describe(), function (service, service_name) {
        _.each(service, function (port, port_name) {
          _.each(port, function (fn, fn_name) {
            this[fn_name] = function () {
            }
          }, this);
        }, this);
      }, this);
    }.bind(this))
 .done(function() {}, function(err) {
      if(err) {
        throw err;
      }
      throw new Error(config.errors.BAD_LOGIN);
    });

 */
_.each(Brickset.prototype, function (fn, name) {
  Brickset.prototype[name] = function () {
    return Q(this.client)
      .then(fn.bind(this, arguments));
  };
});

module.exports = function brickset(options) {
  return new Brickset(options);
};
