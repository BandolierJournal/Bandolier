bulletApp.config(function ($stateProvider) {

  $stateProvider.state('daily', {
    url: '/daily/:day',
    templateUrl: 'scripts/daily/daily.template.html',
    controller: 'DailyCtrl',
    resolve: {
        collections: function(DateFactory) {
            return Collection.fetchAll({type: 'day'})
                .then(DateFactory.splitCollections);
        }
    }
  });

});
