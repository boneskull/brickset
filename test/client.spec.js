'use strict';

var BricksetClient = require('../lib/client');

describe('BricksetClient', function () {

  var sandbox,
    params = {
      api_key: '12345'
    };

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });


  describe('create()', function () {

    beforeEach(function () {
      sandbox.spy(BricksetClient, '_reset');
      BricksetClient._buildPrototype.cache = {};
    });

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
          }
        }
      }
    };

    it('should instantiate BricksetClient with wrapper functions', function () {
      var client = {
          describe: sandbox.stub().returns(desc)
        },
        bs = BricksetClient.create(client, params);

      expect(client.describe).to.have.been.calledOnce;
      expect(BricksetClient._reset).to.have.been.calledOnce;
      expect(bs.foo).to.be.a('function');
      expect(bs.bar).to.be.a('function');

    });

    it('should not recreate prototype with identical description', function () {
      var client = {
        describe: sandbox.stub().returns(desc)
      };

      BricksetClient.create(client, params);
      BricksetClient.create(client, params);
      expect(BricksetClient._reset).to.have.been.calledOnce;

    });

  });

});
