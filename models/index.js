var PouchDB = require('pouchdb');

var db = new PouchDB('bullet');

db.setSchema([
    {
        singular: 'collection',
        plural: 'collections',
        relations: {
            bullet: {hasMany: 'bullet'}
        }
    }
]);

module.exports = db;
