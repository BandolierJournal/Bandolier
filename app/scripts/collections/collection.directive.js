/*jshint esversion: 6*/
bulletApp.directive('collection', function($log){
    return {
        restrict: 'E',
        templateUrl: 'scripts/collections/collection.template.html',
        scope: {
            collectionId: '@',
            props: '='
        },
        link: function(scope) {
            Collection.fetchById(scope.collectionId)
            .then(function(res){
                angular.extend(scope, res);
                formatTitle(scope.collection);
                scope.$evalAsync();
            })
            .catch(function(err) {
                scope.collection = new Collection(scope.props);
                formatTitle(scope.collection);
                scope.$evalAsync();
            });

            function formatTitle(collection) {
                switch(collection.type) {
                    case 'month':
                        collection.title = Moment(collection.title).format('MMMM')+' Log';
                        break;
                    case 'future':
                        collection.title = Moment(collection.title).format('MMM YY').toUpperCase();
                        break;
                    case 'day':
                        collection.title = Moment(collection.title).format('MMM DD');
                        break;
                    default:
                }

            }

            
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
