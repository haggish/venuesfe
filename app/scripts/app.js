'use strict';


// Declare app level module which depends on filters, and services
angular.module('spree', [
    'ngRoute',
    'spree.filters',
    'spree.services',
    'spree.directives',
    'spree.controllers',
    'ui.bootstrap',
    'leaflet-directive'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {templateUrl: 'views/partial1.html',
            controller: 'Planner'});
        $routeProvider.when('/view2', {templateUrl: 'views/partial2.html',
            controller: 'MyCtrl2'});
        $routeProvider.otherwise({redirectTo: '/view1'});
    }]);
