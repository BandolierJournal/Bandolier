bulletApp.config(function ($stateProvider) {

  $stateProvider.state('daily', {
    url: '/daily',
    templateUrl: 'scripts/daily/daily.template.html',
    controller: 'DailyCtrl',
    resolve: {
        collections: function() {
            return Collection.fetchAll({type: 'day'});
        },
        displayDays: function() {
            var days = [];
            var today = new Date();
            for (var i = 2; i > -4; i--) {
                days.push(Moment(today).subtract(i, 'days').toISOString());
            }
            return days.map(day => new Collection(day, 'day'));
        }
    }
  });

});
