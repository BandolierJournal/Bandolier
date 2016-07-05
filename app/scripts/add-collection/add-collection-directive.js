bulletApp.directive('addCollection', function($state, $filter) {
    return {
        restrict: 'E',
        templateUrl: 'scripts/add-collection/add-collection-template.html',
        scope: {
            collectionType: '@'
        },
        link: function(scope) {
            scope.collectionType = scope.collectionType || 'generic';
            // TODO: Add validations to create collections for day, month, etc.
            // ^^ Incorporate this into Sabrina's date validations
            scope.createCollection = function() {
                new Collection(scope.collectionName, scope.collectionType)
                    .save()
                    .then(collection => $state.go($filter('stateName')(scope.collectionType), { id: collection.id }))
                    .then(() => {
                        scope.collectionName = null;
                    })
            }
        }
    }
})
