/*jshint esversion: 6*/
bulletApp.directive('bullet', function () {
    return {
        restrict: 'E',
        templateUrl: 'scripts/bullets/bullet.template.html',
        scope: {
            bullet: '=',
            removeFn: '&',
            addFn: '&',
            header: '@'
        },
        link: function (scope, element) {

            scope.typeDict = {
                "Task": "fa-circle-o", //fa-square-o
                "Event": "fa-first-order",
                "Note": "fa-long-arrow-right",
                "Done": "fa-check-circle-o", //fa-check-square-o"
                "Migrated": "fa-sign-out",
                "Scheduled": "fa-angle-double-left"
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


            element.on('keydown', function (e) {
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
                if(!scope.bullet.rev) scope.addFn()
                else scope.bullet.save();
            });
        }
    };
});
