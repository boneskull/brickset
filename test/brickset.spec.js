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

  describe('constructor', function () {
    it('should throw if no api key', function () {
      expect(brickset).to.throw(Error, config.errors.NO_API_KEY);
    });

    it('should have options', function () {
      var bs = brickset({api_key: api_key, url: wsdl_path});
      expect(bs._opts).to.deep.equal({
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
        stub_writeCache = sandbox.stub(brickset.Brickset.prototype, '_writeCache');
    });

    it('should fail if invalid local wsdl', function (done) {
      var bs = brickset({api_key: api_key, url: path.resolve(__dirname +
        '/bad.wsdl')});
      bs.client
        .then(function () {
          expect(true).to.be.false;
        }, function (err) {
          expect(err).to.equal(config.errors.BAD_WSDL);
        })
        .finally(done);

    });

    it('should fail if invalid remote wsdl', function (done) {
      var bs = brickset({api_key: api_key, url: 'http://whitehouse.gov'});
      bs.client
        .then(function () {
          expect(true).to.be.false;
        }, function (err) {
          expect(err).to.equal(config.errors.BAD_WSDL);
        })
        .finally(done);
    });

    it('should create a client', function (done) {
      var bs = brickset({api_key: api_key});
      bs.client
        .done(function () {
          expect(bs.client.describe).to.be.a('function');
          done();
        }, done);

    });
  });

});
