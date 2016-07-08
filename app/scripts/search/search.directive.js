bulletApp.directive('searchBar', function(currentStates, $state, $log, $filter) {
    return {
        restrict: 'E',
        templateUrl: 'scripts/search/search.template.html',
        link: function(scope) {
            let fetched;

            scope.getBullets = function(search) {
                if (fetched) return fetched.filter(b => b.content.includes(search));
                return Bullet.fetchWithCollections(search)
                    .then(b => {
                        fetched = b;
                        return fetched;
                    }); 
            }

            scope.go = function(item) {
                if (item.collections.length) {
                    let collection = item.collections[0];
                    $state.go($filter('stateName')(collection.type), { search: collection.title })
                }
                else $state.go('index');
                fetched = null;
                scope.select = null;
            }

        }
    };
});
