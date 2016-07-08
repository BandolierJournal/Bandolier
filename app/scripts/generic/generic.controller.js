bulletApp.controller('GenericCtrl', function($scope, collection, $state, $filter) {
    if (collection.type !=='generic') {
    	$filter('stateName')(collection.type);
        $state.go($filter('stateName')(collection.type), { search: collection.title });
    }

    $scope.collection = collection;
});
