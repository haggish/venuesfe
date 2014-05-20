'use strict';

/* Controllers */

angular.module('spree.controllers', [ 'spree.filters', 'ngSanitize' ])
    .controller('Planner', ['$scope', 'repo', function ($scope, repo) {

        angular.extend($scope, {
            map: {
                center: {
                    latitude: 52.5167,
                    longitude: 13.3833
                },
                zoom: 12,
                ctrl: {},
                events: {
                    'mouseover': function (map, event, marker) {
                        $scope.selectedVenue = marker.id;
                        $scope.$apply();
                    },
                    'mouseout': function () {
                        $scope.selectedVenue = null;
                        $scope.$apply();
                    }
                }
            },
            date: new Date(),
            venues: {},
            venuesOfEventsAt: { 'loading': true },
            markers: []
        });


        $scope.$watch('date', function () {
            if ($scope.venuesOfEventsAt.loading === undefined) {
                $scope.markers =
                    $scope.venuesOfEventsAt[$scope.selectedDate()];
            }
        });

        $scope.selectedDate = function () {
            return $scope.date.toDateString();
        };

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
                addEventsTo(venues);
                $scope.markers =
                    $scope.venuesOfEventsAt[$scope.selectedDate()];
            });

            function addEventsTo(venues) {
                $scope.events.forEach(function (event) {
                    if (event.venueID !== undefined) {
                        var venue = venues[event.venueID + ''];
                        if (venue !== undefined) {
                            if (venue.events === undefined) {
                                venue.events = [];
                            }
                            var dateString = event.startDate.toDateString();
                            if ($scope.venuesOfEventsAt[dateString] === undefined) {
                                $scope.venuesOfEventsAt[dateString] = [];
                            }
                            venue.latitude = venue.lat;
                            venue.longitude = venue.lng;
                            $scope.venuesOfEventsAt[dateString].push(venue);
                            venue.events.push(event);
                        }
                    }
                });
                delete $scope.venuesOfEventsAt.loading;
            }
        });
    }])
    .controller('MyCtrl2', ['$scope', function ($scope) {
        $scope.todo = true;
    }]);