bulletApp.controller('IndexCtrl', function ($scope, $state, collections) {
  $scope.message = "Index Page";
  $scope.collections = collections; 
});
