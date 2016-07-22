bulletApp.directive('logout', function($state, $rootScope, AuthFactory){
    return {
        restrict: 'A',
        link: function(scope, element) {
            scope.toggleLogin = AuthFactory.toggleLogin
            scope.user = $rootScope.user
        }
    };
});
