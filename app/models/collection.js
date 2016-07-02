/*jshint node: true, esversion: 6*/
'use strict'

const db = require('./index');
const _ = require('lodash');
const Moment = require('moment');

const Bullet = require('./bullet');

function convertToInstances(res) {
    const bullets = res.bullets;
    const collections = res.collections.map(collection => {
        return new Collection(collection).deserializeBullets(bullets);
    });

    return collections;
}

class Collection {
    constructor(props, type) {
        if (typeof props === 'string' || !props) {
            this.id = new Date().toISOString();
            this.title = props;
            this.bullets = [];
            this.type = type || 'generic'; // day, month, month-cal, future, generic
        } else {
            if (!this.id) this.id = new Date().toISOString();
            if (!this.title) this.title = props;
            if (!this.bullets) this.bullets = [];
            _.extend(this, props);
        }
    }

    deserializeBullets(bulletInstances) {
        this.bullets = this.bullets.map(bulletId => {
            let bullet = bulletInstances.find(b => b.id === bulletId);
            return new Bullet[bullet.type](bullet);
        });
        return this;
    }

    serializeBullets() {
        if (this.bullets.every(b => typeof b !== "string")) {
            this.bullets = this.bullets.map(bullet => bullet.id); //beforeSave, converts bullet instances to ids
        }
    }

    addBullet(bullet) {
        bullet.id = bullet.id || new Date().toISOString();
        if (this.bullets.find(b => b.id === bullet.id)) return;
        this.bullets.push(bullet);
        bullet.collections.push(this.id);

        if(!bullet.date && Moment(this.title).isValid()) bullet.date = this.title;

        //add to other collections check
        let search;
        if (this.type === 'month-cal' || bullet.type === 'Event') search = { title: Moment(bullet.date).startOf('day').toISOString(), type: 'day' };
        if (this.type === 'future') search = { title: this.title, type: 'month' };
        if (search) {
            Collection.fetchAll(search)
                .then(c => c[0].addBullet(bullet))
                .catch(err => console.error(err));
        }

        return Promise.all([this.save(), bullet.save()])
        .catch(err => console.error('error ', err));
    }

    removeBullet(bullet) {
        let bulletIdx = this.bullets.indexOf(bullet.id);
        if (bulletIdx > -1) {
            this.bullets.splice(bulletIdx, 1);
        }
        return this.save();
    }

    save() {
        let bulletInstances = this.bullets;
        this.serializeBullets();
        return db.rel.save('collection', this).then(() => {
            this.bullets = bulletInstances;
            return this;
        });
    }

    static findOrReturn(props) {
        return db.rel.find('collection', props.id)
            .then(res => {
                console.log(res)
                if (res.collections.length > 1) res.collections = [res.collections.find(c => c.id === props.id)]; //this is a hack to fix something wierd in PouchDB
                return res.collections.length ? convertToInstances(res) : [new Collection(props)];
            })
            .catch(err => console.error(err));
    }

    static fetchAll(props) {
        return db.rel.find('collection')
            .then(res => convertToInstances(res))
            .then(collections => {
                if (props) collections = _.filter(collections, props);
                return collections.length ? collections : [new Collection(props)];
            })
            .catch(err => console.error('could not fetch all collections', err));
    }
}

module.exports = Collection;
