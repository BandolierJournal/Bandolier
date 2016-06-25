/*jshint node: true*/
'use strict'
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
  constructor(props, type) {
    if (typeof props === 'string' || !props) {
      this.id = new Date().toISOString();
      this.title = props;
      this.bullets = [];
      this.type = type || 'generic'; // day, month, month-cal, future, generic
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
      return db.rel.find('collection', id)
      .then(convertToInstances)
      .catch(err => console.error(`Could not fetch collection ${id}: ${err}`));
  }

  static fetchAll(props) {
    return db.rel.find('collectionShort')
    .then(res => {
      if (props) return _.filter(res.collectionShorts, props)
      else return res.collectionShorts;
    })
    .then(collection => collection.map(collection => new Collection(collection)))
    .catch(err => console.error('could not fetch all collections'));
  }

}

module.exports = Collection;
