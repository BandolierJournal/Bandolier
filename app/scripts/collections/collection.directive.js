/*jshint esversion: 6*/
bulletApp.directive('collection', function($log, Collection){
    return {
        restrict: 'E',
        templateUrl: 'scripts/collections/collection.template.html',
        scope: {
            collectionId: '@'
        },
        link: function(scope) {
            Collection.fetchById(scope.collectionId)
            .then(function(res){
                angular.extend(scope, res);
                scope.$evalAsync();
            })
            .catch($log.err);

            /**********************************************************
            * This function will remove the bullet from the collection
            * and then make sure the bullet is also removed from the
            * local bullets array.
            **********************************************************/
            scope.removeBullet = function(bullet) {
                scope.collection.removeBullet(bullet)
                .then(function(){
                    scope.bullets = scope.bullets.filter(b => b.id !== bullet.id);
                })
                .catch($log.err);
            };
        }
    };
});
