bulletApp.controller('LandingCtrl', function($scope, $state, $timeout) {
	$timeout(function() {
		$state.go('index')
	}, 2500);  
});
