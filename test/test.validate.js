/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	path = require( 'path' ),
	validate = require( './../lib/validate.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// MOCKS //

var keypath, certpath;

keypath = path.join( __dirname, 'fixtures/key.pem' );
certpath = path.join( __dirname, 'fixtures/cert.pem' );


// TESTS //

describe( 'validate', function tests() {

	it( 'should export a function', function test() {
		expect( validate ).to.be.a( 'function' );
	});

	it( 'should return an error if provided an options argument which is not an object', function test() {
		var values,
			i;

		values = [
			'5',
			5,
			true,
			undefined,
			null,
			NaN,
			function(){},
			[]
		];

		for ( i = 0; i < values.length; i++ ) {
			assert.isTrue( validate( values[ i ] ) instanceof TypeError );
		}
	});

	it( 'should return an error if provided a `key` option which is not a primitive string', function test() {
		var values, err, i;

		values = [
			5,
			true,
			undefined,
			null,
			NaN,
			[],
			{},
			function(){}
		];

		for ( i = 0; i < values.length; i++ ) {
			err = validate({
				'key': values[ i ],
				'cert': certpath
			});
			assert.isTrue( err instanceof TypeError );
		}
	});

	it( 'should return an error if unable to load a private key from a specified path', function test() {
		var err;

		err = validate({
			'key': 'dakfajf',
			'cert': certpath
		});
		assert.isTrue( err instanceof Error );
	});

	it( 'should return an error if provided a `cert` option which is not a primitive string', function test() {
		var values, err, i;

		values = [
			5,
			true,
			undefined,
			null,
			NaN,
			[],
			{},
			function(){}
		];

		for ( i = 0; i < values.length; i++ ) {
			err = validate({
				'key': keypath,
				'cert': values[ i ]
			});
			assert.isTrue( err instanceof TypeError );
		}
	});

	it( 'should return an error if unable to load a public certificate from a specified path', function test() {
		var err;

		err = validate({
			'key': keypath,
			'cert': 'dakfdjalfdka'
		});
		assert.isTrue( err instanceof Error );
	});

	it( 'should return an error if provided a `port` option which is not a nonnegative integer', function test() {
		var values, err, i;

		values = [
			-5,
			Math.PI,
			'5',
			undefined,
			null,
			NaN,
			true,
			[],
			{},
			function(){}
		];

		for ( i = 0; i < values.length; i++ ) {
			err = validate({
				'key': keypath,
				'cert': certpath,
				'port': values[ i ]
			});
			assert.isTrue( err instanceof TypeError );
		}
	});

	it( 'should return an error if provided a `maxport` option which is not a nonnegative integer', function test() {
		var values, err, i;

		values = [
			-5,
			Math.PI,
			'5',
			undefined,
			null,
			NaN,
			true,
			[],
			{},
			function(){}
		];

		for ( i = 0; i < values.length; i++ ) {
			err = validate({
				'key': keypath,
				'cert': certpath,
				'maxport': values[ i ]
			});
			assert.isTrue( err instanceof TypeError );
		}
	});

	it( 'should return an error if provided a `hostname` option which is not a string primitive', function test() {
		var values, err, i;

		values = [
			5,
			true,
			undefined,
			null,
			NaN,
			[],
			{},
			function(){}
		];

		for ( i = 0; i < values.length; i++ ) {
			err = validate({
				'key': keypath,
				'cert': certpath,
				'hostname': values[ i ]
			});
			assert.isTrue( err instanceof TypeError );
		}
	});

	it( 'should return an error if provided an `address` option which is not a string primitive', function test() {
		var values, err, i;

		values = [
			5,
			true,
			undefined,
			null,
			NaN,
			[],
			{},
			function(){}
		];

		for ( i = 0; i < values.length; i++ ) {
			err = validate({
				'key': keypath,
				'cert': certpath,
				'address': values[ i ]
			});
			assert.isTrue( err instanceof TypeError );
		}
	});

	it( 'should return null if all options are valid', function test() {
		var err;

		err = validate({
			'key': keypath,
			'cert': certpath,
			'port': 7331,
			'maxport': 9999,
			'hostname': 'localhost',
			'address': '127.0.0.1'
		});

		assert.isNull( err );

		err = validate({
			'key': keypath,
			'cert': certpath,
			'beep': true, // misc options
			'boop': 'bop'
		});

		assert.isNull( err );
	});

});
