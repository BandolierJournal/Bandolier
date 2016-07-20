bulletApp.directive('logout', function($state, $rootScope, AuthFactory){
    return {
        restrict: 'A',
        link: function(scope, element) {
            scope.logout = AuthFactory.logout
            scope.user = rootScope.user
        }
    };
});
