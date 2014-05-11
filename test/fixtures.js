var chai = require('chai'),
  sinonChai = require("sinon-chai"),
  chaiAsPromised = require("chai-as-promised");

global.expect = chai.expect;
global.sinon = require('sinon');
chai.use(sinonChai);
chai.use(chaiAsPromised);
