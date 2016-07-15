/*jshint node:true, esversion:6*/
bulletApp.factory('AuthFactory', function ($state, $rootScope, $timeout) {

    const Auth = {};

    function createUserDB(user, verb) {
        let username = user.email.split('@')[0];
        return remoteDB[verb](username, user.password)
            .then(res => {
                return verb === 'signup' ? Auth.login(user) : res;
            })
            .then(res => {
                $rootScope.$apply(function(){
                    $rootScope.user = res.name;
                });
                Auth.syncDB(username);
                $state.go('index');
            })
            .catch(err => console.error("Couldn't signin: ", err));
    }

    Auth.syncDB = function(username) {
        remoteDB = new PouchDB(remoteDBAddress + userDBUrl(username), {
            skipSetup: true
        });
        remoteDB.compact();

        const localDB = require('./models')(username);

        if(syncHandler) syncHandler.cancel();

        syncHandler = db.replicate.to(remoteDB, {retry: true})
        .on('active', function () {
            $rootScope.$apply(function () {
                $rootScope.sync = true;
            })
        })
        .on('paused', function () {
            $timeout(function() {
                $rootScope.sync = false;
            }, 500);
        });

        return syncHandler
        .then((res) => {
            return db.destroy()
        })
        .then(() => {
            Collection = require('./models/collection')(localDB);
            Bullet = require('./models/bullet')(localDB);
            return localDB.sync(remoteDB, {
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
                        $rootScope.sync = false;
                    }, 500);
                })
        })
        .catch(console.error.bind(console));

    }

    Auth.login = function (user) {
        return createUserDB(user, 'login');
    }

    Auth.signup = function (user) {
        return createUserDB(user, 'signup');
    }

    return Auth;
});
