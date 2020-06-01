var express = require('express');
var app = express();
var port = process.env.PORT || 3002;
var distDir = __dirname + '/dist/';
app.use(express.static(distDir, { extensions: [ 'html' ] }));
app.listen(port);
