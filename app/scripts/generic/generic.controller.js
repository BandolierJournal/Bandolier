bulletApp.controller('GenericCtrl', function($scope, collection, $state) {
    if (collection.type === 'month' || collection.type === 'month-cal') {
    	console.log(collection);
    	$state.go('month', { monthString: collection.title });
    }
    $scope.collection = collection;
});
