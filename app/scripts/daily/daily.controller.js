bulletApp.controller('DailyCtrl', function($scope, collections, DateFactory) {
    $scope.collections = [];
    let today = DateFactory.roundDate(new Date());
    const yesterday = new Date(Moment(today).subtract(2, 'days').toISOString());

    const split = _.partition(collections, function(c) {
        return new Date(c.title) < yesterday;
    })

    const aged = split[0].sort(chronoSort);
    const future = split[1];

    function new6(offset) {
        $scope.collections = [];

        DateFactory.display(offset, 'day').forEach((day) => {
        	let use = day;
        	if (future.find(el => el.title === day.title)) {
        		use = future.find(el => el.title === day.title);
        	}
            $scope.collections.push(use);
        });
  
    }
    new6(0);

    let index = aged.length;

    $scope.prev6 = function() {
        if (index < 6) $scope.collections = aged.slice(0, index);
        else {
            index -= 6;
            navigate();
        }
    }

    $scope.next6 = function() {
        index+=6;
        navigate();
    }

    function navigate() {
        if (index >=aged.length) new6(index-aged.length);
        else $scope.collections = aged.slice(index, index + 6);
    }

    function chronoSort(a, b) {
        a = new Date(a.title);
        b = new Date(b.title);
        if (a < yesterday || b < yesterday) {
            return a - b;
        }
    }

    function chronoFilter(a) {
        return new Date(a.title) < yesterday;
    }

});
