bulletApp.directive('bullet', function(DateFactory, $timeout, $rootScope) {
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
            scope.assigned = false;
            scope.typeDict = typeDict;
            scope.options = {
                minMode: 'day'
            }
            scope.icon = true;
            if (attrs.noIcon) scope.icon = false;
 
            scope.templateUrl = 'scripts/bullets/type.template.html';
            scope.datepickerUrl = 'scripts/bullets/datepicker.template.html';

            scope.selectType = function(b, type) {
                scope.bullet = new Bullet[type](b);
                scope.assigned = true;
            }

            const OS = process.platform;

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

            scope.schedule = function(mode) {
                if (mode === 'month') mode = 'future';
                scope.popup = false;
                scope.bullet.schedule(scope.bullet.date.toISOString(), mode)
                    .then(() => {
                        scope.showScheduler = false;
                        scope.$evalAsync();
                    });
            };

            scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            scope.format = scope.formats[0];
            scope.altInputFormats = ['M!/d!/yyyy'];


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
                    } else if (scope.bullet.status === 'struck' || scope.bullet.status === 'complete') {
                        if (e.which !== 9) e.preventDefault();
                    }
                }
            });


            scope.save = function() {
                console.log('save triggered');
                $timeout(function() {
                    if (!scope.bullet.rev) scope.addFn();
                    else scope.bullet.save();
                }, 100);

                $timeout(function() {
                    scope.enableButtons = false;
                }, 300);
            }

        }
    };
});
