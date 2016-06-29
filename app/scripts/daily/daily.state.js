bulletApp.config(function ($stateProvider) {

  $stateProvider.state('daily', {
    url: '/daily/:day',
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
                days.push(Moment(today).startOf('day').subtract(i, 'days').toISOString()); //refactor after Sabrina pulls her branch
            }
            return days.map((day, index) => new Collection({
                title: day,
                type: 'day',
                id: Moment().add(index, 'milliseconds').toISOString()
              }));
        }
    }
  });

});
