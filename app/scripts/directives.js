'use strict';

/* Directives */


angular.module('spree.directives', []).
    directive('appVersion', ['version', function (version) {
        return function (scope, elm) {
            elm.text(version);
        };
    }]);
