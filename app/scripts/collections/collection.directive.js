/*jshint esversion: 6*/

bulletApp.directive('collection', function($log, currentStates){
    return {
        restrict: 'E',
        templateUrl: 'scripts/collections/collection.template.html',
        scope: {
            collection: '='
        },
        link: function(scope) {
            scope.formattedTitle = formatTitle(scope.collection);
            scope.newBullet = new Bullet.Task();

            function formatTitle(collection) {
                switch(collection.type) {
                    case 'month':
                        return Moment(collection.title).format('MMMM')+' Log';
                        break;
                    case 'future':
                        return Moment(collection.title).format('MMM YY').toUpperCase();
                        break;
                    case 'day':
                        return Moment(collection.title).format('MMM DD');
                        break;
                    default:

                        return collection.title;
                }

            }

            /**********************************************************
            * This function will remove the bullet from the collection
            * and then make sure the bullet is also removed from the
            * local bullets array.
            **********************************************************/
            scope.removeBullet = function(bullet) {
                return scope.collection.removeBullet(bullet)
                .then(function(){
                  if (bullet.id) {
                    scope.collection.bullets = scope.collection.bullets.filter(b => b.id !== bullet.id);
                  }
                })
                .catch($log.err);
            };

            scope.addBullet = function(bullet) {
                if (bullet.content && bullet.content.length > 0) {
                  scope.collection.addBullet(bullet)
                  .then(function(){
                      scope.newBullet = new Bullet.Task()
                      scope.$evalAsync()
                  })
                  .catch($log.err);
              };
            }
        }
    };
});
