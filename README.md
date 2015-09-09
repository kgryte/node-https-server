HTTPS Server
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependencies][dependencies-image]][dependencies-url]

> [HTTPS](https://nodejs.org/api/https.html) server.


## Installation

``` bash
$ npm install @kgryte/https-server
```


## Usage

``` javascript
var httpsServer = require( '@kgryte/https-server' );
```

#### httpsServer( options, logger[, requestListener ] )

Returns a `function` to create an [HTTPS](https://nodejs.org/api/https.html) server.

``` javascript
var bunyan = require( 'bunyan' );

// Specify server options...
var opts = {
	'key': 'path/to/private/key',
	'cert': 'path/to/public/certificate',
	'port': 7331,
	'address': '127.0.0.1'
};

// Create a logger...
var logger = bunyan.createLogger({
	'name': 'logger',
	'streams': [
		{
			'name': 'main',
			'level': 'info',
			'stream': process.stdout
		}
	]
});

// Create a function for creating an HTTPS server...
var create = httpsServer( opts, logger );
```

To bind a request callback to a server, specify a `requestListener`. For example,

``` javascript
var express = require( 'express' );

// Create a new application:
var app = express();

// Use the application as a request listener...
var create = httpsServer( opts, logger, app );
```

The `function` accepts the following `options` (along with any other [`tls.createServer`](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener) options):

* 	__key__: path to private key for TLS/SSL.
*	__cert__: path to public certificate for TLS/SSL.
*	__port__: server port. Default: `0` (i.e., randomly assigned).
*	__maxport__: max server port when port hunting. Default: `maxport=port`.
*	__hostname__: server hostname.
*	__address__: server address. Default: `0.0.0.0`.

To specify a range of permissible ports, set the `maxport` option.

``` javascript
opts.maxport = 9999;

var create = httpsServer( opts, logger, app );
```

When provided a `maxport` option, a created server will search for the first available `port` on which to listen, starting from `port`.


#### create( done )

Creates an [HTTPS](https://nodejs.org/api/https.html) server.

``` javascript
function done( error, server ) {
	if ( error ) {
		throw error;
	}
	console.log( 'Success!' );
	server.close();
}

create( done );
```


## Notes

*	Port hunting can be useful in a microservice deployment. When a `port` is randomly assigned (`options.port=0`), if a server fails and is restarted, the server is unlikely to bind to its previous `port`. By allowing a constrained search, assuming no lower `ports` within a specified range have freed up in the meantime, the likelihood of listening on the same `port` is increased. A server can typically restart and bind to the same `port` faster than binding to a new `port` and re-registering with a microservice registry, thus minimizing possible service interruption and downtime. 


## Examples

``` javascript
var bunyan = require( 'bunyan' ),
	express = require( 'express' ),
	httpsServer = require( './../lib' );

// Specify server options...
var opts = {
	'key':'path/to/private/key',
	'cert': 'path/to/public/certificate',
	'port': 7331,
	'maxport': 9999,
	'hostname': 'localhost'
};

// Create a logger...
var logger = bunyan.createLogger({
	'name': 'logger',
	'streams': [
		{
			'name': 'main',
			'level': 'info',
			'stream': process.stdout
		}
	]
});

// Create an express app:
var app = express();

// Create a function for creating an HTTPS server...
var create = httpsServer( opts, logger, app );

/**
* FUNCTION: done( error, server )
*	Callback invoked once a server is ready to receive HTTP requests.
*
* @param {Error|Null} error - error object
* @param {Server} server - server instance
* @returns {Void}
*/
function done( error, server ) {
	if ( error ) {
		throw error;
	}
	console.log( 'Success!' );
	server.close();
}

// Create a server:
create( done );
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2015. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/@kgryte/https-server.svg
[npm-url]: https://npmjs.org/package/@kgryte/https-server

[travis-image]: http://img.shields.io/travis/kgryte/node-https-server/master.svg
[travis-url]: https://travis-ci.org/kgryte/node-https-server

[codecov-image]: https://img.shields.io/codecov/c/github/kgryte/node-https-server/master.svg
[codecov-url]: https://codecov.io/github/kgryte/node-https-server?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/node-https-server.svg
[dependencies-url]: https://david-dm.org/kgryte/node-https-server

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/node-https-server.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/node-https-server

[github-issues-image]: http://img.shields.io/github/issues/kgryte/node-https-server.svg
[github-issues-url]: https://github.com/kgryte/node-https-server/issues
