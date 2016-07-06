bulletApp.directive('searchBar', function(currentStates, $state) {
    return {
        restrict: 'E',
        templateUrl: 'scripts/search/search.template.html',
        link: function(scope) {
            scope.getBullets = function(search) {
                return Bullet.fetchAll(search);
            }
            scope.go = function(item) {
                if (item.collections.length) $state.go('generic', {id: item.collections[0]});
                else $state.go('index');
            }

        }
    };
});
