bulletApp.config(function ($stateProvider) {

  $stateProvider.state('future', {
    url: '/future',
    templateUrl: 'scripts/future/future.template.html',
    controller: 'FutureCtrl',
    resolve: {
        collections: function() {
            return Collection.fetchAll({type: 'future'});
        },
        displayMonths: function() {
            var monthCollection = [];
            var today = new Date();
            var rounded = new Date(today.getFullYear(), today.getMonth());
            for (var i = 2; i > -4; i--) {
                monthCollection.push(Moment(rounded).subtract(i, 'months').toISOString());
            }
            return monthCollection.map(month => new Collection(month, 'future'));
        }
    }
  });

});
