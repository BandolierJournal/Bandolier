bulletApp.controller('DailyCtrl', function($scope, collections, DateFactory) {

    const aged = collections[0];
    const future = collections[1];
    let index = aged.length;

    function new6(offset) {
        $scope.collections = [];

        DateFactory.display(offset, 'day').forEach((day) => {
            let use = future.find(el => el.title === day.title) || day;
            console.log(use.rev);
            $scope.collections.push(use);
        });
    }

    new6(0);

    $scope.prev6 = function() {
        if (index===0) return;
        if (index < 6) $scope.collections = aged.slice(0, index);
        else {
            index -= 6;
            navigate();
        }
    }

    $scope.next6 = function() {
        index += 6;
        navigate();
    }

    function navigate() {
        if (index >= aged.length) new6(index - aged.length);
        else $scope.collections = aged.slice(index, index + 6);
    }

});
