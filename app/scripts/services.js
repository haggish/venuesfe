'use strict';

angular.module('spree.services', [])
    .value('version', '0.1')
    .service('entityFactory', function () {

        this.venueFrom = function (place) {
            return {
                lat: parseFloat(place.lat),
                lng: parseFloat(place.lng),
                message: place.title,
                infoText: place.infoText,
                status: place.status,
                id: place.id
                /*
                 lat: function () {
                 return parseFloat(place.lat);
                 },
                 lng: function () {
                 return parseFloat(place.lng);
                 },
                 message: function () {
                 return place.title;
                 },
                 infoText: function () {
                 return place.infoText;
                 },
                 status: function () {
                 return place.status;
                 },
                 id: function () {
                 return place.id;
                 }*/
            };
        };

        this.eventFrom = function (venuesItemElement) {
            var id = $('#venueName', venuesItemElement).attr('venueid')
                .replace(/\s+/g, ' ');
            var venue = $('#venueName', venuesItemElement).text()
                .replace(/\s+/g, ' ');
            var date = $('.mapExhibitions > div > div', venuesItemElement)
                .first().text().replace(/\s+/g, ' ');
            if (date.indexOf(' *') != -1) {
                date = date.substr(0, date.indexOf(' *'));
            }
            date = parse(date);
            $('.mapExhibitions', venuesItemElement).remove();
            var desc = $('.col3', venuesItemElement).html()
                .replace(/\s+/g, ' ');
            //console.log(id + ' ' + date + ' ' + venue);

            return event(id, date, desc, venue);

            function event(givenID, givenDate, givenDesc, venue) {
                return {
                    id: function () {
                        return givenID;
                    },
                    date: function () {
                        return givenDate;
                    },
                    desc: function () {
                        return givenDesc;
                    },
                    venue: function () {
                        return venue;
                    }
                }
            }

            function parse(date) {
                date = date.trim();
                var day = parseInt(date.substr(0, 2));
                var month = parseMonth(date.substr(3, 3));
                var year = parseInt(date.substr(7, 4));
                return new Date(year, month, day);
            }

            function parseMonth(month) {
                var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
                    "Aug", "Sep", "Oct", "Nov", "Dec"];
                return months.indexOf(month) + 1;
            }
        };
    })
    .service('repo', [ '$q', '$http', 'entityFactory',

        function ($q, $http, entityFactory) {

            var repo = this;

            this.venues = function () {
                var deferred = $q.defer(), ret = {};
                $http.get('places/berlinGalleries.json')
                    .then(function (response) {
                        response.data.markers.forEach(function (place) {
                            ret[place.title] = entityFactory.venueFrom(place);
                        });
                        deferred.resolve(ret);
                    });
                return deferred.promise;
            };

            this.events = function () {
                var deferred = $q.defer(), ret = {};
                $http.get('places/openingsAndEvents.html')
                    .then(function (response) {
                        $('.venuesItem', response.data).each(function (idx, e) {
                            var event = entityFactory.eventFrom(e);
                            ret[event.venue()] = event;
                        });
                        deferred.resolve(ret);
                    });
                return deferred.promise;
            };
        }]);

