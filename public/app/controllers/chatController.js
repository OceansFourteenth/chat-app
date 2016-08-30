/* global angular, bootbox */


angular.module('chatCtrl', ['SocketFactory'])

.controller('chatController', function($scope, Socket) {
    Socket.connect();
    $scope.users = [];
    $scope.messages = [];
    // $scope.message = '';
    
    var promptUsername = function(message) {
        bootbox.prompt(message, function(name) {
            if (name != null && (name = name.trim()).length > 0) {
                Socket.emit('add-user', {username: name});
            } else {
                promptUsername('You must enter a username.');
            }
        });
    };
    
    $scope.sendMessage = function(msg) {
        if (msg != null && (msg = msg.trim()).length > 0) {
            Socket.emit('message', {
                message: msg
            });
        }
        $scope.msg = '';
    };
    
    promptUsername('What is your name?');
    
    Socket.emit('request-users', {});
    
    Socket.on('users', function(data) {
        $scope.users = data.users;
    });
    
    Socket.on('message', function(data) {
        $scope.messages.push(data.message);
    });
    
    Socket.on('add-user', function(data) {
        $scope.users.push(data.username);
        $scope.messages.push({
            username: data.username,
            message: 'has entered the channel.'
        });
    });
    
    Socket.on('remove-user', function(data) {
        if ($scope.users.indexOf(data.username) >= 0)
            $scope.users.splice($scope.users.indexOf(data.username));
        
        $scope.messages.push({
            username: data.username,
            message: 'has left the chat'
        });
    });
});