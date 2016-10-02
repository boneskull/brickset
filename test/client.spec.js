'use strict';

var BricksetClient = require('../lib/client'),
  Q = require('q'),
  config = require('../lib/config'),
  _ = require('lodash');

describe('BricksetClient', function () {

  var sandbox,
    params = {
      api_key: '12345'
    },
    user_hash = '0123456789ABCDEF';

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });


  describe('create()', function () {

    var desc = {
      service: {
        port: {
          foo: {
            input: {
              thing: 'string'
            }
          },
          bar: {
            input: {
              userHash: 'string'
            }
          },
          login: {
            input: {
              username: 'string',
              password: 'string'
            }
          }
        }
      }
      },
      client,
      bs;

    beforeEach(function () {
      client = {
        describe: sandbox.stub().returns(desc),
        service: {
          port: {
            foo: sandbox.stub().returns(Q(true)),
            bar: sandbox.stub().returns(Q(true)),
            login: sandbox.stub().returns(Q({loginResult : user_hash}))
          }
        }
      };
      sandbox.spy(BricksetClient, '_reset');
      BricksetClient._buildPrototype = _.memoize(BricksetClient.__buildPrototype);
      bs = BricksetClient.create(client, params);
    });

    it('should instantiate BricksetClient with wrapper functions', function () {
      expect(client.describe).to.have.been.calledOnce;
      expect(BricksetClient._reset).to.have.been.calledOnce;
      expect(bs.foo).to.be.a('function');
      expect(bs.bar).to.be.a('function');
    });

    it('should not recreate prototype with identical description', function () {
      BricksetClient.create(client, params);
      expect(BricksetClient._reset).to.have.been.calledOnce;
    });

    it('should pass api_key for API functions not requiring auth',
      function () {
        var foo = client.service.port.foo;
        bs.foo({bar: 'baz'});
        expect(foo).to.have.been.calledOnce;
        expect(foo).to.have.been.calledWith({
          apiKey: params.api_key,
          bar: 'baz'
        });
      });

    it('should fail if no credentials found and API function requires auth',
      function () {
        return expect(bs.bar({baz: 'quux'}))
          .to.eventually.be.rejectedWith(config.errors.NO_USERNAME_OR_PASSWORD);
      });

    it('should omit login if userHash defined even if API function requires auth',
      function () {
        return expect(bs.bar({userHash: null}))
            .to.eventually.become(true)
            .then(function () {
              expect(client.service.port.login).to.have.been.not.called;
            });
      });

    it('should attempt login if API function requires auth',
      function () {
        return expect(bs.bar({
          baz: 'quux',
          username: 'herp',
          password: 'derp'
        }))
          .to.eventually.be.fulfilled
          .then(function () {
            expect(client.service.port.login).to.have.been.calledOnce;
            expect(client.service.port.login).to.have.been.calledWith({
              apiKey: params.api_key,
              username: 'herp',
              password: 'derp'
            });
          });
      });

    it('should call the original function', function () {
      return expect(bs.bar({
        baz: 'quux',
        username: 'herp',
        password: 'derp'
      }))
        .to.eventually.become(true)
        .then(function () {
          expect(client.service.port.bar).to.have.been.calledOnce;
          expect(client.service.port.bar).to.have.been.calledWith({
            apiKey: params.api_key,
            userHash: user_hash,
            baz: 'quux'});
        });
    });

    it('should provide node-style callback API', function (done) {
      var callback = function(err, res) {
        expect(err).to.be.null;
        expect(res).to.be.true;
        done();
      };
      bs.bar({
        baz: 'quux',
        username: 'herp',
        password: 'derp'
      }, callback);
    });
  });

});
