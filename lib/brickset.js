'use strict';

var soap = require('./soap'),
  api_key = process.env.BRICKSET_API_KEY,
  Q = require('q'),

  url = process.env.BRICKSET_API_URL || 'http://brickset.com/api/v2.asmx?WSDL';

if (!api_key) {
  throw new Error('Set BRICKSET_API_KEY environment variable.  API key can be generated at http://brickset.com/tools/webservices/requestkey');
}

soap.createClient(url)
  .then(function (client) {
    return client.checkKey(api_key);
  })
  .then(function (result) {
    console.log(result);
  });
