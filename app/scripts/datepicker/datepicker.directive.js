bulletApp.directive('datePicker', function (DateFactory) {
    return {
        restrict: 'E',
        templateUrl: 'scripts/datepicker/datepicker.template.html',
        link: function (scope, el, attrs) {
            const date = attrs.date;
            scope.getDates = DateFactory.getChoices;
        }
    };
});
