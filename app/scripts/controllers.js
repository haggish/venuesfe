'use strict';

/* Controllers */

angular.module('spree.controllers', [ 'ngSanitize' ]).
    controller('Planner', ['$scope', 'repo', function ($scope, repo) {
        angular.extend($scope, {
            center: {
                lat: 52.5167,
                lng: 13.3833,
                zoom: 12
            },
            defaults: {
                scrollWheelZoom: false
            },
            venues: []
        });

        repo.events().then(function (events) {
            $scope.events = valuesFrom(events);
            repo.venues().then(function (venues) {
                $scope.venues = valuesFrom(venues, function (venue) {
                    return events[venue.message] != undefined;
                });
            })
        });

        function valuesFrom(map, predicate) {
            var valuelist = [];
            for (var value in map) {
                if (map.hasOwnProperty(value)) {
                    if (predicate == undefined || (predicate(map[value]))) {
                        valuelist.push(map[value]);
                    }
                }
            }
            return valuelist;
        }
    }])
    .controller('MyCtrl2', ['$scope', function ($scope) {

    }]);