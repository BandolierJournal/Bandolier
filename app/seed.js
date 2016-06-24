var db = require('./models')
var Collection = require('./models/collection')
var Bullet = require('./models/bullet')
var chance = require('chance')(123);



var bullets = [];
var status = ['incomplete', 'complete']

function generateTaskBullet(i) {
  return new Bullet.Task({id: i.toString(), content: chance.sentence({words: 5}), date: new Date(2016, Math.floor(i/12), chance.integer({min: 1, max: 28})), status: chance.pickone(status)})
}

for (var i = 0; i < 120; i++) {
  bullets.push(generateTaskBullet(i));
}

bullets.push(new Bullet.Event({id: '120', content: 'Fullstack Hot Seat', date: new Date(2016, 5, 24)}));
bullets.push(new Bullet.Note({id: '121', content: 'Super frustrating day trying to debug electron/node/pouchdb/leveldown'}));

var collections = [];

for (var i = 0; i < 12; i++) {

  var thisBullet = bullets.map(e => e.id).slice(i*10, i*10+10);

  collections.push(new Collection({
    title: new Date(2016, i),
    id: i.toString(),
    bullets: thisBullet,
    type: 'month'
  }))
}

collections.push(new Collection({
  title: 'Random thoughts',
  id: '13',
  bullets: ['120', '121'],
  type: 'generic'
}));

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


