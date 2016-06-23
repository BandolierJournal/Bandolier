bulletApp.controller('CollectionCtrl', function($scope, $log, Collection){
    Collection.fetchById(5)
    .then(function(res){
        angular.extend($scope, res);
        $scope.$evalAsync();
    })
    .catch($log.err);
});
