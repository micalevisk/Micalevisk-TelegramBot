'use strict';

var fs = require('fs');
var http = require('http');

var packageFile = JSON.parse( fs.readFileSync("package.json") )
var port = (process.env.PORT || 5000); // para testes: http://localhost:5000

require('./micalevisk_bot')();


http.createServer(function(req, res) {

	res.writeHead(200, {'Content-Type': 'application/json'});
	res.write(JSON.stringify( packageFile ))
	res.end();


}).listen(port);
