bulletApp.controller('MonthlyTrackerCtrl', function($scope, Collection, targetMonth, numOfDays, targetMonthCal, Bullet) {
  const moment = require('moment')
  $scope.numOfDays = numOfDays.reverse()
  $scope.monthCal = targetMonthCal.collection
  $scope.monthCalBullets = targetMonthCal.bullets
  $scope.monthBullets = targetMonth.bullets
  $scope.month = targetMonth.collection
  // console.log($scope.month)
  $scope.bulletList = {}
  $scope.monthCalBullets.forEach(bullet => {
    $scope.bulletList[moment(bullet.date).date()] = bullet
  })
  // console.log($scope.bulletList)
  $scope.bulletList = $scope.numOfDays.map((day, index) => {
    if($scope.bulletList[index + 1]) return $scope.bulletList[index + 1]
    else return new Bullet.Task({date: moment($scope.monthCal.title).add(index, 'days').toISOString(), collections: [$scope.monthCal.id]})
  })
  // console.log($scope.bulletList)
  // targetMonth.collection.addBullet(new Bullet.Task('Test'))
  // .then(() => $scope.$evalAsync())
})
