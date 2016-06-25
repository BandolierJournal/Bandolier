'use strict';
const PouchDB = require('pouchdb');
const db = require('./models');
const bulletApp = angular.module('bulletApp', ['ui.router', 'ui.bootstrap']);
const remoteDB = new PouchDB('http://localhost:5984/bullet');

db.sync(remoteDB, {
  live: true,
  retry: true
});

bulletApp.config(function($urlRouterProvider){
    $urlRouterProvider.otherwise('/index')
});
