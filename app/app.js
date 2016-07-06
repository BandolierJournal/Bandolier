/*jshint node: true, esversion: 6*/
'use strict';

const bulletApp = angular.module('bulletApp', ['ui.router', 'ui.bootstrap', 'ngSanitize']);

bulletApp.config(function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/index');
    })
    .run(function ($window, $rootScope) {
        /* Connection Status Detection and Update */
        $rootScope.online = navigator.onLine;

        $window.addEventListener("offline", function () {
            $rootScope.$apply(function () {
                $rootScope.online = false;
            });
        }, false);

        $window.addEventListener("online", function () {
            $rootScope.$apply(function () {
                $rootScope.online = true;
            });
        }, false);
    });
