bulletApp.controller('LogCtrl', function($scope, collections, DateFactory, type, $rootScope, $stateParams) {

    const aged = collections[0];
    const future = collections[1];
    let index = aged.length;

    new6(0);

    if ($stateParams.search) {
        let search = $stateParams.search;
        let diff = DateFactory.diffs(search, DateFactory.yesterday, type);
        if (diff >= 0) search = index + diff;
        else {
            search = aged.find(i => i.title === search);
            search = aged.indexOf(search);
        }
        index = findIndex(search);

        function findIndex(i) {
            return aged.length - Math.ceil((aged.length - i) / 6) * 6;
        }
    } else if ($stateParams.index) index = +$stateParams.index;
    if (index < 0) $scope.collections = aged.slice(0, index + 6);
    else navigate();

    function new6(offset) {
        $scope.collections = [];

        DateFactory.display(offset, type).forEach((c) => {
            let use = future.find(el => el.title === c.title) || c;
            $scope.collections.push(use);
        });
    }

    $scope.title = ((type === 'day') ? 'DAILY' : 'FUTURE') + ' LOG';

    $scope.prev6 = function() {
        if (index <= 0) return;
        if (index < 6) {
            $scope.collections = aged.slice(0, index);
            index -= 6;
            $rootScope.$broadcast('pageChange', { index: index, type: type })
        } else {
            index -= 6;
            navigate();
        }
    }

    $scope.next6 = function() {
        index += 6;
        navigate();
    }

    function navigate() {
        $rootScope.$broadcast('pageChange', { index: index, type: type })
        if (index >= aged.length) new6(index - aged.length);
        else $scope.collections = aged.slice(index, index + 6);
    }

});
