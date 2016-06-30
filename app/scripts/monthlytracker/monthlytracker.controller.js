/*jshint esversion: 6*/
bulletApp.controller('MonthlyTrackerCtrl', function ($scope, collections, DateFactory, month) {

    $scope.numOfDays = DateFactory.monthCal(month);
    $scope.month = month;
    $scope.log = collections.find(i => i.type === "month") || new Collection(month, 'month');
    $scope.cal = collections.find(i => i.type === "month-cal") || new Collection(month, 'month-cal');

});
