'use strict';

var bunyan = require( 'bunyan' ),
	path = require( 'path' ),
	express = require( 'express' ),
	httpsServer = require( './../lib' );

// Specify server options...
var opts = {
	'key': path.resolve( __dirname, '../test/fixtures/key.pem' ),
	'cert': path.resolve( __dirname, '../test/fixtures/cert.pem' ),
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
