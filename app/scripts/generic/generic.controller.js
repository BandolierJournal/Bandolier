bulletApp.controller('GenericCtrl', function($scope, collection, $state, $filter) {
    if (collection.type !=='generic') $state.go($filter('stateName')(collection.type), { search: collection.title });
    $scope.collection = collection;
});
