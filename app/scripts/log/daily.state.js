bulletApp.config(function($stateProvider) {

    $stateProvider.state('daily', {
        url: '/daily/:index/:search',
        templateUrl: 'scripts/log/log.template.html',
        controller: 'LogCtrl',
        resolve: {
            collections: function(DateFactory) {
                return Collection.fetchAll({ type: 'day' })
                    .then(DateFactory.splitCollections);
            },
            type: () => 'day'
        }
    });

});
