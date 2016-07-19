/*jshint node:true, esversion:6*/
bulletApp.factory('AuthFactory', function ($state, $rootScope, $timeout) {

    const Auth = {};

    function createUserDB(user, verb) {
        console.log('createUserDB', user)
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

        localDB = require('./models')(username);
        console.log(localDB)
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
            console.log(db)
            Collection = require('./models/collection')(localDB);
            Bullet = require('./models/bullet')(localDB);
            syncStatus = true
            $rootScope.$evalAsync()
            $state.go('landing')
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

    Auth.login = function (user) {
        return createUserDB(user, 'login');
    }

    Auth.signup = function (user) {
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

    Auth.logout = function () {
      if ($rootScope.user) {
        remoteDB.logout()
        // let defaultRemote = new PouchDB(remoteDBAddress, {skipSetup: true});
        // defaultRemote.logout()
        $rootScope.user = null
        syncStatus = false
        Collection = require('./models/collection')(db);
        Bullet = require('./models/bullet')(db);
        $state.go('landing')
      } else {
        $state.go('signup');
      }
    }

    return Auth;
});
