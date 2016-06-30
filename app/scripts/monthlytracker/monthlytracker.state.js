bulletApp.config(function($stateProvider) {
  $stateProvider.state('month', {
    url: '/month/:monthString',
    templateUrl: 'scripts/monthlytracker/monthlytracker.template.html',
    controller: 'MonthlyTrackerCtrl',
    resolve: {
      collections: function($stateParams, DateFactory) {
        const monthString = $stateParams.monthString || DateFactory.roundMonth(new Date).toISOString();
        return Collection.fetchAll({title: monthString});
      },
      month: function($stateParams, DateFactory) {
        return $stateParams.monthString || DateFactory.roundMonth(new Date).toISOString();
      }
    }
  })
})
