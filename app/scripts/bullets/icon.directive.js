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
            scope.isNew = function(bullet) {return (bullet) ? bullet.content : false;}
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
