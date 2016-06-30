bulletApp.controller('DailyCtrl', function($scope, collections, DateFactory, day, $rootScope, $stateParams) {

    const aged = collections[0];
    const future = collections[1];
    let index = aged.length;

    if ($stateParams.dailyIndex) {
      index = +$stateParams.dailyIndex
      navigate()
    } else {
      new6(0);
    }
    function new6(offset) {
        $scope.collections = [];

        DateFactory.display(offset, 'day').forEach((day) => {
            let use = future.find(el => el.title === day.title) || day;
            $scope.collections.push(use);
        });
    }



    $scope.prev6 = function() {
        if (index===0) return;
        if (index < 6) $scope.collections = aged.slice(0, index);
        else {
            index -= 6;
            navigate();
        }
    }

    $scope.next6 = function() {
        // TODO: @sechu says there's a small glitch here
        index += 6;
        navigate();
    }

    function navigate() {
        $rootScope.$broadcast('pageChange', {dailyIndex: index})
        if (index >= aged.length) new6(index - aged.length);
        else $scope.collections = aged.slice(index, index + 6);
    }

});
