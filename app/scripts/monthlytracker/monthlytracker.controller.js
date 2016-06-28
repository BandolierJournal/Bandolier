bulletApp.controller('MonthlyTrackerCtrl', function($scope, targetMonth, numOfDays) {
  $scope.numOfDays = numOfDays;
  var month = targetMonth[0].title;
  $scope.log = targetMonth.find(i => i.type==="month") || new Collection(month, 'month');
  $scope.cal = targetMonth.find(i => i.type==="month-cal") || new Collection(month, 'month-cal');
  $scope.monthCalBullets = $scope.cal.bullets
  $scope.monthBullets = $scope.log.bullets
  $scope.bulletList = {}
  $scope.cal.bullets.forEach(bullet => {
    $scope.bulletList[Moment(bullet.date).date()] = bullet

  })
  $scope.bulletList = $scope.numOfDays.map((day, index) => {
    if($scope.bulletList[index + 1]) return $scope.bulletList[index + 1]
    else return new Bullet.Task({date: Moment($scope.cal.title).add(index, 'days').toISOString(), collections: [$scope.cal.id]})
  })

})
