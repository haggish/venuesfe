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
            date: new Date(),
            events: {
                map: {
                    enable: ['mouseover', 'mouseout'],
                    logic: 'emit'
                }
            }
        });

        $scope.$on('leafletDirectiveMarker.mouseover',
            function (event, leafletEvent) {
                console.log("hovered on " + leafletEvent.markerName);
                $scope.selectedVenue = leafletEvent.markerName;
            });

        $scope.$on('leafletDirectiveMarker.mouseout',
            function (event, leafletEvent) {
                $scope.selectedVenue = null;
            });

        $scope.goToRoute = function() {
            for (var venue in $scope.venuesOfEvents) {
                if ($scope.venuesOfEvents.hasOwnProperty(venue)) {
                    if ($scope.venuesOfEvents[venue].inTour === true) {
                        console.log('Venue ' + venue + ' selected');
                    }
                }
            }
        };

        repo.events().then(function (events) {
            $scope.events = events;
            $scope.eventsByIDs = {};
            $scope.eventsAt = function (date) {
                return $scope.events.filter(function (event) {
                    var eventDate = new Date(event.start);
                    return eventDate.getFullYear() == date.getFullYear() &&
                        eventDate.getMonth() == date.getMonth() &&
                        eventDate.getDate() == date.getDate();
                }).map(function (event) {
                    var startDate = new Date(event.start);
                    event.startHours = startDate.getHours();
                    event.hours = function () {
                        return hour(startDate) + '-' +
                            hour(new Date(event.end));
                    };
                    $scope.eventsByIDs[event.id] = event;
                    function hour(dateWithHour) {
                        return dateWithHour.getHours() + '.' +
                            (dateWithHour.getMinutes() < 10 ?
                                ('0' + dateWithHour.getMinutes()) :
                                dateWithHour.getMinutes());
                    }

                    return event;
                }).sort(function (e1, e2) {
                    return e1.startHours - e2.startHours;
                });
            };
            repo.venues().then(function (venues) {
                $scope.venues = venues;
                refreshVenues();
                $scope.$watch('date', refreshVenues);
                $scope.$watch('selectedVenue', refreshVenues);
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
                            var venueExistsForEvent =
                                $scope.venues[event.venue] !== undefined;
                            if (!venueExistsForEvent) {
                                console.log(event.venue + " not found");
                            }
                            return venueExistsForEvent;
                        })
                        .map(function (event) {
                            var venue = $scope.venues[event.venue];
                            venue.inTour = false;
                            event.venueID = venue.id;
                            return venue;
                        });
                venuesAtDate.forEach(function (venue) {
                    $scope.venuesOfEvents[venue.id] = venue;
                });
            }
        }
    }])
    .controller('MyCtrl2', ['$scope', function ($scope) {

    }]);