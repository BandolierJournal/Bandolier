var PouchDB = require('pouchdb');
PouchDB.plugin(require('relational-pouch'));

var db = new PouchDB('bullet');
var remoteDB = new PouchDB('http://localhost:5984/bullet');

db.sync(remoteDB, {
  live: true,
  retry: true
});

db.setSchema([
    {
        singular: 'collection',
        plural: 'collections',
        relations: {
            'bullets': {hasMany: 'bullet'}
        }
    },
    {
		singular: 'bullet',
		plural: 'bullets',
		relations: {
			'collections': {hasMany: 'collection'}
		}
	}
])

module.exports = db;
