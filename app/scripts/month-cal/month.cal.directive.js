/*jshint esversion: 6*/
bulletApp.directive('monthCal', function($log) {
    return {
        restrict: 'E',
        templateUrl: 'scripts/month-cal/month.cal.template.html',
        scope: {
            collection: '=',
            days: '=',
        },
        link: function(scope) {
            scope.formattedTitle = Moment(scope.collection.title).format('MMMM YYYY').toUpperCase();

            scope.bulletList = scope.days.map(day => {
                return scope.collection.bullets.find(bullet => bullet.date === day) || new Bullet.Task({
                    date: day
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
                    scope.collection.addBullet(bullet);
                };
            }
        }
    };
});
