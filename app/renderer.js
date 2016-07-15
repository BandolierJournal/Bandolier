// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
require('electron-cookies');

let db = require('./models')('bullet', { auto_compaction: true });
let Collection = require('./models/collection')(db);
let Bullet = require('./models/bullet')(db);
const remoteDBAddress = require('./secrets.json').dbURL;
const Moment = require('moment');

const typeDict = {
    "Task": "fa-circle-o btn-clickable",
    "Event": "fa-first-order",
    "Note": "fa-long-arrow-right",
    "incomplete": "fa-circle-o btn-clickable",
    "complete": "fa-check-circle-o btn-clickable", //fa-check-square-o"
    "migrated": "fa-angle-double-right clickable",
    "scheduled": "fa-angle-double-left clickable",
    "struck": "strikethrough fa-remove btn-clickable",
    "toMigrate": "fa-paper-plane",
    "toSchedule": "fa-calendar",
    "toThread": "fa-link",
};

function userDBUrl(username) {
    return `userdb-${username.toHex()}`;
}

String.prototype.toHex = function() {
    return this.split('').map(c => c.charCodeAt(0).toString(16)).join('');
};

let remoteDB = new PouchDB(remoteDBAddress);
