bulletApp.config(function ($stateProvider) {

  $stateProvider.state('generic', {
    url: '/generic/:id',
    templateUrl: 'scripts/generic/generic.template.html',
    controller: 'GenericCtrl',
    resolve: {
        collection: function($stateParams) { 
            return Collection.findOrReturn({id: $stateParams.id})
                .then(c => c[0]); 
        }
    }
  });

});
