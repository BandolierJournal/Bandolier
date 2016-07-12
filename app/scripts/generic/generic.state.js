bulletApp.config(function ($stateProvider) {

  $stateProvider.state('generic', {
    url: '/generic/:id/',
    templateUrl: 'scripts/generic/generic.template.html',
    controller: 'GenericCtrl',
    resolve: {
        collection: function($stateParams, currentStates, $state) { 
            return Collection.findOrReturn({id: $stateParams.id})
                .then(c => {
                    c = c[0];
                    if (!c.title) $state.go('index');
                    else currentStates.genericTitle = c.title;
                    return c;
                }); 
        }
    }
  });

});
