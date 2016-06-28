/*jshint esversion: 6*/

bulletApp.directive('monthCal', function($log){
    return {
        restrict: 'E',
        templateUrl: 'scripts/month-cal/month.cal.template.html',
        scope: {
            collectionId: '@',
            numOfDays: '=',
            props: '='
        },
        link: function(scope) {
            console.log(scope)
            //Need some help refactoring this
            Collection.fetchById(scope.collectionId)
            .then(function(res){
                angular.extend(scope, res);
                scope.formattedTitle = Moment(scope.collection.title).format('MMM YY').toUpperCase();
                scope.$evalAsync();
            })
            // .catch(function(err) {
            //     scope.collection = new Collection(scope.props);
            //     scope.formattedTitle = formatTitle(scope.collection);
            //     scope.$evalAsync();
            // })
            .then(function () {
              scope.bulletList = {}
              scope.bullets.forEach(bullet => {
                scope.bulletList[Moment(bullet.date).date()] = bullet

              })
              scope.bulletList = scope.numOfDays.map((day, index) => {
                if(scope.bulletList[index + 1]) return scope.bulletList[index + 1]
                else return new Bullet.Task({date: Moment(scope.collection.title).add(index, 'days').toISOString(), collections: [scope.collection.id]})
              })
            })

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
                scope.collection.removeBullet(bullet)
                .then(function(){
                    scope.bullets = scope.bullets.filter(b => b.id !== bullet.id);
                })
                .catch($log.err);
            };
            scope.addBullet = function(bullet) {
                if (bullet.content.length > 0) {
                  scope.collection.addBullet(bullet)
                  .then(function(){
                      scope.bullets.push(bullet);
                      scope.newBullet = new Bullet.Task()
                      scope.$evalAsync()
                  })
                  .catch($log.err);
              };
            }
        }
    };
});