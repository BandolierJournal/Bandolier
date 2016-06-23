/*jshint node: true*/
const db = require('./index');
const _ = require('lodash');

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

}

module.exports = Collection;
