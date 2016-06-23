var db = require('./models')
var Collection = require('./models/collection')
var Bullet = require('./models/bullet')
var requireNew = require('require-new')
//
// var bullet1 =   new Bullet.Task('Task 1', 'Today'), // TODO: Fix these dates, they are just for lolz right now
// setTimeout('1000')
// var bullet2 = new Bullet.Event('Event 1', 'Yesterday'),
// var bullet3 = new Bullet.Note('Note 1')

var bullets = [
  new Bullet.Task({id: 1, content: 'Task 1', date: 'Today', status: 'complete'}), // TODO: Fix these dates, they are just for lolz right now
  new Bullet.Event({id: 2, content: 'Event 1', date: 'Yesterday'}),
  new Bullet.Note({id: new Date().toISOString(), content: 'Note 1'})
]

var collections = [
  new Collection({
    title: 'Collection1',
    id: 4,
    bullets: []
  }),
  new Collection({
    title: 'Collection2',
    id: 5,
    bullets: [bullets[0].id, bullets[2].id]
  })];

// console.log(collections,'\n', bullets);

db.allDocs()
.then(allDocs => {
  console.log(allDocs.rows)
  return Promise.all(allDocs.rows.map(doc => db.rel.del(doc.id.split('_')[0],doc)))
})
.then(() => db.compact())
// // db.destroy()
// // .then(() => db = requireNew('./models'))
.then(() => {
  // console.log(db)
  return Promise.all([
    ...bullets.map(bullet => bullet.save()),
    ...collections.map(collection => collection.save())
  ])
})
.then(allthethings => console.log(allthethings))
.catch(function(err){
  console.error("Shit's broken: ", err);
})
// db.rel.save('bullet', new Bullet())
