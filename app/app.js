'use strict';
const db = require('./models');
const bulletApp = angular.module('bulletApp', ['ui.router', 'ui.bootstrap']);

bulletApp.controller('IndexCtrl', function ($scope, $state, Collection) {
  $scope.message = "Index Page";
  
  Collection.fetchAll()
  	.then(all => {
  		$scope.collections = all;
  		$scope.$evalAsync();
  	});

	// var weekdays = ['Su', 'M', 'T', 'W', 'Th', 'F', 'S', 'Su'];

	// weekdays[d.getDay()];
	// d.toString().split(' ');


});


bulletApp.config(function ($stateProvider) {

  $stateProvider.state('index', {
    url: '/index',
    template: '<h1>{message}<h1>',
    controller: 'IndexCtrl'
  });

});
