#!/usr/bin/env node

/**
 * Module dependencies/
 */
var fs = require( 'fs' ),
	path = require( 'path' ),
	env = process.env.CALYPSO_ENV || 'development',
	filename = env + '.json',
	configPath = path.resolve( __dirname, '..', '..', 'config', filename ),
	keysPath = path.resolve( __dirname, '..', '..', 'config', 'client.json' ),
	data = JSON.parse( fs.readFileSync( configPath, 'utf8' ) ),
	keys = JSON.parse( fs.readFileSync( keysPath, 'utf8' ) ),
	enabledFeatures = process.env.ENABLE_FEATURES ? process.env.ENABLE_FEATURES.split(',') : [],
	disabledFeatures = process.env.DISABLE_FEATURES ? process.env.DISABLE_FEATURES.split(',') : [],
	obj = {};

keys.forEach(function( key ) {
	if ( key in data ) {
		obj[ key ] = data[ key ];
	}
});

if ( obj.hasOwnProperty( 'features' ) ) {
	enabledFeatures.forEach( function( feature ) {
		obj.features[ feature ] = true;
	} );
	disabledFeatures.forEach( function( feature ) {
		obj.features[ feature ] = false;
	} );
}

console.log( '/* This file is automatically generated. Do not edit manually. */' );
console.log();
console.log( 'var filename = %j;', filename );
console.log( 'var data = %s;', JSON.stringify( obj, null, 2 ) );
console.log( config.toString() );
console.log( isEnabled.toString() );
console.log( anyEnabled.toString() );
console.log( 'module.exports = config;' );
console.log( 'module.exports.isEnabled = isEnabled;' );
console.log( 'module.exports.anyEnabled = anyEnabled;' );

function config( key ) {
	if ( key in data ) {
		return data[ key ];
	}
	throw new Error( 'config key `' + key + '` does not exist in "' + filename + '"' );
}

function isEnabled( feature ) {
	return !! data.features[ feature ];
}

function anyEnabled() {
	var args = Array.prototype.slice.call( arguments );
	return args.some( function( feature ) {
		return !! data.features[ feature ];
	} );
}