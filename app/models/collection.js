/*jshint node: true*/
'use strict'
const db = require('./index');
const _ = require('lodash');

const Bullet = require('./bullet');

function convertToInstances(res) {
    var resOut = {};

    resOut.bullets = res.bullets.map(bullet => new Bullet[bullet.type](bullet));
    if (res.collections.length > 1) {
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

    removeBullet(bullet) {
        let bulletIdx = this.bullets.indexOf(bullet.id);
        if (bulletIdx > -1) {
            this.bullets.splice(bulletIdx, 1);
        }
        return this.save();
    }

    save() {
        return db.rel.save('collection', this)
    }

    static fetchById(id) {
        return db.rel.find('collection', id)
            .then(convertToInstances)
            .catch(err => console.error(`Could not fetch collection ${id}: ${err}`));
    }

}

module.exports = Collection;
