'use strict';
const PouchDB = require('pouchdb');
const db = require('./models');
const bulletApp = angular.module('bulletApp', ['ui.router', 'ui.bootstrap']);
const remoteDB = new PouchDB('http://localhost:5984/bullet');

db.sync(remoteDB, {
  live: true,
  retry: true
});

bulletApp.config(function($urlRouterProvider){
    $urlRouterProvider.otherwise('/index')
});

bulletApp.directive('collection', function($log, Collection){
    return {
        restrict: 'E',
        templateUrl: 'scripts/collections/collection.template.html',
        scope: {
            collectionId: '@'
        },
        link: function(scope) {
            Collection.fetchById(+scope.collectionId)
            .then(function(res){
                angular.extend(scope, res);
                scope.$evalAsync();
            })
            .catch($log.err);
        }
    };
});

bulletApp.factory('Collection', function(){
    const Collection = require('./models/collection');

    return Collection;
})

bulletApp.controller('IndexCtrl', function ($scope, $state, collections) {
  $scope.message = "Index Page";
  $scope.collections = collections; 
});

bulletApp.config(function ($stateProvider) {

  $stateProvider.state('index', {
    url: '/index',
    templateUrl: 'scripts/index/index.template.html',
    controller: 'IndexCtrl',
    resolve: {
        collections: function(Collection) {
            return Collection.fetchAll();
        }
    }
  });

});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbGxlY3Rpb25zL2NvbGxlY3Rpb24uZGlyZWN0aXZlLmpzIiwiY29sbGVjdGlvbnMvY29sbGVjdGlvbi5mYWN0b3J5LmpzIiwiaW5kZXgvaW5kZXguY29udHJvbGxlci5qcyIsImluZGV4L2luZGV4LnN0YXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5jb25zdCBQb3VjaERCID0gcmVxdWlyZSgncG91Y2hkYicpO1xuY29uc3QgZGIgPSByZXF1aXJlKCcuL21vZGVscycpO1xuY29uc3QgYnVsbGV0QXBwID0gYW5ndWxhci5tb2R1bGUoJ2J1bGxldEFwcCcsIFsndWkucm91dGVyJywgJ3VpLmJvb3RzdHJhcCddKTtcbmNvbnN0IHJlbW90ZURCID0gbmV3IFBvdWNoREIoJ2h0dHA6Ly9sb2NhbGhvc3Q6NTk4NC9idWxsZXQnKTtcblxuZGIuc3luYyhyZW1vdGVEQiwge1xuICBsaXZlOiB0cnVlLFxuICByZXRyeTogdHJ1ZVxufSk7XG5cbmJ1bGxldEFwcC5jb25maWcoZnVuY3Rpb24oJHVybFJvdXRlclByb3ZpZGVyKXtcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvaW5kZXgnKVxufSk7XG4iLCJidWxsZXRBcHAuZGlyZWN0aXZlKCdjb2xsZWN0aW9uJywgZnVuY3Rpb24oJGxvZywgQ29sbGVjdGlvbil7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzY3JpcHRzL2NvbGxlY3Rpb25zL2NvbGxlY3Rpb24udGVtcGxhdGUuaHRtbCcsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICBjb2xsZWN0aW9uSWQ6ICdAJ1xuICAgICAgICB9LFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSkge1xuICAgICAgICAgICAgQ29sbGVjdGlvbi5mZXRjaEJ5SWQoK3Njb3BlLmNvbGxlY3Rpb25JZClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5leHRlbmQoc2NvcGUsIHJlcyk7XG4gICAgICAgICAgICAgICAgc2NvcGUuJGV2YWxBc3luYygpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgkbG9nLmVycik7XG4gICAgICAgIH1cbiAgICB9O1xufSk7XG4iLCJidWxsZXRBcHAuZmFjdG9yeSgnQ29sbGVjdGlvbicsIGZ1bmN0aW9uKCl7XG4gICAgY29uc3QgQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vbW9kZWxzL2NvbGxlY3Rpb24nKTtcblxuICAgIHJldHVybiBDb2xsZWN0aW9uO1xufSlcbiIsImJ1bGxldEFwcC5jb250cm9sbGVyKCdJbmRleEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsIGNvbGxlY3Rpb25zKSB7XG4gICRzY29wZS5tZXNzYWdlID0gXCJJbmRleCBQYWdlXCI7XG4gICRzY29wZS5jb2xsZWN0aW9ucyA9IGNvbGxlY3Rpb25zOyBcbn0pO1xuIiwiYnVsbGV0QXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaW5kZXgnLCB7XG4gICAgdXJsOiAnL2luZGV4JyxcbiAgICB0ZW1wbGF0ZVVybDogJ3NjcmlwdHMvaW5kZXgvaW5kZXgudGVtcGxhdGUuaHRtbCcsXG4gICAgY29udHJvbGxlcjogJ0luZGV4Q3RybCcsXG4gICAgcmVzb2x2ZToge1xuICAgICAgICBjb2xsZWN0aW9uczogZnVuY3Rpb24oQ29sbGVjdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uZmV0Y2hBbGwoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
