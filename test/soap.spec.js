'use strict';

var soap = require('../lib/soap'),
  _ = require('lodash-node'),
  path = require('path'),
  http = require('http'),
  format = require('util').format,

  WSDL_FILEPATH = path.resolve(__dirname + '/test.wsdl'),

  PORT = 31337,
  url = format('http://localhost:%d/wsdl?wsdl', PORT),

  Hello_Service = {
    Hello_Service: {
      Hello_Port: {
        sayHello: function (args) {
          return {
            greeting: 'Hello, ' + args.firstName
          };
        }
      }
    }
  },
  server;

// boot up a SOAP server for testing
server = http.createServer();
server.listen(PORT);
soap.listen(server, '/wsdl', Hello_Service,
  require('fs').readFileSync(WSDL_FILEPATH, 'utf8'));

describe('soap wrapper', function () {
  it('should create a client', function () {
    return expect(soap.createClient(url)).to.eventually.be.fulfilled
      .then(function (client) {
        expect(client.describe).to.be.a.function;
      });
  });

  it('should wrap functions', function () {
    return expect(soap.createClient(url)).to.eventually.be.fulfilled
      .then(function (client) {
        var desc = client.describe();
        expect(desc.Hello_Service).to.be.an('object');
        expect(desc.Hello_Service.Hello_Port).to.be.an('object');
        expect(desc.Hello_Service.Hello_Port.sayHello).to.be.an('object');
        expect(client.Hello_Service.Hello_Port.sayHello).to.be.a('function');
        expect(client.sayHello).to.be.a('function');
        return expect(client.sayHello({firstName: 'Beezer T. Washingbeard'}))
          .to.eventually.become({greeting: 'Hello, Beezer T. Washingbeard'});
      });

  });
});
