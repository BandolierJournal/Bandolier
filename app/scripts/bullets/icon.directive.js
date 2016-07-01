/*jshint esversion: 6*/
bulletApp.directive('bulletIcon', function () {
    return {
        restrict: 'E',
        templateUrl: 'scripts/bullets/icon.template.html',
        scope: {
            bullet: '=',
            override: '@'
        },
        link: function (scope, element) {
            scope.isNew = (scope.bullet) ? scope.bullet.content : false;
            if (scope.override) console.log(scope.override);

            scope.typeDict = {
                "Task": "fa-circle-o", //fa-square-o
                "Event": "fa-first-order",
                "Note": "fa-long-arrow-right",
                "Done": "fa-check-circle-o", //fa-check-square-o"
                "Migrated": "fa-sign-out",
                "Scheduled": "fa-angle-double-left"
            };
        }
    };
});
