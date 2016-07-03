/*jshint esversion: 6*/
bulletApp.directive('bulletIcon', function () {
    return {
        restrict: 'E',
        templateUrl: 'scripts/bullets/icon.template.html',
        scope: {
            bullet: '=',
            header: '='
        },
        link: function (scope, element) {
            const typeDict = {
                "Task": "fa-circle-o", //fa-square-o
                "Event": "fa-first-order",
                "Note": "fa-long-arrow-right",
                "complete": "fa-check-circle-o", //fa-check-square-o"
                "migrated": "fa-sign-out",
                "scheduled": "fa-angle-double-left"
            };

            scope.isNew = function (bullet) {
                return (bullet) ? bullet.content : false;
            };

            scope.iconType = function () {
                const type = scope.bullet.status === 'incomplete' ? scope.bullet.type : scope.bullet.status;
                return typeDict[type];
            };

            scope.toggleDone = function () {
                scope.bullet.toggleDone();
                scope.bullet.save();
            };
        }
    };
});
