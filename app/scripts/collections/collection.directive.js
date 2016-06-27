bulletApp.directive('collection', function($log, Collection){
    return {
        restrict: 'E',
        templateUrl: 'scripts/collections/collection.template.html',
        scope: {
            collectionId: '@'
        },
        link: function(scope) {
            Collection.fetchById(+scope.collectionId)
            .then(function(res){
                angular.extend(scope, res);
                scope.$evalAsync();
            })
            .catch($log.err);
        }
    };
});
