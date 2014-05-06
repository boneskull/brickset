var chai = require('chai'),
  sinonChai = require("sinon-chai"),
  path = require('path');

process.env.BRICKSET_API_KEY = 'butts';

global.expect = chai.expect;
global.sinon = require('sinon');
chai.use(sinonChai);
