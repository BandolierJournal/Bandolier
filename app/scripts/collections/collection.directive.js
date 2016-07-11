/*jshint esversion: 6*/

bulletApp.directive('collection', function($log, $rootScope, currentStates, DateFactory) {
    return {
        restrict: 'E',
        templateUrl: 'scripts/collections/collection.template.html',
        scope: {
            collection: '=',
            noAdd: '=',
            monthTitle: '=',
            noTitle: '='
        },
        link: function(scope, element) {
            scope.title = scope.monthTitle ? 'Log' : scope.collection.title;
            if (!scope.noAdd) scope.collection.bullets.push(new Bullet.Task({ status: 'new' }));

            $rootScope.$on('update', function(event, next) {
                if (next.id===scope.collection.id) scope.collection.update().then(c => {
                    angular.extend(scope.collection, c[0]);
                    scope.$evalAsync();
                });
            })

            scope.removeBullet = function(bullet) {
                return scope.collection.removeBullet(bullet)
                    .then(function() {
                        if (bullet.id) {
                            scope.collection.bullets = scope.collection.bullets.filter(b => b.id !== bullet.id);
                        }
                    })
                    .catch($log.err);
            };

            scope.addBullet = function(bullet) {
                if (bullet.content && bullet.content.length > 0) {
                    return scope.collection.addBullet(bullet)
                        .then(function() {
                          scope.collection.bullets.push(new Bullet.Task({ status: 'new' }))
                          scope.$evalAsync()
                        })
                        .catch($log.err);
                };
            }

            scope.save = function() {
                scope.collection.save().then(() => scope.$evalAsync());
                $rootScope.$broadcast('nameChange', scope.collection);
            }

            element.on('keydown', function(e) {
                if (e.which === 13) {
                    e.preventDefault();
                    e.target.blur();
                }
            });

        }
    };
});
