var express = require('express');
var app = express();
var port = process.env.PORT || 3002;
var cors = require('cors');
var distDir = __dirname + '/dist/';
app.use(express.static(distDir, { extensions: [ 'html' ] }));
app.use(cors());
app.listen(port);
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
