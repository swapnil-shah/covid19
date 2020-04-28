var express = require('express');
var app = express();
var port = process.env.PORT || 3002;
require('dotenv').config();
app.listen(port);
var distDir = __dirname + '/dist/';
app.use(express.static(distDir));
