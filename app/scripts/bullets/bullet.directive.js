bulletApp.directive('bullet', function(DateFactory, $timeout, $rootScope, $state) {
    return {
        restrict: 'E',
        templateUrl: 'scripts/bullets/bullet.template.html',
        scope: {
            bullet: '=',
            removeFn: '&',
            addFn: '&',
        },
        link: function(scope, element, attrs) {

            scope.showButton = 0;
            scope.enableButton = false;
            scope.typeDict = typeDict;
            scope.hideIcon = (attrs.noIcon) ? true : false;

            scope.editable = function() {
                if (!scope.bullet.status) return true;
                return scope.bullet.status === "incomplete" || scope.bullet.status === "new";
            }

            scope.toggleScheduler = function() {
                if (!scope.bullet.date) scope.bullet.date = new Date();
                scope.showScheduler = !scope.showScheduler;
            }

            scope.templateUrl = 'scripts/bullets/type.template.html';
            scope.datepickerUrl = 'scripts/bullets/datepicker.template.html';

            scope.selectType = function(b, type) {
                delete scope.bullet.status;
                Object.assign(scope.bullet, new Bullet[type](b))
                Object.setPrototypeOf(scope.bullet, new Bullet[type](b).constructor.prototype)
                if (scope.bullet.content) scope.bullet.save().then(() => scope.$evalAsync())
            }

            scope.changeType = function(b, type) {
              delete scope.bullet.status;
              Object.assign(scope.bullet, new Bullet[type](b))
              Object.setPrototypeOf(scope.bullet, new Bullet[type](b).constructor.prototype)
              return scope.bullet
            }

            const OS = process.platform;

            scope.showButtonPanel = function(b) {
                return b.status === 'incomplete' &&
                    b.rev &&
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
                .then(res => {
                    scope.$evalAsync();
                });
            };

            scope.options = {
                minMode: 'day'
            }

            scope.next = function() {
                if (scope.bullet.next) $state.go('generic', {id: scope.bullet.next.id});
            }

            scope.schedule = function(mode) {
                scope.bullet.date = DateFactory.roundDate(scope.bullet.date, mode);
                scope.showScheduler = false;
                if (mode === 'month') mode = 'future';
                scope.bullet.schedule(scope.bullet.date, mode)
                .then(res => {
                    $rootScope.$broadcast('update', res.bullets[0].next);
                    scope.$evalAsync();

                });
            };

            function editBullet(e) {

                if (scope.bullet.status !== 'migrated' && scope.bullet.status !=='scheduled') {

                    if (e.which === 68 && scope.bullet.type === 'Task') return scope.bullet.toggleDone();
                    // cmd-x cross out
                    if (e.which === 88 && scope.bullet.type === 'Task') return scope.bullet.toggleStrike();

                    if (scope.editable()) {
                        // cmd-t change to task
                        delete scope.bullet.status;
                        if (e.which === 84) scope.changeType(scope.bullet, 'Task');
                        // cmd-e change to event
                        if (e.which === 69) scope.changeType(scope.bullet, 'Event');
                        // cmd-n change to note
                        if (e.which === 78) scope.changeType(scope.bullet, 'Note');
                    }
                    // cmd-d toggle done for tasks

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
                        e.preventDefault();
                        e.target.blur();
                    } else if ((OS === 'darwin' && e.metaKey) || (OS !== 'darwin' && e.ctrlKey)) {
                        let updatedBullet = editBullet(e);
                        if (updatedBullet) scope.bullet = updatedBullet;
                    } else if (scope.bullet.status === 'struck' || scope.bullet.status === 'complete') {
                        if (e.which !== 9) e.preventDefault();
                    }
                }
            });

            scope.save = function() {
                console.log(scope.bullet)
                if (event && event.relatedTarget && event.relatedTarget.id === 'migrate') return;
                    if (!scope.bullet.rev) scope.addFn();
                    else scope.bullet.save();
                    $timeout(function() {
                      scope.enableButtons = false;
                      scope.$evalAsync()
                    }, 300)
            }

        }
    };
});
