'use strict';

var Q = require('q'),
  soap = require('soap'),
  _ = require('lodash-node');

var createClient = function createClient(url) {
  return Q.nfapply(soap.createClient, [url])
    .then(function (client) {
      _.each(client.describe(), function (service, service_name) {
        _.each(service, function (port, port_name) {
          _.each(port, function (fn, fn_name) {
            var qfn = Q.denodeify(client[service_name][port_name][fn_name]);
            client[service_name][port_name][fn_name] =
              client[fn_name] = function (qfn) {
                return function () {
                  // do you really want the XML? didn't think so.
                  return qfn.apply(null, arguments).get(0);
                };
              }(qfn);
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
