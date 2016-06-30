bulletApp.controller('IndexCtrl', function($scope, collections) {
    $scope.collections = collections.filter(col => col.type === 'generic');
    $scope.months = _.groupBy(collections.filter(col => col.type === 'month' || col.type === 'month-cal'), i => i.title);

});
