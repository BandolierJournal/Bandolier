bulletApp.controller('IndexCtrl', function($scope, collections, bullets, AuthFactory, DateFactory) {
    $scope.collections = collections.filter(col => (col.type === 'generic')&&!!col.title);

    if (collections.length) collections.push({type: 'month', title: DateFactory.roundDate(DateFactory.today, 'month')})
    else collections = [{type: 'month', title: DateFactory.roundDate(DateFactory.today, 'month')}]

    $scope.months = _.groupBy(collections.filter(col => col.type === 'month' || col.type === 'month-cal'), i => i.title);
    $scope.typeDict = typeDict;

    $scope.deleteCollection = function(collection) {
        collection.delete()
            .then(() => {
                let idx = $scope.collections.indexOf(collection);
                $scope.collections.splice(idx, 1);
                $scope.$evalAsync();
            });
    }
});
