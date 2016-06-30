bulletApp.factory('currentStates', function ($rootScope) {
  var currentStates = {
    daily: null,
    month: null,
    future: null,
    generic: null,
    genericTitle: false
  }
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    currentStates[toState.name] = toParams
    // // These are useful for testing
    // console.log('ts', toState);
    // console.log('tp', toParams);
    // console.log('fs', fromState);
    // console.log('fp', fromParams);
  });

  $rootScope.$on('pageChange', function(event, args){

    if (args.index && args.type === 'future') currentStates.future = args;
    if (args.index && args.type === 'day') currentStates.daily = args;
  });

  //This console logs if there are errors in a state change
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams){
    // console.log('err', event);
    // console.log('ts', toState);
    // console.log('tp', toParams);
    // console.log('fs', fromState);
    // console.log('fp', fromParams);
  });


  return currentStates
})
