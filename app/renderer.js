// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
require('electron-cookies');

let db, Collection, Bullet;
const remoteDBAddress = 'http://localhost:5984/';
const Moment = require('moment');

function userDBUrl(username){
    return `userdb-${username.toHex()}`;
}

String.prototype.toHex = function () {
    return this.split('').map(c => c.charCodeAt(0).toString(16)).join('');
};

let remoteDB = new PouchDB(remoteDBAddress + 'default');

remoteDB.getSession()
.then(res => {
    let username = res.userCtx.name;
    if(username) {
        db = require('./models')(userDBUrl(username));
        remoteDB = new PouchDB(remoteDBAddress + userDBUrl(username));
    } else {
        db = require('./models')('default');
    }

    Collection = require('./models/collection')(db);
    Bullet = require('./models/bullet')(db);

    db.sync(remoteDB, {
        live: true,
        retry: true
    })
});
