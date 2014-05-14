'use strict';

/* Filters */

angular.module('spree.filters', [])
    .filter('interpolate', ['version', function (version) {
        return function (text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        }
    }])
    .filter('ofEventsAt', function () {
        var markerObjects = {}, nothing = [];
        return function (venues, date) {
            if (venues.loading !== undefined) {
                return nothing;
            }
            if (markerObjects[date.toDateString()] !== undefined) {
                return markerObjects[date.toDateString()];
            }
            var markerObject = {};
            if (venues) {
                for (var venueID in venues) {
                    if (venues.hasOwnProperty(venueID) &&
                        venues[venueID].hasEventAt(date)) {
                        markerObject[venueID] = venues[venueID];
                    }
                }
                markerObjects[date.toDateString()] = markerObject;
            }
            return markerObject;
        };
    });
