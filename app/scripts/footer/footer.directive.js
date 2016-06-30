bulletApp.directive('footer', function(DateFactory){
    return {
        restrict: 'E',
        templateUrl: 'scripts/footer/footer.template.html',
        link: function(scope) {
        	scope.monthString = DateFactory.thisMonth.toISOString();
        }
    };
});
