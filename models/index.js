var PouchDB = require('pouchdb');
PouchDB.plugin(require('relational-pouch'));

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

db.setSchema([
	{
		singular: 'bullet',
		plural: 'bullets',
		relations: {
			collection: {hasMany: 'collection'}
		}	
	}
])

module.exports = db;
