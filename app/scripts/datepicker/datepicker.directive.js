bulletApp.directive('datePicker', function (DateFactory) {
    return {
        restrict: 'E',
        templateUrl: 'scripts/datepicker/datepicker.template.html',
        link: function (scope) {
            scope.getDates = DateFactory.getChoices;
        }
    };
});
