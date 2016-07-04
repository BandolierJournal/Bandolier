/*jshint node: true, esversion: 6*/
'use strict';
const PouchDB = require('pouchdb');
let db = require('./models')('userdb-706f7461746f');
const remoteDBAddress = 'http://localhost:5984/';
const Moment = require('moment');
let Collection = require('./models/collection')(db);
let Bullet = require('./models/bullet')(db);

let remoteDB; // = new PouchDB(remoteDBAddress + 'bullet');
remoteDB = new PouchDB(remoteDBAddress + 'userdb-706f7461746f', {skipSetup: true});

const bulletApp = angular.module('bulletApp', ['ui.router', 'ui.bootstrap', 'ngSanitize']);

bulletApp.config(function($urlRouterProvider){
    $urlRouterProvider.otherwise('/index');
});
db.sync(remoteDB, {
    live: true,
    retry: true
}).on('error', console.log.bind(console));

remoteDB.login('potato', 'potato').then((res) => {
    console.log(res);
    return remoteDB.getSession()
})
.then(console.log.bind(console));
