bulletApp.config(function($stateProvider) {

    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'scripts/signup/signup.template.html',
        controller: 'signupCtrl'
    });

});
