/*jshint node: true, esversion: 6*/
'use strict';
const PouchDB = require('pouchdb');
const db = require('./models')('bullet');
const remoteDBAddress = 'http://localhost:5984/';
const Moment = require('moment');
const Collection = require('./models/collection')(db);
const Bullet = require('./models/bullet')(db);

const bulletApp = angular.module('bulletApp', ['ui.router', 'ui.bootstrap', 'ngSanitize']);

bulletApp.config(function($urlRouterProvider){
    $urlRouterProvider.otherwise('/index');
});



// db.sync(remoteDB, {
//     live: true,
//     retry: true
// });
