bulletApp.config(function ($stateProvider) {

  $stateProvider.state('daily', {
    url: '/daily',
    templateUrl: 'scripts/daily/daily.template.html',
    controller: 'DailyCtrl',
    resolve: {
        collections: function() {
            return Collection.fetchAll({type: 'day'});
        }
    }
  });

});
