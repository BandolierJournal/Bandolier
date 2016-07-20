bulletApp.directive('refresh', function($state, $rootScope, AuthFactory){
    return {
        restrict: 'A',
        link: function(scope, element) {

            remoteDB.getSession()
            .then(res => {
                console.log(remoteDB)
                console.log(res);
                const username = res.userCtx.name;
                if(username) {
                    $rootScope.$apply(function(){
                        $rootScope.user = username;
                    });
                    AuthFactory.syncDB(username)
                }
            })
            .catch(console.error.bind(console))

            scope.syncing = function() {
                return $rootScope.sync;
            };

            scope.login = function() {
                if (AuthFactory.getSyncStatus()) {
                  AuthFactory.stopSync()
                  AuthFactory.setSyncStatus(false)
                  $rootScope.$evalAsync()
                } else {
                  AuthFactory.startSync()
                  AuthFactory.setSyncStatus(true)
                  $rootScope.$evalAsync()
                }
            };
            scope.getSyncStatus = AuthFactory.getSyncStatus
        }
    };
});
