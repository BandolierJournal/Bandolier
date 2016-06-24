'use strict';

const app = angular.module('BulletJournalApp', ['ui.router']);

app.controller('IndexCtrl', function ($scope, $state, IndexFactory) {

  $scope.message = "Main Index Page";

});

app.factory('IndexFactory', function () {

  return {};
});

app.config(function ($stateProvider) {

  $stateProvider.state('index', {
    url: '/index',
    template: '<h1>{message}<h1>',
    controller: 'IndexCtrl'
    // resolve: {
    //   thePlaylist: function (PlaylistFactory, $stateParams) {
    //     return PlaylistFactory.fetchById($stateParams.playlistId);
    //   }
    
  });

});

module.exports = app;