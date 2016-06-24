var db = require('./models')
var Collection = require('./models/collection')
var Bullet = require('./models/bullet')

var bullets = [
  new Bullet.Task({id: 1, content: 'Get drycleaning! ASAP', date: new Date(2016, 5, 25), status: 'complete'}), // TODO: Fix these dates, they are just for lolz right now
  new Bullet.Event({id: 2, content: 'Fullstack Hot Seat', date: new Date(2016, 5, 24)}),
  new Bullet.Note({id: 3, content: 'Super frustrating day trying to debug electron/node/pouchdb/leveldown'})
]

var collections = [
  new Collection({
    title: new Date(2016, 5),
    id: 4,
    bullets: [bullets[1].id, bullets[0].id],
    type: 'month'
  }),
  new Collection({
    title: 'Random thoughts',
    id: 5,
    bullets: [bullets[0].id, bullets[2].id],
    type: 'generic'
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


