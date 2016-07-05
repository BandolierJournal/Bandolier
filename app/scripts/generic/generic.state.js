bulletApp.config(function ($stateProvider) {

  $stateProvider.state('generic', {
    url: '/generic/:id',
    templateUrl: 'scripts/generic/generic.template.html',
    controller: 'GenericCtrl',
    resolve: {
        collection: function($stateParams, currentStates) {
            return Collection.findOrReturn({id: $stateParams.id})
            .then(res => {
              currentStates.genericTitle = res[0].title //set the current state for the footer
              return res
            });
        }
    }
  });

});
