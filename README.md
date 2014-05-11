# node-brickset [![NPM version](https://badge.fury.io/js/brickset.svg)](http://badge.fury.io/js/brickset) [![Build Status](https://travis-ci.org/boneskull/node-brickset.svg?branch=master)](https://travis-ci.org/boneskull/node-brickset)

NodeJS adapter to Brickset API

## What This Module Provides

[Brickset](http://brickset.com) is an online LEGO&reg; set guide.

The [Brickset API v2](http://brickset.com/tools/webservices/v2) provides an API
into the site's functionality.  This module eases authentication and provides
[Promise](https://www.promisejs.org/) wrappers around these API functions.

The API is a [SOAP](http://en.wikipedia.org/wiki/SOAP) API,
and this module leverages [node-soap](https://github.com/vpulim/node-soap) to
 access it.  Promises are provided by [Q](https://github.com/kriskowal/q).

> *Like node-soap, as the WSDL file changes, so does the JS API*--client object
methods are generated automatically.

**You need an API key from [Brickset](http://brickset.com) to use this
module**; get one [here](http://brickset.com/tools/webservices/requestkey).
Many functions also require a Brickset user name and password.  It's
recommended to store these in the environment variables `BRICKSET_API_KEY`,
`BRICKSET_USERNAME`, and `BRICKSET_PASSWORD`, respecitvely.

> **Passwords are sent in plaintext; Brickset does not provide `https`.  Use
a unique password!**

This module supports the [Brickset API v2](http://brickset.com/tools/webservices/v2) only.

## Installation

`npm install brickset`

## Usage

```js

var brickset = require('brickset');

brickset({
  api_key: YOUR_API_KEY,
  username: YOUR_BRICKSET_USERNAME, // optional, for functions requiring auth
  password: YOUR_BRICKSET_PASSWORD  // ditto
})
  .then(function(bs) {
    // this function requires auth; login happens automatically
    return bs.getSet({
      setID: '7722-1'
    });
  })
  .get(0) // getSet() returns an array; get first item
  .get('bricksetURL')
  .then(function(url) {
    console.log(url);
  });

// alternatively, you can use node-style callbacks
brickset({
  api_key: YOUR_API_KEY,
  username: YOUR_BRICKSET_USERNAME, // optional, for functions requiring auth
  password: YOUR_BRICKSET_PASSWORD  // ditto
}, function(err, bs) {
  bs.getSet({
    setID: '7722-1'
  }, function(err, legoSet) {
    // etc.
  });
});
```

### Cache Busting

For performance, the module will cache the API definition (WSDL) file.  If
you do not want to cache this information, use:

```js
brickset({
  api_key: YOUR_API_KEY,
  cache: false
});
```

The definition is located in `/path/to/brickset/lib/.BricksetAPIv2Soap.wsdl`
(thus, if you have installed globally for some reason,
you may incur permissions issues if superuser access is needed to write to
this file).

Since the API is in beta as of this writing, it's subject to change.  You
should probably remove the cache every so often until it is finalized.

### Brickset API URL

If the URL of the WSDL should change, you can define a custom URL:

```js
brickset({
  api_key: YOUR_API_KEY,
  url: 'http://some/url.wsdl'
});
```
## Testing

1.  (Fork and) clone this repo
2.  `npm install`
3.  `npm test`

## Resources

- [Brickset API v2](http://brickset.com/tools/webservices/v2)
- [node-soap](https://github.com/vpulim/node-soap)
- [Q](https://github.com/kriskowal/q)

## License

MIT

## Author

[Christopher Hiller](http://boneskull.github.io)
