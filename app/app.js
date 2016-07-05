/*jshint node: true, esversion: 6*/
'use strict';

const bulletApp = angular.module('bulletApp', ['ui.router', 'ui.bootstrap', 'ngSanitize']);

bulletApp.config(function($urlRouterProvider){
    $urlRouterProvider.otherwise('/index');
});
