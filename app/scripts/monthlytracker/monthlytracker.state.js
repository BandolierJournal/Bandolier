bulletApp.config(function($stateProvider) {
  $stateProvider.state('month', {
    url: '/month/:monthString',
    templateUrl: 'scripts/monthlytracker/monthlytracker.template.html',
    controller: 'MonthlyTrackerCtrl',
    resolve: {
      targetMonth: function($stateParams) {
        return Collection.fetchAll({title: $stateParams.monthString});
      },
      numOfDays: function($stateParams) {
        var daysInMonth = Moment().month($stateParams.monthString).daysInMonth();
        var arrDays = [];

        while(daysInMonth) {
          var current = Moment().date(daysInMonth).isoWeekday();
          current = Moment().isoWeekday(current).format('ddd')
          arrDays.push(current);
          daysInMonth--;
        }
        return arrDays.reverse();
      }
    }
  })
})
