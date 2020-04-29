var express = require('express');
var app = express();
var port = process.env.PORT || 3002;

app.listen(port);
var distDir = __dirname + '/dist/';
app.use(express.static(distDir));
app.get('/index', function(req, res) {
	res.sendFile(__dirname + '/index.html'); // replace /public with your directory
});
app.get('/us', function(req, res) {
	res.sendFile(__dirname + '/us.html'); // replace /public with your directory
});
