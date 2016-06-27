/*jshint esversion: 6*/
bulletApp.directive('bullet', function (Bullet) {
    return {
        restrict: 'E',
        templateUrl: 'scripts/bullets/bullet.template.html',
        scope: {
            bullet: '=',
            removeFn: '&',
            collection: '='
        },
        link: function (scope, element) {
            scope.typeDict = {
                "Task": "fa-circle",
                "Event": "fa-circle-thin",
                "Note": "fa-minus",
                "Done": "fa-times"
            };

            const OS = process.platform;

            function editBullet(e) {
                if(!scope.bullet.strike) {
                    if(!scope.bullet.status || scope.bullet.status === 'incomplete') {
                        // cmd-t change to task
                        if (e.which === 84) return new Bullet.Task(scope.bullet);
                        // cmd-e change to event
                        if (e.which === 69) return new Bullet.Event(scope.bullet);
                        // cmd-n change to note
                        if (e.which === 78) return new Bullet.Note(scope.bullet);
                    }
                    // cmd-d toggle done for tasks
                    if (e.which === 68 && scope.bullet.type === 'Task') scope.bullet.toggleDone();
                }
                // cmd-x cross out
                if (e.which === 88) scope.bullet.toggleStrike();
                // cmd-del remove from collection
                if (e.which === 8) {
                    e.preventDefault();
                    scope.removeFn();
                }
                return scope.bullet;
            }

            // scope.bulletFocus = function() {
            //     if (!scope.bullet) {
            //       scope.bullet = new Bullet.Task({date: scope.collection.title, collections: [scope.collection.id]})
            //       console.log(scope.bullet)
            //     }
            // };

            element.on('keydown keypress', function (e) {
                if(e.which !== 9 && e.which !== 91) {
                    if (e.which === 13) {
                        e.preventDefault();
                        e.target.blur();
                    } else if ((OS === 'darwin' && e.metaKey) || (OS !== 'darwin' && e.ctrlKey)) {
                        scope.bullet = editBullet(e);
                        scope.bullet.save().then(() => scope.$evalAsync());
                    } else if(scope.bullet.strike || scope.bullet.status === 'complete') {
                        if(e.which !== 9) e.preventDefault();
                    }
                }
            });

            element.on('focusout', function (e) {
                scope.bullet.save();
            });
        }
    };
});
