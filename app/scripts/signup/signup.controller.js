bulletApp.controller('signupCtrl', function($scope, AuthFactory){
    angular.extend($scope, AuthFactory);
});
