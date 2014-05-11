'use strict';

var brickset = require('../lib/brickset.js'),
  config = require('../lib/config.js'),
  Q = require('q'),
  path = require('path');

describe('brickset adapter', function() {

  var api_key = '12345',
    sandbox,
    wsdl_path = path.resolve(__dirname + '/brickset.wsdl');

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('brickset()', function () {

    beforeEach(function() {
      sandbox.stub(brickset, '_connect').returnsArg(0);
    });

    it('should throw if no api key', function () {
      expect(brickset).to.throw(Error, config.errors.NO_API_KEY);
    });

    it('should have options', function () {
      var opts = brickset({api_key: api_key, url: wsdl_path});
      expect(opts).to.deep.equal({
        api_key: '12345',
        username: undefined,
        password: undefined,
        cache: true,
        url: wsdl_path
      });
    });
  });

  describe('_connect', function () {

    var stub_writeCache;

    beforeEach(function () {
        stub_writeCache = sandbox.stub(brickset, '_writeCache');
    });

    it('should fail if invalid local wsdl', function () {
      return expect(brickset({api_key: api_key, url: path.resolve(__dirname +
        '/bad.wsdl')})).to.eventually.be.rejectedWith(config.errors.BAD_WSDL);
    });

    it('should fail if invalid remote wsdl', function () {
      return expect(brickset({api_key: api_key, url: 'http://whitehouse.gov'}))
        .to.eventually.be.rejectedWith(config.errors.BAD_WSDL);
    });

    it('should create a client', function () {
      var BricksetClient = require('../lib/client');
      expect(brickset({api_key: api_key, url: wsdl_path}))
        .to.eventually.be.fulfilled
        .then(function (bs) {
          expect(bs).to.be.an.instanceof(BricksetClient);
        });
    });

    it('should provide node-style callback API', function (done) {
      var callback = function (err, res) {
        expect(err).to.be.null;
        expect(res).to.be.defined;
        done();
      };
      brickset({api_key: api_key, url: wsdl_path}, callback);
    });
  });

});
