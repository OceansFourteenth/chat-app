var express = require('express');
var app = express();

var http = require('http');
var httpServer = http.Server(app);
var io = require('socket.io')(httpServer);

var bodyParser = require('body-parser');
var morgan = require('morgan');

app.use(morgan('dev'));

app.use(bodyParser.json());

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

var users = [];
io.on('connection', function(socket) {
	var username = '';
	console.log('A User has connected.');
});

// future api routes

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/app/views/index.html');
});



httpServer.listen(port, function(){
	console.log('Listening on port ' + port);
});