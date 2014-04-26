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
            venuesOfEvents: {},
            date: new Date()
        });

        repo.events().then(function (events) {
            $scope.events = events;
            $scope.eventsAt = function (date) {
                return $scope.events.filter(function (event) {
                    var eventDate = new Date(event.start);
                    return eventDate.getFullYear() == date.getFullYear() &&
                        eventDate.getMonth() == date.getMonth() &&
                        eventDate.getDate() == date.getDate();
                })
            };
            repo.venues().then(function (venues) {
                $scope.venues = venues;
                refreshVenues();
                $scope.$watch('date', function (newValue, oldValue) {
                    refreshVenues();
                })
            })
        });

        function refreshVenues() {
            clearVenues();
            initVenuesToChosenDate();

            function clearVenues() {
                for (var venue in $scope.venuesOfEvents) {
                    if ($scope.venuesOfEvents.hasOwnProperty(venue)) {
                        delete $scope.venuesOfEvents[venue];
                    }
                }
            }

            function initVenuesToChosenDate() {
                var venuesAtDate =
                    $scope.eventsAt($scope.date)
                        .filter(function (event) {
                            var venueForEvent =
                                $scope.venues[event.venue] !== undefined;
                            if (!venueForEvent) {
                                console.log(event.venue + " not found");
                            }
                            return venueForEvent;
                        })
                        .map(function (event) {
                            return $scope.venues[event.venue];
                        });
                venuesAtDate.forEach(function (event) {
                    $scope.venuesOfEvents[event.id] = event;
                });
            }
        }
    }])
    .controller('MyCtrl2', ['$scope', function ($scope) {

    }]);