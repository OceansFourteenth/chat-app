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

	socket.on('request-users', function() {
		socket.emit('users', {
			users: users
		});
	});

	socket.on('message', function(data) {
		io.emit('message', {
			username: username,
			message: data.message
		});
	});

	socket.on('add-user', function(data) {
		if (users.indexOf(data.username) === -1) {
			users.push(username = data.username);
			io.emit('add-user', {
				username: username
			});
		}
		else {
			socket.emit('prompt-username', {
				message: 'User \'' + data.username + '\' already exists.'
			});
		}
	});

	socket.on('disconnect', function() {
		console.log(username + ' has disconnected.');
		if (users.indexOf(username >= 0))
			users.splice(users.indexOf(username), 1);
		io.emit('remove-user', {
			username: username
		});
	});
});

// future api routes

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/app/views/index.html');
});



httpServer.listen(port, function() {
	console.log('Listening on port ' + port);
});