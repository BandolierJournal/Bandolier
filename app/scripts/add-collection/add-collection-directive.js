bulletApp.directive('addCollection', function($state, $filter) {
    return {
        restrict: 'E',
        templateUrl: 'scripts/add-collection/add-collection-template.html',
        scope: {
            collectionType: '@'
        },
        link: function(scope) {
            scope.collectionType = scope.collectionType || 'generic';
            
            scope.createCollection = function(collectionName) {
                if (!collectionName) return;
                new Collection(collectionName, scope.collectionType)
                    .save()
                    .then(collection => $state.go($filter('stateName')(scope.collectionType), { id: collection.id }))
                    .then(() => {
                        scope.collectionName = null;
                    })
            }

            scope.templateUrl = 'scripts/add-collection/collection-form.html';
        }
    }
})
