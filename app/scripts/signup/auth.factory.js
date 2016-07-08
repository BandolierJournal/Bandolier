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
        const localDB = new PouchDB(username, {auto_compaction: true})
        return db.sync(remoteDB).then(console.log.bind(console))

        // localDB.sync(remoteDB, {
        //         live: true,
        //         retry: true
        //     })
        //     .on('active', function () {
        //         $rootScope.$apply(function () {
        //             $rootScope.sync = true;
        //         })
        //     })
        //     .on('paused', function () {
        //         $timeout(function() {
        //             $rootScope.sync = false;
        //         }, 500);
        //     })
        //     .then(() => {
        //         console.log("DESTROY!");
        //         return db.destroy();
        //     })
        //     .then(() => {
        //         return db.sync(localDB, {
        //             live: true,
        //             retry: true
        //         })
        //     }).catch(console.error.bind(console))
    }

    Auth.login = function (user) {
        return createUserDB(user, 'login');
    }

    Auth.signup = function (user) {
        return createUserDB(user, 'signup');
    }

    return Auth;
});
