/*jshint esversion: 6*/

bulletApp.directive('collection', function($log, currentStates, DateFactory){
    return {
        restrict: 'E',
        templateUrl: 'scripts/collections/collection.template.html',
        scope: {
            collection: '='
        },
        link: function(scope) {
            scope.formattedTitle = formatTitle(scope.collection);
            scope.newBullet = new Bullet.Task({date: scope.collection.title});

            function formatTitle(collection) {
                switch(collection.type) {
                    case 'month':
                        return 'Log'; //Moment(collection.title).format('MMMM')+' Log';
                        break;
                    case 'future':
                        return Moment(collection.title).format('MMM YYYY').toUpperCase();
                        break;
                    case 'day':
                        return DateFactory.getWeekday(collection.title)+', '+Moment(collection.title).format('MMMM D');
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
                scope.collection.removeBullet(bullet)
                .then(function(){
                    scope.collection.bullets = scope.collection.bullets.filter(b => b.id !== bullet.id);
                })
                .catch($log.err);
            };

            scope.addBullet = function(bullet) {
                if (bullet.content && bullet.content.length > 0) {
                  scope.collection.addBullet(bullet)
                  .then(function(){
                      scope.newBullet = new Bullet.Task({date: scope.collection.title})
                      scope.$evalAsync()
                  })
                  .catch($log.err);
              };
            }
        }
    };
});
