// var PouchDB = require('pouchdb');
// PouchDB.plugin(require('relational-pouch'));
// PouchDB.plugin(require('pouchdb-authentication'));


module.exports = function(dbname) {
    var db = new PouchDB(dbname, { auto_compaction: true });

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
    ]);

    return db;
};
