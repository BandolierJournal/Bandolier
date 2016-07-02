/*jshint esversion: 6*/

bulletApp.controller('MonthlyTrackerCtrl', function ($scope, collections, DateFactory, month, $state) {

    console.log(collections)
    $scope.daysInMonth = DateFactory.monthCal(month);
    $scope.month = month;
    $scope.log = collections.find(i => i.type === "month") || new Collection(month, 'month');
    $scope.cal = collections.find(i => i.type === "month-cal") || new Collection(month, 'month-cal');
    $scope.future = collections.find(i => i.type === "future") || new Collection(month, 'future');

    $scope.nextMonth = function() {
      $state.go($state.current, {monthString: DateFactory.nextMonth($scope.month)})
    }
    $scope.lastMonth = function() {
      $state.go($state.current, {monthString: DateFactory.lastMonth($scope.month)})
    }
});
