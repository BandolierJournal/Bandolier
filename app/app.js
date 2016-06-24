'use strict';
const db = require('./models');
const bulletApp = angular.module('bulletApp', ['ui.router', 'ui.bootstrap']);

bulletApp.controller('IndexCtrl', function ($scope, $state, Collection) {
  $scope.message = "Index Page";
  
  Collection.fetchAll()
  	.then(all => {
  		$scope.collections = all;
  		$scope.$evalAsync();
  		console.log($scope.collections);
  	});

});


bulletApp.config(function ($stateProvider) {

  $stateProvider.state('index', {
    url: '/index',
    template: '<h1>{message}<h1>',
    controller: 'IndexCtrl'
  });

});
