// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
require('electron-cookies');

let db = require('./models')('bullet', {auto_compaction: true});
let Collection = require('./models/collection')(db);
let Bullet = require('./models/bullet')(db);
const remoteDBAddress = require('./secrets.json').dbURL;
const Moment = require('moment');

console.log(remoteDBAddress);

const typeDict = {
    "Task": "fa-circle-o",
    "Event": "fa-first-order",
    "Note": "fa-long-arrow-right",
    "incomplete": "fa-circle-o",
    "complete": "fa-check-circle-o", //fa-check-square-o"
    "migrated": "fa-sign-out",
    "scheduled": "fa-angle-double-left",
    "struck": "strikethrough"
};

function userDBUrl(username){
    return `userdb-${username.toHex()}`;
}

String.prototype.toHex = function () {
    return this.split('').map(c => c.charCodeAt(0).toString(16)).join('');
};

let remoteDB = new PouchDB(remoteDBAddress);
