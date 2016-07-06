bulletApp.config(function ($stateProvider) {

  $stateProvider.state('generic', {
    url: '/generic/:id',
    templateUrl: 'scripts/generic/generic.template.html',
    controller: 'GenericCtrl',
    resolve: {
        collection: function($stateParams, currentStates) { 
            return Collection.findOrReturn({id: $stateParams.id})
                .then(c => {
                    currentStates.genericTitle = c[0].title
                    return c[0];
                }); 
        }
    }
  });

});
