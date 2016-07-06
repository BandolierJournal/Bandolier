bulletApp.config(function ($stateProvider) {

  $stateProvider.state('index', {
    url: '/index',
    templateUrl: 'scripts/index/index.template.html',
    controller: 'IndexCtrl',
    resolve: {
        collections: function() {
            return Collection.fetchAll();
        },
        bullets: function() {
            return Bullet.fetchAll('event');
        }
    }
  });

  $stateProvider.state('landing', {
    url: '/landing',
    templateUrl: 'scripts/index/landingpage.html',
    controller: 'LandingCtrl'
  })

});
