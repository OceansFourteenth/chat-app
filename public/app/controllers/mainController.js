/* global angular */
angular.module('mainCtrl', [])

.controller('mainController', function($scope, $location) {
    $scope.isActive = function(path) {
        return path === $location.path();
    };
});