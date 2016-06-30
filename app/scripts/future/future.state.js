bulletApp.config(function ($stateProvider) {

  $stateProvider.state('future', {
    url: '/future/:futureIndex',
    templateUrl: 'scripts/future/future.template.html',
    controller: 'FutureCtrl',
    resolve: {
        collections: function(DateFactory) {
            return Collection.fetchAll({type: 'future'})
                .then(DateFactory.splitCollections);
        }
    }
  });

});
