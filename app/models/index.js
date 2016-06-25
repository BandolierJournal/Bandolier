var PouchDB = require('pouchdb');
PouchDB.plugin(require('relational-pouch'));

var db = new PouchDB('bullet');

db.setSchema([
    {
      singular: 'collection',
      plural: 'collections',
      relations: {
          'bullets': {hasMany: 'bullet'}
      }
    },
    {
      singular: 'collectionShort',
      plural: 'collectionShorts',
      documentType: 'collection'
    },
    {
  		singular: 'bullet',
  		plural: 'bullets',
  		relations: {
  			'collections': {hasMany: 'collection'}
  		}
    },
    {
      singular: 'bulletShort',
      plural: 'bulletShorts',
      documentType: 'bullet'
    }
])

module.exports = db;
