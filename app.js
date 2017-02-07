'use strict';

var app = function () {

	var fs = require('fs');
	var http = require('http');
	var micalevisk_bot = require('./micalevisk_bot'); /// auto run

	var packageFile = JSON.parse( fs.readFileSync("package.json") )

	var app = http.createServer( function(req, res) {

		res.writeHead(200, {'Content-Type': 'application/json'});
		res.write(JSON.stringify( packageFile ))
		res.end();

	});

	return app;
}();

module.exports = app;
