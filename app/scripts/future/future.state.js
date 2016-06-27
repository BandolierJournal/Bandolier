bulletApp.config(function ($stateProvider) {

  $stateProvider.state('future', {
    url: '/future',
    templateUrl: 'scripts/future/future.template.html',
    controller: 'FutureCtrl',
    resolve: {
        collections: function() {
            return Collection.fetchAll({type: 'future'});
        }
    }
  });

});
