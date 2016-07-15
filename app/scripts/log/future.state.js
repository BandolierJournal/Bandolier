bulletApp.config(function($stateProvider) {

    $stateProvider.state('future', {
        url: '/future/:index/:search',
        templateUrl: 'scripts/log/log.template.html',
        controller: 'LogCtrl',
        resolve: {
            collections: function(DateFactory, $log) {
                return Collection.fetchAll({ type: 'future' })
                    .then(DateFactory.splitCollections)
                    .catch($log.err);
            },
            type: () => 'month'
        }
    });

});
