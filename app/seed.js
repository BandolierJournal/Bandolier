var db = require('./models')
var Collection = require('./models/collection')
var Bullet = require('./models/bullet')

var bullets = [
  new Bullet.Task({id: 1, content: 'Task 1', date: 'Today', status: 'complete'}), // TODO: Fix these dates, they are just for lolz right now
  new Bullet.Event({id: 2, content: 'Event 1', date: 'Yesterday'}),
  new Bullet.Note({id: 3, content: 'Note 1'})
]

var collections = [
  new Collection({
    title: 'Collection1',
    id: 4,
    bullets: [bullets[1].id, bullets[0].id]
  }),
  new Collection({
    title: 'Collection2',
    id: 5,
    bullets: [bullets[0].id, bullets[2].id]
  })
];

Promise.all(
   (bullets.map(bullet => bullet.save())).concat(
   collections.map(collection => collection.save()))
 )
.then(allthethings => {
  console.log(allthethings)
  console.log('Seed Successful!')
  process.kill(0)
})
.catch(function(err){
  console.error("Shit's broken: ", err);
  process.kill(1)
})
