/*jshint node: true, esversion: 6*/
'use strict';
const PouchDB = require('pouchdb');
const db = require('./models');
const remoteDB = new PouchDB('http://localhost:5984/bullet');
const Moment = require('moment');
const Collection = require('./models/collection');
const Bullet = require('./models/bullet');

const bulletApp = angular.module('bulletApp', ['ui.router', 'ui.bootstrap', 'ngSanitize']);

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

bulletApp.config(function($urlRouterProvider) {
    $urlRouterProvider.otherwise('/index');
});

db.sync(remoteDB, {
    live: true,
    retry: true
});
