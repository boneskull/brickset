'use strict';

var soap = require('./soap'),
  fs = require('fs'),
  config = require('./config'),
  _ = require('lodash-node'),
  each = _.each,
  defaults = _.defaults,
  Q = require('q');

var Brickset = function Brickset(options) {
  var cache_path = config.brickset.CACHE_PATH;

  if (!options.api_key) {
    throw new Error(config.errors.NO_API_KEY);
  }

  this._opts = defaults(options, {
    username: process.env.BRICKSET_USERNAME,
    password: process.env.BRICKSET_PASSWORD,
    api_key: process.env.BRICKSET_API_KEY,
    cache: true
  });
  this._opts.url =
    this._opts.url ||
      (this._opts.cache && fs.existsSync(cache_path) ? cache_path :
       process.env.BRICKSET_API_URL || config.brickset.API_URL);

  this._connect();

};

Brickset.prototype._writeCache = function _writeCache(xml) {
  fs.writeFile(config.brickset.CACHE_PATH, xml);
};

Brickset.prototype._connect = function _connect() {
  var opts = this._opts;
  this.client = soap.createClient(opts.url);
  this.client.then(function (client) {
    if (opts.cache) {
      this._writeCache(client.wsdl.toXML());
    }
    this.client = client;
    each(this.client.describe(), function (service) {
      each(service, function (port) {
        each(port, function (fn, fn_name) {
          this[fn_name] = function (params) {
            return fn.call(port,
              defaults(params, {apiKey: opts.api_key}));
          };
        }, this);
      }, this);
    }, this);
    return client;
  }.bind(this), function () {
    throw new Error(config.errors.BAD_WSDL);
  });
};

var brickset = function brickset(options) {
  options = options || {};
  return new Brickset(options);
};
brickset.Brickset = Brickset;

module.exports = brickset;
