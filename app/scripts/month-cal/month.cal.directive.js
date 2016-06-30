/*jshint esversion: 6*/

bulletApp.directive('monthCal', function($log, DateFactory){
    return {
        restrict: 'E',
        templateUrl: 'scripts/month-cal/month.cal.template.html',
        scope: {
            collection: '=',
            numOfDays: '=',
        },
        link: function(scope) {
          scope.formattedTitle = Moment(scope.collection.title).format('MMM YY').toUpperCase();
          scope.muted = false;
          scope.bulletList = {}
          scope.collection.bullets.forEach(bullet => {
            scope.bulletList[Moment(bullet.date).date()] = bullet
          })
          scope.bulletList = scope.numOfDays.map((day, index) => {
            if(scope.bulletList[index + 1]) return scope.bulletList[index + 1];
            else return new Bullet.Task({
              id: Moment().add(index, 'milliseconds').toISOString(),
              date: Moment(scope.collection.title).add(index, 'days').toISOString(),
              collections: [scope.collection.id]});
          })

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
