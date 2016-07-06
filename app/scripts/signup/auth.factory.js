/*jshint node:true, esversion:6*/
bulletApp.factory('AuthFactory', function ($state, $rootScope, $timeout) {

    const Auth = {};

    function createUserDB(user, verb) {
        let username = user.email.split('@')[0];
        return remoteDB[verb](username, user.password)
            .then(res => {
                console.log(res);
                return verb === 'signup' ? Auth.login(user) : res;
            })
            .then(res => {
                $rootScope.$apply(function(){
                    $rootScope.user = res.name;
                });
                console.log(Auth.syncDB(username));
                $state.go('index')
            })
            .catch(err => console.error("Couldn't signin: ", err));
    }

    Auth.syncDB = function(username) {
        remoteDB = new PouchDB(remoteDBAddress + userDBUrl(username), {
            skipSetup: true
        });
        return db.sync(remoteDB, {
                live: true,
                retry: true
            })
            .on('active', function () {
                $rootScope.$apply(function () {
                    $rootScope.sync = true;
                })
            })
            .on('paused', function () {
                $timeout(function() {
                    $rootScope.sync = true;
                }, 500);
            })
    }

    Auth.login = function (user) {
        return createUserDB(user, 'login');
    }

    Auth.signup = function (user) {
        return createUserDB(user, 'signup');
    }

    return Auth;
});
