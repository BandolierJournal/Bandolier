bulletApp.controller('GenericCtrl', function($scope, collection, $state) {
    if (collection.type === 'month' || collection.type === 'month-cal') {
    	$state.go('month', { monthString: collection.title });
    }
    if (collection.type === 'day') {
    	$state.go('daily', {dayString: collection.title});
    }
    $scope.collection = collection;
});
