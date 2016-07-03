/*jshint esversion: 6*/
bulletApp.directive('bullet', function (DateFactory, $timeout) {

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

            scope.showButton = 0;
            scope.enableButton = false;

            const OS = process.platform;

            scope.showButtonPanel = function (b) {
                return b.status === 'incomplete' &&
                    b.rev &&
                    !b.strike &&
                    !scope.showScheduler &&
                    scope.enableButtons;
            };

            scope.showScheduleButton = function (b) {
                return b.type !== 'Note';
            };

            scope.showMigrateButton = function (b) {
                return b.type === 'Task';
            };

            scope.migrate = function () {
                scope.bullet.migrate()
                    .then(() => scope.$evalAsync());
            };

            scope.schedule = function (date) {
                scope.bullet.schedule(...DateFactory.convertDate(date))
                    .then(() => {
                        scope.$evalAsync();
                        scope.showScheduler = false;
                    });
            };

            function editBullet(e) {
                if (!scope.bullet.strike && scope.bullet.status !== 'migrated') {
                    if (!scope.bullet.status || scope.bullet.status === 'incomplete') {
                        // cmd-t change to task
                        if (e.which === 84) return new Bullet.Task(scope.bullet);
                        // cmd-e change to event
                        if (e.which === 69) return new Bullet.Event(scope.bullet);
                        // cmd-n change to note
                        if (e.which === 78) return new Bullet.Note(scope.bullet);
                    }
                    // cmd-d toggle done for tasks
                    if (e.which === 68 && scope.bullet.type === 'Task') return scope.bullet.toggleDone();
                }
                // cmd-x cross out
                if (e.which === 88) return scope.bullet.toggleStrike();
                // cmd-del remove from collection
                if (e.which === 8) {
                    if (scope.bullet.rev) {
                        e.preventDefault();
                        scope.removeFn()
                            .then(() => {
                                scope.$evalAsync();
                            });
                    }
                }
            }


            element.on('keydown', function (e) {
                if (e.which !== 9 && e.which !== 91) {
                    if (e.which === 13) {
                        if (!e.target.className.split(' ').includes('scheduler')) {
                            e.preventDefault();
                            e.target.blur();
                        }
                    } else if ((OS === 'darwin' && e.metaKey) || (OS !== 'darwin' && e.ctrlKey)) {
                        let updatedBullet = editBullet(e);
                        if (updatedBullet) {
                            scope.bullet = updatedBullet;
                            scope.bullet.save().then(() => scope.$evalAsync());
                        }
                    } else if (scope.bullet.strike || scope.bullet.status === 'complete') {
                        if (e.which !== 9) e.preventDefault();
                    }
                }
            });

            element.on('focusout', function (e) {
                if (!scope.bullet.rev) scope.addFn();
                else scope.bullet.save();

                $timeout(function () {
                    scope.enableButtons = false;
                }, 300);

            });
        }
    };
});
