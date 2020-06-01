var express = require('express');
var app = express();
var port = process.env.PORT || 3002;
app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	next();
});
var distDir = __dirname + '/dist/';
app.use(express.static(distDir, { extensions: [ 'html' ] }));
app.use(cors());
app.listen(port);
