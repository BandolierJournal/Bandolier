bulletApp.config(function($stateProvider) {
  $stateProvider.state('monthlyTracker', {
    url: '/monthlytracker/:monthId',
    templateUrl: './monthlytracker/monthlytracker.template.html',
    controller: 'MonthlyTrackerCtrl',
    resolve: {
      targetMonth: function($stateParams, Collection) {
        console.log($stateParams)
        return Collection.fetchById($stateParams.monthId)
      },
      numOfDays: function($stateParams) {
        var moment = require('moment')
        var daysInMonth = moment().month($stateParams.monthId).daysInMonth();
        console.log(daysInMonth)
        var arrDays = [];

        while(daysInMonth) {
          var current = moment().date(daysInMonth).isoWeekday();
          current = moment().isoWeekday(current).format('ddd')
          arrDays.push(current);
          daysInMonth--;
        }
        console.log(arrDays)
        return arrDays;
      }
    }
  })
})
