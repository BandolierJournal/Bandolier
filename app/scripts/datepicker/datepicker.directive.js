bulletApp.directive('datePicker', function () {
    return {
        restrict: 'E',
        templateUrl: 'scripts/datepicker/datepicker.template.html',
        link: function(scope, el, attrs) {
            const date = attrs.date;
            scope.getDates = function(input) {
                // input = input.split(' ');
                const matchedMonths = Moment.months().filter(m => m.toLowerCase().match(input.toLowerCase()));
                return matchedMonths;
            }
        }
    };
});
