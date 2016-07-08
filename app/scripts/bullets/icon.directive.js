/*jshint esversion: 6*/
bulletApp.directive('bulletIcon', function($state) {
    return {
        restrict: 'E',
        templateUrl: 'scripts/bullets/icon.template.html',
        scope: {
            bullet: '='
        },
        link: function(scope, element) {

            scope.iconType = function() {
                let type;
                if (!scope.bullet.status) type = scope.bullet.type;
                else type = scope.bullet.status === 'incomplete' ? scope.bullet.type : scope.bullet.status;
                return typeDict[type];
            };

            scope.toggleDone = function() {
                if (scope.bullet.type === "Task") {
                    // if (scope.bullet.status==="struck") scope.bullet.toggleDone();
                    if (scope.bullet.status==="complete") scope.bullet.toggleStrike();
                    else scope.bullet.toggleDone();
                    scope.bullet.save();
                }
            };

            scope.next = function() {
                console.log(scope.bullet.next);
                if (scope.bullet.next) $state.go('generic', {id: scope.bullet.next.id});
            }

        }
    };
});
