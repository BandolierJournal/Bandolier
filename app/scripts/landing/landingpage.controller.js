bulletApp.controller('LandingCtrl', function($scope, $state, $timeout, $stateParams) {
	if (!$stateParams.login) {
		$timeout(function() {
			if ($state.current.name === 'landing') $state.go('index')
		}, 2500);
	}
});
