bulletApp.config(function ($stateProvider) {

  $stateProvider.state('daily', {
    url: '/daily/:day',
    templateUrl: 'scripts/daily/daily.template.html',
    controller: 'DailyCtrl',
    resolve: {
        collections: function() {
            return Collection.fetchAll({type: 'day'});
        },
        displayDays: function($stateParams) {
            let days = [];
            let date = $stateParams.day || new Date();
            for (let i = 0; i > -6; i--) {
                days.push(Moment(date).subtract(i, 'days').toISOString());
            }
            return days.map(day => new Collection(day, 'day'));
        }
    }
  });

});
