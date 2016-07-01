/*jshint esversion: 6*/

bulletApp.directive('monthCal', function($log) {
    return {
        restrict: 'E',
        templateUrl: 'scripts/month-cal/month.cal.template.html',
        scope: {
            collection: '=',
            numOfDays: '=',
        },
        link: function(scope) {
            scope.formattedTitle = Moment(scope.collection.title).format('MMMM YYYY').toUpperCase();
            scope.muted = false; // still needed?

            scope.bulletList = {};
            scope.collection.bullets.forEach(bullet => {
                scope.bulletList[Moment(bullet.date).date()] = bullet
            });

            scope.bulletList = scope.numOfDays.map((day, index) => {
                if (scope.bulletList[index + 1]) return scope.bulletList[index + 1];
                else return new Bullet.Task({
                    date: day,
                    collections: [scope.collection.id]
                });
            })

            scope.removeBullet = function(bullet) {
                scope.collection.removeBullet(bullet)
                    .then(function() {
                        scope.bullets = scope.bullets.filter(b => b.id !== bullet.id);
                    })
                    .catch($log.err);
            };
            scope.addBullet = function(bullet) {
                if (bullet.content && bullet.content.length > 0) {
                    scope.collection.addBullet(bullet)
                    .then(function() {
                      scope.$evalAsync();
                    })
                    .catch($log.err);
                };
            }
        }
    };
});
