'use strict';

// MODULES //

var fs = require( 'fs' ),
	path = require( 'path' ),
	isNonNegativeInteger = require( 'validate.io-nonnegative-integer' ),
	isString = require( 'validate.io-string-primitive' ),
	isObject = require( 'validate.io-object' );


// VARIABLES //

var cwd = process.cwd();


// VALIDATE //

/**
* FUNCTION: validate( opts )
*	Validates function options.
*
* @param {Object} opts - function options
* @param {String} opts.key - path to private key
* @param {String} opts.cert - path to public certificate
* @param {Number} [opts.port] - server port
* @param {Number} [opts.maxport] - max server port
* @param {String} [opts.hostname] - server hostname
* @param {String} [opts.address] - server address
* @returns {Error|Null} error or null
*/
function validate( opts ) {
	var filepath;
	if ( !isObject( opts ) ) {
		return new TypeError( 'invalid input argument. Options argument must be an object. Value: `' + opts + '`.' );
	}
	// Get the private key for TLS/SSL...
	if ( !isString( opts.key ) ) {
		return new TypeError( 'invalid option. Key path must be a string primitive. Option: ` ' + opts.key + '`.' );
	}
	filepath = path.resolve( cwd, opts.key );
	if ( !fs.existsSync( filepath ) ) {
		return new Error( 'unable to find private key. Option: `' + opts.key + '`.' );
	}
	opts.key = fs.readFileSync( filepath, 'utf8' );

	// Get the public certificate for TLS/SSL...
	if ( !isString( opts.cert ) ) {
		return new TypeError( 'invalid option. Cert path must be a string primitive. Option: ` ' + opts.cert + '`.' );
	}
	filepath = path.resolve( cwd, opts.cert );
	if ( !fs.existsSync( filepath ) ) {
		return new Error( 'unable to find public certificate. Option: `' + opts.cert + '`.' );
	}
	opts.cert = fs.readFileSync( filepath, 'utf8' );

	// Validate remaining options...
	if ( opts.hasOwnProperty( 'port' ) ) {
		if ( !isNonNegativeInteger( opts.port ) ) {
			return new TypeError( 'invalid option. Port must be a nonnegative integer. Option: `' + opts.port + '`.' );
		}
	}
	if ( opts.hasOwnProperty( 'maxport' ) ) {
		if ( !isNonNegativeInteger( opts.maxport ) ) {
			return new TypeError( 'invalid option. Max port option must be a nonnegative integer. Option: `' + opts.maxport + '`.' );
		}
	}
	if ( opts.hasOwnProperty( 'hostname' ) ) {
		if ( !isString( opts.hostname ) ) {
			return new TypeError( 'invalid option. Hostname must be a primitive string. Option: `' + opts.hostname + '`.' );
		}
	}
	if ( opts.hasOwnProperty( 'address' ) ) {
		if ( !isString( opts.address ) ) {
			return new TypeError( 'invalid option. Address must be a primitive string. Option: `' + opts.address + '`.' );
		}
	}
	return null;
} // end FUNCTION validate()


// EXPORTS //

module.exports = validate;
