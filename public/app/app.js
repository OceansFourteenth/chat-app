/* global angular */

angular.module('myApp', [
    'ngRoute',
    'ui.bootstrap',
    'btford.socket-io',
    'chatCtrl'])

.config(function($routeProvider, $locationProvider) {
    $routeProvider
    
    .when('/', {
        templateUrl: 'app/views/pages/home.html'
    })
    
    .when('/chat', {
        templateUrl: 'app/views/pages/chat.html',
        controller: 'chatController',
        controllerAs: 'chat'
    })
    
    .otherwise({ redirectTo: '/'});
    
    $locationProvider.html5Mode(true);
});