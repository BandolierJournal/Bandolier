bulletApp.controller('GenericCtrl', function ($scope, collection) {
  $scope.collection = collection.collection; // this is why i dislike our fetchById fxn
});

