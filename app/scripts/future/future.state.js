bulletApp.config(function($stateProvider) {

    $stateProvider.state('future', {
        url: '/future/:lastMonth',
        templateUrl: 'scripts/future/future.template.html',
        controller: 'LogCtrl',
        resolve: {
            collections: function(DateFactory) {
                return Collection.fetchAll({ type: 'future' })
                    .then(DateFactory.splitCollections);
            },
            last: function($stateParams) {
                return $stateParams.lastMonth || null;
            },
            type: () => 'month'
        }
    });

});
