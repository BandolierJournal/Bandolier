bulletApp.config(function($stateProvider) {

    $stateProvider.state('daily', {
        url: '/daily/:index',
        templateUrl: 'scripts/log/log.template.html',
        controller: 'LogCtrl',
        resolve: {
            collections: function(DateFactory) {
                return Collection.fetchAll({ type: 'day' })
                    .then(DateFactory.splitCollections);
            },
            last: function($stateParams) {
                return $stateParams.index || null;
            },
            type: () => 'day'
        }
    });

});
