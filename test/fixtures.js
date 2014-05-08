var chai = require('chai'),
  sinonChai = require("sinon-chai"),
  path = require('path');

global.expect = chai.expect;
global.sinon = require('sinon');
chai.use(sinonChai);
