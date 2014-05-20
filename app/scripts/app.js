'use strict';


// Declare app level module which depends on filters, and services
angular.module('spree', [
    'ngRoute',
    'google-maps',
    'spree.filters',
    'spree.services',
    'spree.directives',
    'spree.controllers',
    'ui.bootstrap'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/pick', {templateUrl: '../views/pick.html',
            controller: 'Planner'});
        $routeProvider.when('/view2', {templateUrl: 'views/partial2.html',
            controller: 'MyCtrl2'});
        $routeProvider.otherwise({redirectTo: '/pick'});
    }]);
