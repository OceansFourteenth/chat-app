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
    
    .otherwise({ redirectTo: '/'});
    
    $locationProvider.html5Mode(true);
});