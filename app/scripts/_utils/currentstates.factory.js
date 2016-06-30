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
    // These are useful for testing
    // console.log('ts', toState);
    // console.log('tp', toParams);
    // console.log('fs', fromState);
    // console.log('fp', fromParams);
 });

  return currentStates
})
