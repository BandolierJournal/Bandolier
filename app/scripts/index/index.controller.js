bulletApp.controller('IndexCtrl', function($scope, collections) {
    $scope.collections = collections.filter(col => col.type === 'generic');
    $scope.months = _.groupBy(collections.filter(col => col.type === 'month' || col.type === 'month-cal'), i => i.title);


    // let date = new Date(2016, 5, 3, 2);

    // let today = Moment(date).startOf('day').toISOString(); // TODO: make this a function (so today is always up to date)
    // let yesterday = Moment(today).subtract(1, 'days').toISOString();
    // let thisMonth = Moment().startOf('month').toISOString();
    // let lastMonth = Moment(thisMonth).subtract(1, 'months').toISOString();
    // console.log('today', today);
    // console.log('yesterday', yesterday);
    // console.log('thisMonth', thisMonth);
    // console.log('lastMonth', lastMonth);
  
    // console.log('comparator', new Date(2016, 5, 30).toISOString());
    // let test = new Date(Moment(today).subtract(-4, 'days').toISOString());
    // console.log(thisMonth < lastMonth);
    // console.log(date, today);

});
