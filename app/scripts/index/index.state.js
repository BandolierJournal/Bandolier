bulletApp.config(function ($stateProvider) {

  $stateProvider.state('index', {
    url: '/index',
    templateUrl: 'scripts/index/index.template.html',
    controller: 'IndexCtrl',
    resolve: {
        collections: function(Collection) {
            return Collection.fetchAll();
        }
    }
  });

});
