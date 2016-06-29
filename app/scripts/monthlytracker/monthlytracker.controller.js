bulletApp.controller('MonthlyTrackerCtrl', function($scope, targetMonth, numOfDays) {
  $scope.numOfDays = numOfDays;
  var month = targetMonth[0].collection.title;   // eventually  let month = targetMonth[0].title;
  $scope.log = targetMonth.find(i => i.collection.type==="month") || new Collection(month, 'month');  //eventually $scope.log = targetMonth.find(i => i.type==="month") || new Collection(month, 'month');
  $scope.cal = targetMonth.find(i => i.collection.type==="month-cal") || new Collection(month, 'month-cal');
  $scope.monthCalBullets = $scope.cal.bullets
})
