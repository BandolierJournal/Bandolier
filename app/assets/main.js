/*jshint node: true, esversion: 6*/
'use strict';
const PouchDB = require('pouchdb');
const db = require('./models');
const remoteDB = new PouchDB('http://localhost:5984/bullet');

const bulletApp = angular.module('bulletApp', ['ui.router', 'ui.bootstrap', 'content-editable']);

bulletApp.config(function($urlRouterProvider){
    $urlRouterProvider.otherwise('/index');
});

db.sync(remoteDB, {
    live: true,
    retry: true
});

/*jshint esversion: 6*/
bulletApp.directive('bullet', function (Bullet) {
    return {
        restrict: 'E',
        templateUrl: 'scripts/bullets/bullet.template.html',
        scope: {
            bullet: '=',
            removeFn: '&',
            collection: '='
        },
        link: function (scope, element) {
            scope.typeDict = {
                "Task": "fa-circle",
                "Event": "fa-circle-thin",
                "Note": "fa-minus",
                "Done": "fa-times"
            };

            const OS = process.platform;

            function editBullet(e) {
                if(!scope.bullet.strike) {
                    if(!scope.bullet.status || scope.bullet.status === 'incomplete') {
                        // cmd-t change to task
                        if (e.which === 84) return new Bullet.Task(scope.bullet);
                        // cmd-e change to event
                        if (e.which === 69) return new Bullet.Event(scope.bullet);
                        // cmd-n change to note
                        if (e.which === 78) return new Bullet.Note(scope.bullet);
                    }
                    // cmd-d toggle done for tasks
                    if (e.which === 68 && scope.bullet.type === 'Task') scope.bullet.toggleDone();
                }
                // cmd-x cross out
                if (e.which === 88) scope.bullet.toggleStrike();
                // cmd-del remove from collection
                if (e.which === 8) {
                    e.preventDefault();
                    scope.removeFn();
                }
                return scope.bullet;
            }

            // scope.bulletFocus = function() {
            //     if (!scope.bullet) {
            //       scope.bullet = new Bullet.Task({date: scope.collection.title, collections: [scope.collection.id]})
            //       console.log(scope.bullet)
            //     }
            // };

            element.on('keydown keypress', function (e) {
                if(e.which !== 9 && e.which !== 91) {
                    if (e.which === 13) {
                        e.preventDefault();
                        e.target.blur();
                    } else if ((OS === 'darwin' && e.metaKey) || (OS !== 'darwin' && e.ctrlKey)) {
                        scope.bullet = editBullet(e);
                        scope.bullet.save().then(() => scope.$evalAsync());
                    } else if(scope.bullet.strike || scope.bullet.status === 'complete') {
                        if(e.which !== 9) e.preventDefault();
                    }
                }
            });

            element.on('focusout', function (e) {
                scope.bullet.save();
            });
        }
    };
});

bulletApp.factory('Bullet', function(){
    var Bullet = require('./models/bullet');

    return Bullet;
});

/*jshint esversion: 6*/
bulletApp.directive('collection', function($log, Collection){
    return {
        restrict: 'E',
        templateUrl: 'scripts/collections/collection.template.html',
        scope: {
            collectionId: '@'
        },
        link: function(scope) {
            Collection.fetchById(scope.collectionId)
            .then(function(res){
                angular.extend(scope, res);
                scope.$evalAsync();
            })
            .catch($log.err);

            /**********************************************************
            * This function will remove the bullet from the collection
            * and then make sure the bullet is also removed from the
            * local bullets array.
            **********************************************************/
            scope.removeBullet = function(bullet) {
                scope.collection.removeBullet(bullet)
                .then(function(){
                    scope.bullets = scope.bullets.filter(b => b.id !== bullet.id);
                })
                .catch($log.err);
            };
        }
    };
});

bulletApp.factory('Collection', function(){
    const Collection = require('./models/collection');

    return Collection;
})

bulletApp.controller('IndexCtrl', function ($scope, collections) {
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

bulletApp.controller('MonthlyTrackerCtrl', function($scope, Collection, targetMonth, numOfDays, targetMonthCal) {
  const moment = require('moment')
  $scope.numOfDays = numOfDays
  $scope.monthCal = targetMonthCal.collection
  $scope.monthCalBullets = targetMonthCal.bullets
  $scope.monthBullets = targetMonth.bullets
  $scope.bulletList = {}
  targetMonth.bullets.forEach(bullet => {
    $scope.bulletList[moment(bullet.date).date()] = bullet
  })
})


bulletApp.config(function($stateProvider) {
  $stateProvider.state('monthlyTracker', {
    url: '/monthlytracker/:monthId/:monthCalId',
    templateUrl: 'scripts/monthlytracker/monthlytracker.template.html',
    controller: 'MonthlyTrackerCtrl',
    resolve: {
      targetMonthCal: function($stateParams, Collection) {
        return Collection.fetchById($stateParams.monthCalId)
      },
      targetMonth: function($stateParams, Collection) {
        return Collection.fetchById($stateParams.monthId)
      },
      numOfDays: function($stateParams) {
        var moment = require('moment')
        var daysInMonth = moment().month($stateParams.monthCalId).daysInMonth();
        var arrDays = [];

        while(daysInMonth) {
          var current = moment().date(daysInMonth).isoWeekday();
          current = moment().isoWeekday(current).format('ddd')
          arrDays.push(current);
          daysInMonth--;
        }
        return arrDays;
      }
    }
  })
})

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImJ1bGxldHMvYnVsbGV0LmRpcmVjdGl2ZS5qcyIsImJ1bGxldHMvYnVsbGV0LmZhY3RvcnkuanMiLCJjb2xsZWN0aW9ucy9jb2xsZWN0aW9uLmRpcmVjdGl2ZS5qcyIsImNvbGxlY3Rpb25zL2NvbGxlY3Rpb24uZmFjdG9yeS5qcyIsImluZGV4L2luZGV4LmNvbnRyb2xsZXIuanMiLCJpbmRleC9pbmRleC5zdGF0ZS5qcyIsIm1vbnRobHl0cmFja2VyL21vbnRobHl0cmFja2VyLmNvbnRyb2xsZXIuanMiLCJtb250aGx5dHJhY2tlci9tb250aGx5dHJhY2tlci5mYWN0b3J5LmpzIiwibW9udGhseXRyYWNrZXIvbW9udGhseXRyYWNrZXIuc3RhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypqc2hpbnQgbm9kZTogdHJ1ZSwgZXN2ZXJzaW9uOiA2Ki9cbid1c2Ugc3RyaWN0JztcbmNvbnN0IFBvdWNoREIgPSByZXF1aXJlKCdwb3VjaGRiJyk7XG5jb25zdCBkYiA9IHJlcXVpcmUoJy4vbW9kZWxzJyk7XG5jb25zdCByZW1vdGVEQiA9IG5ldyBQb3VjaERCKCdodHRwOi8vbG9jYWxob3N0OjU5ODQvYnVsbGV0Jyk7XG5cbmNvbnN0IGJ1bGxldEFwcCA9IGFuZ3VsYXIubW9kdWxlKCdidWxsZXRBcHAnLCBbJ3VpLnJvdXRlcicsICd1aS5ib290c3RyYXAnLCAnY29udGVudC1lZGl0YWJsZSddKTtcblxuYnVsbGV0QXBwLmNvbmZpZyhmdW5jdGlvbigkdXJsUm91dGVyUHJvdmlkZXIpe1xuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9pbmRleCcpO1xufSk7XG5cbmRiLnN5bmMocmVtb3RlREIsIHtcbiAgICBsaXZlOiB0cnVlLFxuICAgIHJldHJ5OiB0cnVlXG59KTtcbiIsIi8qanNoaW50IGVzdmVyc2lvbjogNiovXG5idWxsZXRBcHAuZGlyZWN0aXZlKCdidWxsZXQnLCBmdW5jdGlvbiAoQnVsbGV0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzY3JpcHRzL2J1bGxldHMvYnVsbGV0LnRlbXBsYXRlLmh0bWwnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgYnVsbGV0OiAnPScsXG4gICAgICAgICAgICByZW1vdmVGbjogJyYnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJz0nXG4gICAgICAgIH0sXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCkge1xuICAgICAgICAgICAgc2NvcGUudHlwZURpY3QgPSB7XG4gICAgICAgICAgICAgICAgXCJUYXNrXCI6IFwiZmEtY2lyY2xlXCIsXG4gICAgICAgICAgICAgICAgXCJFdmVudFwiOiBcImZhLWNpcmNsZS10aGluXCIsXG4gICAgICAgICAgICAgICAgXCJOb3RlXCI6IFwiZmEtbWludXNcIixcbiAgICAgICAgICAgICAgICBcIkRvbmVcIjogXCJmYS10aW1lc1wiXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBPUyA9IHByb2Nlc3MucGxhdGZvcm07XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGVkaXRCdWxsZXQoZSkge1xuICAgICAgICAgICAgICAgIGlmKCFzY29wZS5idWxsZXQuc3RyaWtlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFzY29wZS5idWxsZXQuc3RhdHVzIHx8IHNjb3BlLmJ1bGxldC5zdGF0dXMgPT09ICdpbmNvbXBsZXRlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY21kLXQgY2hhbmdlIHRvIHRhc2tcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLndoaWNoID09PSA4NCkgcmV0dXJuIG5ldyBCdWxsZXQuVGFzayhzY29wZS5idWxsZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY21kLWUgY2hhbmdlIHRvIGV2ZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS53aGljaCA9PT0gNjkpIHJldHVybiBuZXcgQnVsbGV0LkV2ZW50KHNjb3BlLmJ1bGxldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjbWQtbiBjaGFuZ2UgdG8gbm90ZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUud2hpY2ggPT09IDc4KSByZXR1cm4gbmV3IEJ1bGxldC5Ob3RlKHNjb3BlLmJ1bGxldCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gY21kLWQgdG9nZ2xlIGRvbmUgZm9yIHRhc2tzXG4gICAgICAgICAgICAgICAgICAgIGlmIChlLndoaWNoID09PSA2OCAmJiBzY29wZS5idWxsZXQudHlwZSA9PT0gJ1Rhc2snKSBzY29wZS5idWxsZXQudG9nZ2xlRG9uZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBjbWQteCBjcm9zcyBvdXRcbiAgICAgICAgICAgICAgICBpZiAoZS53aGljaCA9PT0gODgpIHNjb3BlLmJ1bGxldC50b2dnbGVTdHJpa2UoKTtcbiAgICAgICAgICAgICAgICAvLyBjbWQtZGVsIHJlbW92ZSBmcm9tIGNvbGxlY3Rpb25cbiAgICAgICAgICAgICAgICBpZiAoZS53aGljaCA9PT0gOCkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnJlbW92ZUZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBzY29wZS5idWxsZXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNjb3BlLmJ1bGxldEZvY3VzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyAgICAgaWYgKCFzY29wZS5idWxsZXQpIHtcbiAgICAgICAgICAgIC8vICAgICAgIHNjb3BlLmJ1bGxldCA9IG5ldyBCdWxsZXQuVGFzayh7ZGF0ZTogc2NvcGUuY29sbGVjdGlvbi50aXRsZSwgY29sbGVjdGlvbnM6IFtzY29wZS5jb2xsZWN0aW9uLmlkXX0pXG4gICAgICAgICAgICAvLyAgICAgICBjb25zb2xlLmxvZyhzY29wZS5idWxsZXQpXG4gICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgLy8gfTtcblxuICAgICAgICAgICAgZWxlbWVudC5vbigna2V5ZG93biBrZXlwcmVzcycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYoZS53aGljaCAhPT0gOSAmJiBlLndoaWNoICE9PSA5MSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZS53aGljaCA9PT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUudGFyZ2V0LmJsdXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgoT1MgPT09ICdkYXJ3aW4nICYmIGUubWV0YUtleSkgfHwgKE9TICE9PSAnZGFyd2luJyAmJiBlLmN0cmxLZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5idWxsZXQgPSBlZGl0QnVsbGV0KGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuYnVsbGV0LnNhdmUoKS50aGVuKCgpID0+IHNjb3BlLiRldmFsQXN5bmMoKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihzY29wZS5idWxsZXQuc3RyaWtlIHx8IHNjb3BlLmJ1bGxldC5zdGF0dXMgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGUud2hpY2ggIT09IDkpIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBlbGVtZW50Lm9uKCdmb2N1c291dCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUuYnVsbGV0LnNhdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pO1xuIiwiYnVsbGV0QXBwLmZhY3RvcnkoJ0J1bGxldCcsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIEJ1bGxldCA9IHJlcXVpcmUoJy4vbW9kZWxzL2J1bGxldCcpO1xuXG4gICAgcmV0dXJuIEJ1bGxldDtcbn0pO1xuIiwiLypqc2hpbnQgZXN2ZXJzaW9uOiA2Ki9cbmJ1bGxldEFwcC5kaXJlY3RpdmUoJ2NvbGxlY3Rpb24nLCBmdW5jdGlvbigkbG9nLCBDb2xsZWN0aW9uKXtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NjcmlwdHMvY29sbGVjdGlvbnMvY29sbGVjdGlvbi50ZW1wbGF0ZS5odG1sJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIGNvbGxlY3Rpb25JZDogJ0AnXG4gICAgICAgIH0sXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlKSB7XG4gICAgICAgICAgICBDb2xsZWN0aW9uLmZldGNoQnlJZChzY29wZS5jb2xsZWN0aW9uSWQpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHNjb3BlLCByZXMpO1xuICAgICAgICAgICAgICAgIHNjb3BlLiRldmFsQXN5bmMoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goJGxvZy5lcnIpO1xuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgcmVtb3ZlIHRoZSBidWxsZXQgZnJvbSB0aGUgY29sbGVjdGlvblxuICAgICAgICAgICAgKiBhbmQgdGhlbiBtYWtlIHN1cmUgdGhlIGJ1bGxldCBpcyBhbHNvIHJlbW92ZWQgZnJvbSB0aGVcbiAgICAgICAgICAgICogbG9jYWwgYnVsbGV0cyBhcnJheS5cbiAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgICAgICAgICBzY29wZS5yZW1vdmVCdWxsZXQgPSBmdW5jdGlvbihidWxsZXQpIHtcbiAgICAgICAgICAgICAgICBzY29wZS5jb2xsZWN0aW9uLnJlbW92ZUJ1bGxldChidWxsZXQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuYnVsbGV0cyA9IHNjb3BlLmJ1bGxldHMuZmlsdGVyKGIgPT4gYi5pZCAhPT0gYnVsbGV0LmlkKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgkbG9nLmVycik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcbn0pO1xuIiwiYnVsbGV0QXBwLmZhY3RvcnkoJ0NvbGxlY3Rpb24nLCBmdW5jdGlvbigpe1xuICAgIGNvbnN0IENvbGxlY3Rpb24gPSByZXF1aXJlKCcuL21vZGVscy9jb2xsZWN0aW9uJyk7XG5cbiAgICByZXR1cm4gQ29sbGVjdGlvbjtcbn0pXG4iLCJidWxsZXRBcHAuY29udHJvbGxlcignSW5kZXhDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgY29sbGVjdGlvbnMpIHtcbiAgJHNjb3BlLm1lc3NhZ2UgPSBcIkluZGV4IFBhZ2VcIjtcbiAgJHNjb3BlLmNvbGxlY3Rpb25zID0gY29sbGVjdGlvbnM7XG59KTtcbiIsImJ1bGxldEFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2luZGV4Jywge1xuICAgIHVybDogJy9pbmRleCcsXG4gICAgdGVtcGxhdGVVcmw6ICdzY3JpcHRzL2luZGV4L2luZGV4LnRlbXBsYXRlLmh0bWwnLFxuICAgIGNvbnRyb2xsZXI6ICdJbmRleEN0cmwnLFxuICAgIHJlc29sdmU6IHtcbiAgICAgICAgY29sbGVjdGlvbnM6IGZ1bmN0aW9uKENvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmZldGNoQWxsKCk7XG4gICAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG59KTtcbiIsImJ1bGxldEFwcC5jb250cm9sbGVyKCdNb250aGx5VHJhY2tlckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIENvbGxlY3Rpb24sIHRhcmdldE1vbnRoLCBudW1PZkRheXMsIHRhcmdldE1vbnRoQ2FsKSB7XG4gIGNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpXG4gICRzY29wZS5udW1PZkRheXMgPSBudW1PZkRheXNcbiAgJHNjb3BlLm1vbnRoQ2FsID0gdGFyZ2V0TW9udGhDYWwuY29sbGVjdGlvblxuICAkc2NvcGUubW9udGhDYWxCdWxsZXRzID0gdGFyZ2V0TW9udGhDYWwuYnVsbGV0c1xuICAkc2NvcGUubW9udGhCdWxsZXRzID0gdGFyZ2V0TW9udGguYnVsbGV0c1xuICAkc2NvcGUuYnVsbGV0TGlzdCA9IHt9XG4gIHRhcmdldE1vbnRoLmJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4ge1xuICAgICRzY29wZS5idWxsZXRMaXN0W21vbWVudChidWxsZXQuZGF0ZSkuZGF0ZSgpXSA9IGJ1bGxldFxuICB9KVxufSlcbiIsIiIsImJ1bGxldEFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ21vbnRobHlUcmFja2VyJywge1xuICAgIHVybDogJy9tb250aGx5dHJhY2tlci86bW9udGhJZC86bW9udGhDYWxJZCcsXG4gICAgdGVtcGxhdGVVcmw6ICdzY3JpcHRzL21vbnRobHl0cmFja2VyL21vbnRobHl0cmFja2VyLnRlbXBsYXRlLmh0bWwnLFxuICAgIGNvbnRyb2xsZXI6ICdNb250aGx5VHJhY2tlckN0cmwnLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIHRhcmdldE1vbnRoQ2FsOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIENvbGxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uZmV0Y2hCeUlkKCRzdGF0ZVBhcmFtcy5tb250aENhbElkKVxuICAgICAgfSxcbiAgICAgIHRhcmdldE1vbnRoOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIENvbGxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uZmV0Y2hCeUlkKCRzdGF0ZVBhcmFtcy5tb250aElkKVxuICAgICAgfSxcbiAgICAgIG51bU9mRGF5czogZnVuY3Rpb24oJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKVxuICAgICAgICB2YXIgZGF5c0luTW9udGggPSBtb21lbnQoKS5tb250aCgkc3RhdGVQYXJhbXMubW9udGhDYWxJZCkuZGF5c0luTW9udGgoKTtcbiAgICAgICAgdmFyIGFyckRheXMgPSBbXTtcblxuICAgICAgICB3aGlsZShkYXlzSW5Nb250aCkge1xuICAgICAgICAgIHZhciBjdXJyZW50ID0gbW9tZW50KCkuZGF0ZShkYXlzSW5Nb250aCkuaXNvV2Vla2RheSgpO1xuICAgICAgICAgIGN1cnJlbnQgPSBtb21lbnQoKS5pc29XZWVrZGF5KGN1cnJlbnQpLmZvcm1hdCgnZGRkJylcbiAgICAgICAgICBhcnJEYXlzLnB1c2goY3VycmVudCk7XG4gICAgICAgICAgZGF5c0luTW9udGgtLTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyRGF5cztcbiAgICAgIH1cbiAgICB9XG4gIH0pXG59KVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
