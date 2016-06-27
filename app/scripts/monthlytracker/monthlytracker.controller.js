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
