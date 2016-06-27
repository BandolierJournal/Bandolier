bulletApp.controller('FutureCtrl', function ($scope, collections, displayMonths) {
	$scope.collections = [];
	displayMonths.forEach((month, i) => {
		var use = collections.find(el => el.title===month.title) || month;
		$scope.collections.push(use);
	})
  	

});
