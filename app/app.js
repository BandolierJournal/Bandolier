/*jshint node: true, esversion: 6*/
'use strict';

const db = require('./models');

const bulletApp = angular.module('bulletApp', ['ui.router']);

// bulletApp.controller('IndexCtrl', function ($scope, $state, IndexFactory) {
//  $scope.message = "Index Page";
//
// });
//
// bulletApp.factory('IndexFactory', function (Collection) {
//
// });
//
// bulletApp.config(function ($stateProvider) {
//
//  $stateProvider.state('index', {
//    url: '/index',
//    template: '<h1>{message}<h1>',
//    controller: 'IndexCtrl'
//  });
//
// });
