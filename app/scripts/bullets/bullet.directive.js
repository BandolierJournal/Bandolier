bulletApp.directive('bullet', function(DateFactory, $timeout) {
    return {
        restrict: 'E',
        templateUrl: 'scripts/bullets/bullet.template.html',
        scope: {
            bullet: '=',
            removeFn: '&',
            addFn: '&'
        },
        link: function(scope, element) {

            scope.showButton = 0;
            scope.enableButton = false;

            const OS = process.platform;

            scope.empty = () => !scope.bullet.content;
            scope.logbullet = () => console.log(scope.bullet);
            scope.templateUrl = 'scripts/bullets/type.template.html';

            scope.selectType = function(type) {
                scope.bullet = new Bullet[type](scope.bullet);
            }

            scope.typeDict = {
                "Task": "fa-circle-o", //fa-square-o
                "Event": "fa-first-order",
                "Note": "fa-long-arrow-right",
                "Done": "fa-check-circle-o", //fa-check-square-o"
                "Migrated": "fa-sign-out",
                "Scheduled": "fa-angle-double-left"
            };


            scope.showButtonPanel = function(b) {
                return b.status === 'incomplete' &&
                    b.rev &&
                    !scope.showScheduler &&
                    scope.enableButtons;
            };

            scope.showScheduleButton = function(b) {
                return b.type !== 'Note';
            };

            scope.showMigrateButton = function(b) {
                return b.type === 'Task';
            };

            scope.migrate = function() {
                scope.bullet.migrate()
                    .then(() => scope.$evalAsync());
            };

            scope.schedule = function(date) {
                scope.bullet.schedule(...DateFactory.convertDate(date))
                    .then(() => {
                        scope.$evalAsync();
                        scope.showScheduler = false;
                    });
            };

            function editBullet(e) {
                if (scope.bullet.status !== 'migrated') {
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
                    // cmd-x cross out
                    if (e.which === 88 && scope.bullet.type === 'Task') return scope.bullet.toggleStrike();
                }
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

            element.on('keydown', function(e) {
                if (e.which !== 9 && e.which !== 91) {
                    if (e.which === 13) {
                        if (!e.target.className.split(' ').includes('scheduler')) {
                            e.preventDefault();
                            e.target.blur();
                        }
                    } else if ((OS === 'darwin' && e.metaKey) || (OS !== 'darwin' && e.ctrlKey)) {
                        let updatedBullet = editBullet(e);
                        if (updatedBullet) {
                            scope.bullet = updatedBullet; //check if this icon scope
                            scope.bullet.save().then(() => scope.$evalAsync());
                        }
                    } else if (scope.bullet.status === 'complete' || 'struck') {
                        if (e.which !== 9) e.preventDefault();
                    }
                }
            });

            scope.save = function() {
                $timeout(function() {
                    if (!scope.bullet.rev) scope.addFn();
                    else scope.bullet.save();
                }, 10);

                $timeout(function() {
                    scope.enableButtons = false;
                }, 300);
            }

        }
    };
});
