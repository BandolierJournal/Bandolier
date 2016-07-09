bulletApp.controller('LandingCtrl', function($scope, $state, $timeout) {
	$timeout(function() {
		if ($state.current.name === 'landing') $state.go('index')
	}, 2500);
});
