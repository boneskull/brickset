'use strict';

module.exports = {
  errors: {
    NO_API_KEY: 'Set BRICKSET_API_KEY environment variable.  API key can be generated at http://brickset.com/tools/webservices/requestkey',
    BAD_WSDL: 'Invalid or missing WSDL'
  },
  brickset: {
    API_URL: 'http://brickset.com/api/v2.asmx?WSDL',
    CACHE_PATH: __dirname + '/.BricksetAPIv2Soap.wsdl'
  }
};
