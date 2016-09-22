'use strict';

var Q = require('q'),
  soap = require('soap'),
  _ = require('lodash');

var createClient = function createClient(url) {
  return Q.nfapply(soap.createClient, [url])
    .then(function (client) {
      _.each(client.describe(), function (service, service_name) {
        _.each(service, function (port, port_name) {
          _.each(port, function (fn, fn_name) {
            var port = client[service_name][port_name];
            port[fn_name] =
              client[fn_name] = function (fn) {
                return function () {
                  // do you really want the XML? didn't think so.
                  return Q.nfapply(fn, arguments).get(0);
                };
              }(port[fn_name]);
          });
        });
      });
      return client;
    });
};

module.exports = {
  createClient: createClient,
  listen: soap.listen
};
