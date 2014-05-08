'use strict';

var brickset = require('../lib/brickset.js'),
  config = require('../lib/config.js'),
  Q = require('q'),
  path = require('path');

describe('brickset adapter', function() {

  var bs;

  beforeEach(function () {
    config.brickset.API_URL = path.resolve(__dirname + '/brickset.wsdl.xml');

    bs = brickset({api_key: '12345'});
  });

  it('should throw if no api key', function () {
    expect(brickset).to.throw;
  });

  it('should have options', function () {
    expect(bs.opts).to.deep.equal({
      api_key: '12345',
      username: undefined,
      password: undefined
    });
  });

  it('should fail if invalid local wsdl', function () {
    config.brickset.API_URL = path.resolve(__dirname + '/bad.wsdl.xml');
    expect(function () {
      brickset({api_key: '12345'});
    }).to.throw;
  });

  it('should fail if invalid remote wsdl', function () {
    config.brickset.API_URL = 'http://whitehouse.gov';
    expect(function () {
      brickset({api_key: '12345'});
    }).to.throw;
  });

  it('should create a client', function (done) {
    bs.client
      .done(function () {
        expect(bs.client.describe).to.be.a('function');
        done();
      }, done);

  });
});
