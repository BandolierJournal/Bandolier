bulletApp.config(function($stateProvider) {

    $stateProvider.state('daily', {
        url: '/daily/:index/:dayString',
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
