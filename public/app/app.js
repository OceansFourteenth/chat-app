/* global angular */

angular.module('myApp', [
    'ngRoute',
    'ui.bootstrap',
    'btford.socket-io',
    'mainCtrl',
    'chatCtrl'])

.config(function($routeProvider, $locationProvider) {
    $routeProvider
    
    .when('/', {
        templateUrl: 'app/views/pages/home.html'
    })
    
    .when('/demo', {
        templateUrl: 'app/views/pages/chat.html',
        controller: 'chatController',
    })
    
    .when('/chat', {
        redirectTo: '/demo'
    })
    
    .otherwise({ redirectTo: '/'});
    
    $locationProvider.html5Mode(true);
});