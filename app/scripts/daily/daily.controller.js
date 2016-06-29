bulletApp.controller('DailyCtrl', function ($scope, collections, displayDays) {
	$scope.collections = [];
	displayDays.forEach((day, i) => {
		const use = collections.find(el => el.title===day.title) || day;
		$scope.collections.push(use);
	})
	console.log($scope.collections)
});
