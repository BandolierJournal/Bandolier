/*jshint node:true, esversion:6*/
bulletApp.factory('AuthFactory', function ($state) {
    let userDB;
    let remoteDB;
    let username;

    String.prototype.toHex = function () {
        return this.split('').map(c => c.charCodeAt(0).toString(16)).join('')
    }

    function createUserDB(user, verb) {
        username = user.email.split('@')[0];
        remoteDB = new PouchDB(remoteDBAddress + 'userdb-' + username.toHex(), {skipSetup: true});
        return remoteDB[verb](username, user.password)
            .then(res => {
                console.log(res);
                userDB = require('./models')('userdb-' + username.toHex());
                Collection = require('./models/collection')(userDB);
                Bullet = require('./models/bullet')(userDB);
            })
            .then(() => {
                // userDB.sync(remoteDB, {
                //     live: true,
                //     retry: true
                // })
            })
            .catch(err => console.error("Couldn't signin: ", err));
    }

    return {
        login: function (user) {
            return createUserDB(user, 'login')
                .then(() => $state.go('index'))
        },
        signup: function (user) {
            return createUserDB(user, 'signup')
                .then(() => $state.go('index'))
        }
    }
});
