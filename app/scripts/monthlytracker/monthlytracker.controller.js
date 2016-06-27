bulletApp.controller('MonthlyTrackerCtrl', function($scope, targetMonth, numOfDays) {
  $scope.numOfDays = numOfDays;
  console.log(targetMonth);
  var month = targetMonth[0].collection.title;
  $scope.log = targetMonth.find(i => i.collection.type==="month") || new Collection(month, 'month');
  $scope.cal = targetMonth.find(i => i.collection.type==="month-cal") || new Collection(month, 'month-cal');
  $scope.monthCalBullets = $scope.cal.bullets
  $scope.monthBullets = $scope.log.bullets
  $scope.bulletList = {}
  $scope.cal.bullets.forEach(bullet => {
    $scope.bulletList[Moment(bullet.date).date()] = bullet
  })
})
