'use strict';

// MODULES //

var https = require( 'https' ),
	copy = require( 'utils-copy' ),
	isFunction = require( 'validate.io-function' ),
	validate = require( './validate.js' );


// HTTPS SERVER //

/**
* FUNCTION: httpsServer( options, logger[, requestListener] )
*	Returns a function which creates an HTTPS server.
*
* @param {Object} options - server options
* @param {String} options.key - path to private key
* @param {String} options.cert - path to public certificate
* @param {Number} [options.port=0] - server port
* @param {Number} [options.maxport] - max server port
* @param {String} [options.hostname] - server hostname
* @param {String} [options.address="0.0.0.0"] - server address
* @param {Logger} logger - logger
* @param {Function} [requestListener] - callback invoked upon receiving an HTTP request
* @returns {Function} function which creates an HTTPS server
*/
function httpsServer( options, logger, requestListener ) {
	var hostname,
		opts,
		port,
		max,
		err;

	if ( arguments.length < 2 ) {
		throw new Error( 'insufficient input arguments. Must provide server options and a logger.' );
	} else if (
		arguments.length > 2 &&
		!isFunction( requestListener )
	) {
		throw new TypeError( 'invalid input argument. Request listener must be a function. Value: `' + requestListener + '`.' );
	}
	opts = copy( options );
	err = validate( opts );
	if ( err ) {
		throw err;
	}
	if ( opts.port === void 0 ) {
		port = 0;
	} else {
		port = opts.port;
	}
	if ( opts.maxport === void 0 ) {
		max = port;
	} else {
		max = opts.maxport;
	}
	if ( opts.hostname ) {
		hostname = opts.hostname;
	}
	else if ( opts.address ) {
		hostname = opts.address;
	}
	else {
		hostname = '0.0.0.0';
	}
	/**
	* FUNCTION: create( done )
	*	Creates an HTTPS server.
	*
	* @private
	* @param {Function} done - function to invoke after creating a server
	* @returns {Void}
	*/
	return function create( done ) {
		var server;

		if ( !isFunction( done ) ) {
			throw new TypeError( 'invalid input argument. Callback must be a function. Value: `' + done + '`.' );
		}
		if ( requestListener ) {
			server = https.createServer( opts, requestListener );
		} else {
			server = https.createServer( opts );
		}
		server.on( 'error', errorListener );
		server.once( 'listening', onListen );

		logger.info( 'Attempting to listen on %s:%d.', hostname, port );
		server.listen( port, hostname );

		/**
		* FUNCTION: errorListener( error )
		*	Server error event handler.
		*
		* @private
		* @param {Error} error - server error
		* @returns {Void}
		*/
		function errorListener( error ) {
			if ( error.code === 'EADDRINUSE' ) {
				logger.info( 'Server address already in use: %s:%d.', hostname, port );
				port += 1;
				if ( port <= max ) {
					logger.info( 'Attempting to listen on %s:%d.', hostname, port );
					server.listen( port, hostname, onListen );
					return;
				}
			}
			logger.error({
				'error': error
			});
			throw error;
		} // end FUNCTION errorListener()

		/**
		* FUNCTION: onListen()
		*	Callback invoked once a server is listening and ready to handle requests.
		*
		* @private
		* @returns {Void}
		*/
		function onListen() {
			var addr = server.address();
			logger.info( 'HTTPS server initialized. Server is listening for requests on %s:%d.', addr.address, addr.port );
			done( null, server );
		} // end FUNCTION onListen()
	}; // end FUNCTION create()
} // end FUNCTION httpsServer()


// EXPORTS //

module.exports = httpsServer;
