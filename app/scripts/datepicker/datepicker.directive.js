bulletApp.directive('datePicker', function () {
    return {
        restrict: 'E',
        templateUrl: 'scripts/datepicker/datepicker.template.html',
        link: function(scope, el, attrs) {
            const date = attrs.date;
            scope.getDates = function(input) {
                let [month, day, year] = input.split(' ');
                console.log(month, day, year);
                let matches;
                if(!day) matches = Moment.months().filter(m => m.toLowerCase().match(input.toLowerCase()));
                return matches;
            }
        }
    };
});
