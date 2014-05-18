'use strict';

angular.module('spree.services', [])
    .value('version', '0.1')

    .service('time', function () {
        this.hour = function (dateWithHour) {
            return dateWithHour.getHours() + '.' +
                (dateWithHour.getMinutes() < 10 ?
                    ('0' + dateWithHour.getMinutes()) :
                    dateWithHour.getMinutes());
        };
    })

    .service('domain', [ 'time', function (time) {
        this.venue = function (data) {
            return angular.extend({
                hasEventAt: hasEventAt
            }, data);
        };

        this.event = function (data) {
            var extension = {};
            var startDate = new Date(data.start);
            extension.startHours = startDate.getHours();
            extension.hours = function () {
                return time.hour(startDate) + '-' +
                    time.hour(new Date(data.end));
            };
            extension.happensAt = happensAt;
            return angular.extend(extension, data);
        };

        function happensAt(date) {
            var eventDate = new Date(this.start);
            return eventDate.getFullYear() === date.getFullYear() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getDate() === date.getDate();
        }

        function hasEventAt(date) {
            if (this.events === undefined) {
                return false;
            }
            return this.events.filter(function (event) {
                return event.happensAt(date);
            }).length > 0;
        }
    }])

    .service('repo', [ '$q', '$http', 'domain', function ($q, $http, domain) {

        this.venues = function () {
            var deferred = $q.defer(), ret = {};
            $http.get('http://localhost:3000/venues')
                .then(function (response) {
                    response.data.venues.forEach(function (venueData) {
                        ret[venueData.id] = domain.venue(venueData);
                    });
                    deferred.resolve(ret);
                });
            return deferred.promise;
        };

        this.events = function () {
            var deferred = $q.defer(), ret = [];
            this.venues().then(function (venues) {
                var venuesByTitles = {};
                for (var venue in venues) {
                    if (venues.hasOwnProperty(venue)) {
                        venuesByTitles[venues[venue].title] = venues[venue];
                    }
                }
                $http.get('http://localhost:3000/events')
                    .then(function (response) {
                        response.data.events.forEach(function (eventData) {
                            venue = venuesByTitles[eventData.venue];
                            if (venue !== undefined) {
                                eventData.venueID = venue.id;
                            }
                            ret.push(domain.event(eventData));
                        });
                        deferred.resolve(ret);
                    });
            });
            return deferred.promise;
        };
    }]);

