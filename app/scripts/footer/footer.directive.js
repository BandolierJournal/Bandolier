bulletApp.directive('footer', function(currentStates, $state){
    return {
        restrict: 'E',
        templateUrl: 'scripts/footer/footer.template.html',
        link: function (scope) {
          scope.currentStates = currentStates

          scope.lastMonth = function() {
            if (currentStates.month) $state.go('month', currentStates.month)
            else $state.go('month', {monthString: Moment().startOf('month').toISOString() })
          }
          scope.lastDaily = function() {
            //currently does not use params
            $state.go('daily') //, currentStates.day)
          }
          scope.lastFuture = function() {
            $state.go('future', currentStates.future)
          }
          scope.lastGeneric = function() {
            $state.go('generic', currentStates.generic)
          }
        }
    };
});
