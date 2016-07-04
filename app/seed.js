
var db = require('./models')('bullet');
var Collection = require('./models/collection')(db);
var Bullet = require('./models/bullet')(db);
var chance = require('chance')(123);
var Promise = require('bluebird');

var bullets = [];
var status = ['incomplete', 'complete'];

function generateTaskBullet(i) {
    return new Bullet.Task({
        id: i.toString(),
        content: chance.sentence(),
        date: new Date(2016, Math.floor(i / 12), chance.integer({
            min: 1,
            max: 28
        })),
        status: chance.pickone(status)
    });
}

for (var i = 0; i < 120; i++) {
    bullets.push(generateTaskBullet(i));
}

bullets.push(new Bullet.Event({
    id: '120',
    content: 'Fullstack Hot Seat',
    date: new Date(2016, 5, 24)
}));

bullets.push(new Bullet.Note({
    id: '121',
    content: chance.sentence()
}));

var collections = [];

for (var j = 0; j < 12; j++) {
    var thisBullet = bullets.map(e => e.id).slice(j * 12, j * 12 + 12);

    collections.push(new Collection({
        title: new Date(2016, j, chance.integer({min: 1, max:28})),
        id: j.toString(),
        bullets: thisBullet,
        type: 'day'
    }));
}

collections.push(new Collection({
    title: 'Random thoughts',
    id: '13',
    bullets: ['120', '121'],
    type: 'generic'
}));

collections.push(new Collection({
    title: new Date(2016, 5, 28),
    id: '14',
    bullets: ['61', '62'],
    type: 'day'
}));

collections.push(new Collection({
    title: new Date(2016, 6, 03),
    id: '16',
    bullets: ['7', '20'],
    type: 'day'
}));

collections.push(new Collection({
    title: new Date(2016, 0, 1),
    id: '15',
    bullets: ['1', '2'],
    type: 'month-cal'
}));

Promise.map([...bullets, ...collections], function(doc){
    return doc.save();
})
.then(allthethings => {
    console.log(allthethings);
    console.log('Seed Successful!');
    process.kill(0);
})
.catch(function (err) {
    console.error("Shit's broken: ", err);
    process.kill(1);
})
