bulletApp.config(function($stateProvider) {
  $stateProvider.state('monthlyTracker', {
    url: '/monthlytracker',
    templateUrl: './monthlytracker/monthlytracker.template.html',
    controller: 'MonthlyTrackerCtrl',
    resolve: {
      targetMonth: function($stateParams, Collection) {
        return Collection.fetchById($stateParams.monthId)
      }
    }
  })
})
