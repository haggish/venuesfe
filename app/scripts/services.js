'use strict';

angular.module('spree.services', [])
    .value('version', '0.1')
    .service('repo', [ '$q', '$http',

        function ($q, $http, entityFactory) {

            this.venues = function () {
                var deferred = $q.defer(), ret = {};
                $http.get('http://localhost:3000/venues')
                    .then(function (response) {
                        response.data.venues.forEach(function (venue) {
                            ret[venue.title] = venue;
                        });
                        deferred.resolve(ret);
                    });
                return deferred.promise;
            };

            this.events = function () {
                var deferred = $q.defer(), ret = [];
                $http.get('http://localhost:3000/events')
                    .then(function (response) {
                        response.data.events.forEach(function (event) {
                            ret.push(event);
                        });
                        deferred.resolve(ret);
                    });
                return deferred.promise;
            };
        }]);

