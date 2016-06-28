bulletApp.config(function ($stateProvider) {

  $stateProvider.state('generic', {
    url: '/generic/:id',
    templateUrl: 'scripts/generic/generic.template.html',
    controller: 'GenericCtrl',
    resolve: {
        collection: function($stateParams) { //changed this, we are double fetching o/w
            return new Collection({id: $stateParams.id}); // bc the collection directive has a fetch
        }
    }
  });

});
