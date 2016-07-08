bulletApp.directive('searchBar', function(currentStates, $state, $log) {
    return {
        restrict: 'E',
        templateUrl: 'scripts/search/search.template.html',
        link: function(scope) {
            scope.getBullets = function(search) {
                return Bullet.fetchWithCollections(search);
            }

            scope.go = function(item) {
                console.log('item', item);
                if (item.collections.length) $state.go('generic', {id: item.collections[0]});
                else $state.go('index');
                scope.select = null;
            }

        }
    };
});
