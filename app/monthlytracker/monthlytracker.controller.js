bulletApp.controller('MonthlyTrackerCtrl', function($scope, Collection, targetMonth) {
  $scope.month = targetMonth.collection
  $scope.target = targetMonth
})
