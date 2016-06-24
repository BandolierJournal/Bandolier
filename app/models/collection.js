/*jshint node: true*/
const db = require('./index');
const _ = require('lodash');

const Bullet = require('./bullet');

function convertToInstances(res) {
    var resOut = {};

    resOut.bullets = res.bullets.map(bullet => new Bullet[bullet.type](bullet));
    if(res.collections.length > 1) {
        resOut.collections = res.collections.map(collection => new Collection(collection));
    } else {
        resOut.collection = new Collection(res.collections[0]);
    }
    return resOut;
}

class Collection {
  constructor(props) {
    if (typeof props === 'string' || !props) {
      this.id = new Date().toISOString();
      this.title = props;
      this.bullets = [];
    } else {
      _.extend(this, props)
    }
  }
  addBullet(bullet) {
    this.bullets.push(bullet.id);
    this.save();
  }

  save() {
    return db.rel.save('collection', this)
  }

  static fetchById(id) {
      if (!id) console.error(`Must fetch an id. id is ${id}: ${err}`)
      id = id + "" //We can take this out when our code is perfect
      return db.rel.find('collection', id)
      .then(convertToInstances)
      .catch(err => console.error(`Could not fetch collection ${id}: ${err}`));
  }

}

module.exports = Collection;
