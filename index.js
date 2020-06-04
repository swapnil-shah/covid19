var express = require('express');
var app = express();
var port = process.env.PORT || 3002;
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
var cors = require('cors');
app.use(cors());
var distDir = __dirname + '/dist/';
app.use(express.static(distDir, { extensions: [ 'html' ] }));
app.use(function(req, res) {
	res.status(404).render('404');
});
app.listen(port);
