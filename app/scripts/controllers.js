'use strict';

/* Controllers */

angular.module('spree.controllers', [ 'ngSanitize' ])
    .controller('Planner', ['$scope', 'repo', function ($scope, repo) {

        angular.extend($scope, {
            center: {
                lat: 52.5167,
                lng: 13.3833,
                zoom: 12
            },
            defaults: {
                scrollWheelZoom: false
            },
            date: new Date(),
            events: {
                map: {
                    enable: ['mouseover', 'mouseout'],
                    logic: 'emit'
                }
            },
            venues: { 'loading': true }
        });

        $scope.$on('leafletDirectiveMarker.mouseover',
            function (event, leafletEvent) {
                console.log('hovered on ' + leafletEvent.markerName);
                $scope.selectedVenue = leafletEvent.markerName;
            });

        $scope.$on('leafletDirectiveMarker.mouseout',
            function () {
                $scope.selectedVenue = null;
            });

        $scope.goToRoute = function () {
            for (var venue in $scope.venues) {
                if ($scope.venues.hasOwnProperty(venue)) {
                    if ($scope.venues[venue].inTour === true) {
                        console.log('Venue ' + venue + ' selected');
                    }
                }
            }
        };

        $scope.atChosenDate = function (event) {
            var eventDate = new Date(event.start);
            var date = $scope.date;
            return eventDate.getFullYear() === date.getFullYear() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getDate() === date.getDate();
        };

        repo.events().then(function (events) {
            $scope.events = events;
            repo.venues().then(function (venues) {
                angular.copy(venues, $scope.venues);
                events.forEach(function (event) {
                    var venue = $scope.venues[event.venueID];
                    if (venue !== undefined) {
                        if (venue.events === undefined) {
                            venue.events = [];
                        }
                        venue.events.push(event);
                    }
                });
                delete($scope.venues.loading);
            });
        });
    }])
    .controller('MyCtrl2', ['$scope', function ($scope) {
        $scope.todo = true;
    }]);