var express = require('express');
var app = express();
var mongoose = require('mongoose');
var httpServer = require('http').Server(app);
var io = require('socket.io')(httpServer);
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');

mongoose.connect(config.database);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

var users = [];
io.on('connection', function(socket) {
	var username = '';
	// console.log('A User has connected.');

	socket.on('request-users', function() {
		socket.emit('users', {
			users: users
		});
	});

	socket.on('message', function(data) {
		io.emit('message', {
			username: username,
			message: data.message,
			systemMessage: false
		});
	});

	socket.on('add-user', function(data) {
		if (users.indexOf(data.username) === -1) {
			users.push(username = data.username);
			console.log('User \'' + username + '\' has connected.');
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
		console.log('User \'' + username + '\' has disconnected.');

		if (users.indexOf(username) >= 0)
			users.splice(users.indexOf(username), 1);

		io.emit('remove-user', {
			username: username
		});
	});
});

// future api routes

app.get('*', function(req, res) {
	res.sendFile(__dirname + '/public/app/views/index.html');
});

httpServer.listen(config.port, function() {
	console.log('Listening on port ' + config.port);
});