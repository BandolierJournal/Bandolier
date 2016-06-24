bulletApp.controller('MonthlyTrackerCtrl', function($scope, Collection, targetMonth, numOfDays) {
  const moment = require('moment')
  $scope.numOfDays = numOfDays
  $scope.month = targetMonth.collection
  $scope.target = targetMonth
})
