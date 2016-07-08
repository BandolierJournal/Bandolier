bulletApp.directive('footer', function(currentStates, $state) {
    return {
        restrict: 'E',
        templateUrl: 'scripts/footer/footer.template.html',
        link: function(scope) {
            scope.currentStates = currentStates;
            scope.lastMonth = function() {
                if (currentStates.month) $state.go('month', currentStates.month)
                else $state.go('month', { search: Moment().startOf('month').toISOString() }) //DateFactory.thisMonth.toISOString()
            };
            scope.lastDaily = function() {
                $state.go('daily', currentStates.daily)
            };
            scope.lastFuture = function() {
                $state.go('future', currentStates.future)
            };
            scope.lastGeneric = function() {
                $state.go('generic', currentStates.generic)
            };
        }
    };
});
