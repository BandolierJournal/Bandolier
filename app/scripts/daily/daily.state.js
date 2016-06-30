bulletApp.config(function($stateProvider) {

    $stateProvider.state('daily', {
        url: '/daily/:day',
        templateUrl: 'scripts/daily/daily.template.html',
        controller: 'LogCtrl',
        resolve: {
            collections: function(DateFactory) {
                return Collection.fetchAll({ type: 'day' })
                    .then(DateFactory.splitCollections);
            },
            last: function($stateParams) {
                return $stateParams.day || null;
            },
            type: () => 'day'
        }
    });

});
