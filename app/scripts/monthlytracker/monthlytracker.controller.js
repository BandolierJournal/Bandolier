/*jshint esversion: 6*/
bulletApp.controller('MonthlyTrackerCtrl', function ($scope, targetMonth, numOfDays) {
    $scope.numOfDays = numOfDays;
    let month = targetMonth[0].title;
    $scope.log = targetMonth.find(i => i.type === "month") || new Collection(month, 'month');
    $scope.cal = targetMonth.find(i => i.type === "month-cal") || new Collection(month, 'month-cal');
    $scope.monthCalBullets = $scope.cal.bullets;
});
