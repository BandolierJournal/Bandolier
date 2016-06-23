bulletApp.controller('CollectionCtrl', function($scope, $log, Collection){
    Collection.fetchById(5) // TODO: This should be more dynamic
    .then(function(res){
        angular.extend($scope, res);
        $scope.$evalAsync();
    })
    .catch($log.err);
});
