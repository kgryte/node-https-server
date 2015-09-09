/* global require, describe, it, beforeEach */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	path = require( 'path' ),
	noop = require( '@kgryte/noop' ),
	logger = require( './fixtures/logger.js' ),
	createServer = require( './fixtures/server.js' ),
	httpsServer = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// MOCKS //

var keypath, certpath;

keypath = path.join( __dirname, 'fixtures/key.pem' );
certpath = path.join( __dirname, 'fixtures/cert.pem' );


// TESTS //

describe( '@kgryte/https-server', function tests() {

	var opts;

	beforeEach( function before() {
		opts = {
			'key': keypath,
			'cert': certpath
		};
	});

	it( 'should export a function', function test() {
		expect( httpsServer ).to.be.a( 'function' );
	});

	it( 'should throw an error if not provided enough arguments', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			httpsServer();
		}
	});

	it( 'should throw an error if provided an invalid option', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			httpsServer({
				'key': keypath,
				'cert': certpath,
				'port': Math.PI
			}, logger );
		}
	});

	it( 'should throw an error if provided a request listener which is not a function', function test() {
		var values,
			i;

		values = [
			'5',
			5,
			NaN,
			true,
			null,
			undefined,
			[],
			{}
		];

		for ( i = 0; i < values.length; i++ ) {
			expect( badValue( values[ i ] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function badValue() {
				httpsServer( opts, logger, value );
			};
		}
	});

	it( 'should return a function', function test() {
		expect( httpsServer( opts, logger ) ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided a callback which is not a function', function test() {
		var values,
			create,
			i;

		values = [
			'5',
			5,
			NaN,
			true,
			null,
			undefined,
			[],
			{}
		];

		create = httpsServer( opts, logger );

		for ( i = 0; i < values.length; i++ ) {
			expect( badValue( values[ i ] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function badValue() {
				create( value );
			};
		}
	});

	it( 'should listen on a specified port', function test( done ) {
		var create;

		opts.port = 7331;
		create = httpsServer( opts, logger );
		create( onServer );

		function onServer( error, server ) {
			if ( error ) {
				assert.ok( false );
			} else {
				assert.strictEqual( server.address().port, opts.port );
			}
			server.close();
			done();
		}
	});

	it( 'should throw if a server encounters an error', function test( done ) {
		var create,
			server;

		opts.port = 7331;

		create = httpsServer( opts, logger );
		create( next );

		function next( error, s ) {
			server = s;
			expect( foo ).to.throw( Error );
			server.close();
			done();
		}

		function foo() {
			var err = new Error( 'Server error.' );
			server.emit( 'error', err );
		}
	});

	it( 'should throw if unable to listen on a specified port (default behavior)', function test( done ) {
		var create,
			server;

		opts.port = 7331;

		create = httpsServer( opts, logger );
		create( next );

		function next( error, s ) {
			server = s;
			expect( foo ).to.throw( Error );
			server.close();
			done();
		}

		function foo() {
			var err = new Error( 'Server address already in use.' );
			err.code = 'EADDRINUSE';

			server.emit( 'error', err );
		}
	});

	it( 'should port hunt', function test( done ) {
		var create,
			eServer;

		opts.port = 7331;
		opts.maxport = 9999;

		create = httpsServer( opts, logger );
		eServer = createServer( opts.port, next );

		function next() {
			create( onServer );
		}

		function onServer( error, server ) {
			if ( error ) {
				assert.notOk( true );
			} else {
				assert.strictEqual( server.address().port, opts.port+1 );
			}
			server.close();
			eServer.close();
			done();
		}
	});

	it( 'should listen on a specified hostname', function test( done ) {
		var create;

		opts.hostname = 'localhost';
		create = httpsServer( opts, logger );
		create( onServer );

		function onServer( error, server ) {
			if ( error ) {
				assert.ok( false );
			} else {
				assert.strictEqual( server.address().address, '127.0.0.1' );
			}
			server.close();
			done();
		}
	});

	it( 'should listen on a specified address', function test( done ) {
		var create;

		opts.address = '127.0.0.1';
		create = httpsServer( opts, logger );
		create( onServer );

		function onServer( error, server ) {
			if ( error ) {
				assert.ok( false );
			} else {
				assert.strictEqual( server.address().address, opts.address );
			}
			server.close();
			done();
		}
	});

	it( 'should use a provided request listener', function test( done ) {
		var create;

		opts.port = 8443;

		opts.rejectUnauthorized = false;
		opts.requestCert = true;

		create = httpsServer( opts, logger, noop );
		create( onServer );

		// FIXME: this is a weak test, only checking the code path, but not the functionality. The issue with ensuring that the requestListener is used is having to fiddle around with self-signed certificates and other server identify stuff. As it stands now, the code is vulnerable to a regression.

		function onServer( error, server ) {
			if ( error ) {
				assert.ok( false );
			}
			assert.ok( true );
			server.close();
			done();
		}
	});

});
