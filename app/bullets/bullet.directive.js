/*jshint esversion: 6*/
bulletApp.directive('bullet', function (Bullet) {
    return {
        restrict: 'E',
        templateUrl: './bullets/bullet.template.html',
        scope: {
            bullet: '=',
            removeFn: '&',
        },
        link: function (scope, element) {
            scope.typeDict = {
                "Task": "fa-circle",
                "Event": "fa-circle-thin",
                "Note": "fa-minus",
                "Done": "fa-times"
            };

            let map = {};

            function editBullet(e) {
                if(!scope.bullet.strike) {
                    if(!scope.bullet.status || scope.bullet.status === 'incomplete') {
                        // cmd-t change to task
                        if (map[84]) return new Bullet.Task(scope.bullet);
                        // cmd-e change to event
                        if (map[69]) return new Bullet.Event(scope.bullet);
                        // cmd-n change to note
                        if (map[78]) return new Bullet.Note(scope.bullet);
                    }
                    // cmd-d toggle done for tasks
                    if (map[68] && scope.bullet.type === 'Task') scope.bullet.toggleDone();
                }
                // cmd-x cross out
                if (map[88]) scope.bullet.toggleStrike();
                // cmd-del remove from collection
                if (map[8]) {
                    e.preventDefault();
                    scope.removeFn();
                }
                return scope.bullet;
            }

            scope.bulletFocus = function() {
                if (!scope.bullet) {
                  scope.bullet = new Bullet.Task('')
                  console.log(scope.bullet)
                }
            };

            element.on('keyup', function () {
                map = {};
            });

            element.on('keydown', function (e) {
                map[e.which] = true;
                if (map[13]) {
                    map = {};
                    e.preventDefault();
                    e.target.blur();
                } else if (map[91]) {
                    scope.bullet = editBullet(e);
                    scope.bullet.save();
                } else if(scope.bullet.strike || scope.bullet.status === 'complete') {
                    map = {};
                    e.preventDefault();
                }

            });

            element.on('focusout', function (e) {
                scope.bullet.save();
            });
        }
    };
});
