var PouchDB = require('pouchdb');
PouchDB.plugin(require('relational-pouch'))
var db = new PouchDB('bullet');

var remoteDB = new PouchDB('http://localhost:5984/bullet')

db.setSchema([
    {
        singular: 'collection',
        plural: 'collections',
        relations: {
            'bullets': {hasMany: 'bullet'}
        }
    }
]);

module.exports = db;
