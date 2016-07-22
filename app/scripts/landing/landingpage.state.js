bulletApp.config(function ($stateProvider) {

  $stateProvider.state('landing', {
    url: '/landing/:login',
    templateUrl: 'scripts/landing/landingpage.template.html',
    controller: 'LandingCtrl'
  });

});
