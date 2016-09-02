/* global angular, bootbox */

angular.module('chatCtrl', ['SocketFactory'])

.controller('chatController', function($scope, Socket) {
    Socket.connect();
    $scope.users = [];
    $scope.messages = [];
    $scope.username = '';
    // $scope.msg = '';

    var promptUsername = function(message) {
        bootbox.prompt(message, function(name) {
            name = name || 'Guest' + new Date().getTime();
            if (name != null && (name = name.trim()).length > 0) {
                Socket.emit('add-user', {
                    username: name
                });
                $scope.username = name;
            }
            else {
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
    
    $scope.getMessageType = function(message) {
        if (message.systemMessage)
            return 'system-message';
        else if (message.username === $scope.username)
            return 'self-message';
        else return '';
    };

    Socket.on('users', function(data) {
        $scope.users = data.users;

        var usernameIdx = $scope.users.indexOf($scope.username);
        if (usernameIdx >= 0)
            $scope.users.splice(usernameIdx, 1);
    });

    Socket.on('message', function(data) {
        $scope.messages.push(data);
    });

    Socket.on('add-user', function(data) {
        if (data.username != $scope.username)
            $scope.users.push(data.username);
       
        $scope.messages.push({
            username: data.username,
            message: 'has entered the channel.',
            systemMessage: true
        });

    });

    Socket.on('remove-user', function(data) {
        if ($scope.users.indexOf(data.username) >= 0)
            $scope.users.splice($scope.users.indexOf(data.username), 1);

        if ($scope.username === data.username)
            $scope.username = '';

        $scope.messages.push({
            username: data.username,
            message: 'has left the chat',
            systemMessage: true
        });
    });

    Socket.on('prompt-username', function(data) {
        promptUsername(data.message);
    });

    $scope.$on('$locationChangeStart', function(event) {
        Socket.disconnect(true);
    });

    promptUsername('What is your name?');

    Socket.emit('request-users');
});