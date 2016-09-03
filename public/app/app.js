/* global angular */

angular.module('myApp', [
    'ngRoute',
    'ui.bootstrap',
    'btford.socket-io',
    'mainCtrl',
    'demoCtrl'])

.config(function($routeProvider, $locationProvider) {
    $routeProvider
    
    .when('/', {
        templateUrl: 'app/views/pages/home.html'
    })
    
    .when('/demo', {
        templateUrl: 'app/views/pages/demo.html',
        controller: 'chatController',
    })
    
    .when('/chat', {
        redirectTo: '/demo'
    })
    
    .otherwise({ redirectTo: '/'});
    
    $locationProvider.html5Mode(true);
});