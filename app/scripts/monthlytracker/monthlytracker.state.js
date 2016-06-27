bulletApp.config(function($stateProvider) {
  $stateProvider.state('monthlyTracker', {
    url: '/monthlytracker/:monthId/:monthCalId',
    templateUrl: 'scripts/monthlytracker/monthlytracker.template.html',
    controller: 'MonthlyTrackerCtrl',
    resolve: {
      targetMonthCal: function($stateParams, Collection) {
        return Collection.fetchById($stateParams.monthCalId)
      },
      targetMonth: function($stateParams, Collection) {
        return Collection.fetchById($stateParams.monthId)
      },
      numOfDays: function($stateParams) {
        var moment = require('moment')
        var daysInMonth = moment().month($stateParams.monthCalId).daysInMonth();
        var arrDays = [];

        while(daysInMonth) {
          var current = moment().date(daysInMonth).isoWeekday();
          current = moment().isoWeekday(current).format('ddd')
          arrDays.push(current);
          daysInMonth--;
        }
        return arrDays;
      }
    }
  })
})
