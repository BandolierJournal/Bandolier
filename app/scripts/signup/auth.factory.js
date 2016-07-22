/*jshint node:true, esversion:6*/
bulletApp.factory('AuthFactory', function ($state, $rootScope, $timeout) {

    const Auth = {};

    let syncStatus;
    let userSync;
    let localDB;
    let syncHandler;

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
            })
            .catch(err => console.error("Couldn't signin: ", err));
    }

    Auth.syncDB = function(username) {
        remoteDB = new PouchDB(remoteDBAddress + userDBUrl(username), {
            skipSetup: true
        });
        remoteDB.compact();

        localDB = require('./models')(username);
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
            return db.erase()
        })
        .then(() => {
            Collection = require('./models/collection')(localDB);
            Bullet = require('./models/bullet')(localDB);
            syncStatus = true
            $rootScope.$evalAsync()
            return userSync = localDB.sync(remoteDB, {
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
                        if ($state.current.name === 'landing') $state.go('index')
                    }, 500);
                })
        })
        .catch(console.error.bind(console));

    }

    Auth.login = function (user) {
        $state.go('landing', {login: true})
        return createUserDB(user, 'login');
    }

    Auth.signup = function (user) {
        $state.go('landing', {login: true})
        return createUserDB(user, 'signup');
    }

    Auth.stopSync = function () {
        userSync.cancel()
        syncStatus = false
    }

    Auth.startSync = function () {
        syncStatus = true
        Promise.resolve().then(() => {
          return userSync = localDB.sync(remoteDB, {
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

    Auth.toggleLogin = function () {
      if ($rootScope.user) {
        $state.go('landing', {login: true})
        remoteDB.logout()
        $rootScope.user = null
        syncStatus = false
        Collection = require('./models/collection')(db);
        Bullet = require('./models/bullet')(db);
        $state.go('index')
      } else {
        $state.go('signup');
      }
    }

    Auth.getSyncStatus = function () {
      return syncStatus;
    }

    Auth.setSyncStatus = function (bool) {
      if (typeof bool === 'boolean') syncStatus = bool;
    }

    return Auth;
});
