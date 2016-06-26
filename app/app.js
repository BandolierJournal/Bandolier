/*jshint node: true, esversion: 6*/
'use strict';
const PouchDB = require('pouchdb');
const db = require('./models');
const remoteDB = new PouchDB('http://localhost:5984/bullet');

const bulletApp = angular.module('bulletApp', ['ui.router', 'ui.bootstrap', 'content-editable']);

bulletApp.config(function($urlRouterProvider){
    $urlRouterProvider.otherwise('/index');
});

db.sync(remoteDB, {
    live: true,
    retry: true
});
