/*jshint esversion: 6*/
bulletApp.directive('bulletIcon', function() {
    return {
        restrict: 'E',
        templateUrl: 'scripts/bullets/icon.template.html',
        scope: {
            bullet: '='
        },
        link: function(scope, element) {

            scope.iconType = function() {
                const type = scope.bullet.type === 'Task' ? scope.bullet.status : scope.bullet.type;
                return typeDict[type];
            };

            scope.toggleDone = function() {
                if (scope.bullet.type === "Task") {
                    scope.bullet.toggleDone();
                    scope.bullet.save();
                }
            };

        }
    };
});
