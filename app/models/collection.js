/*jshint node: true, esversion: 6*/
'use strict'

const db = require('./index');
const _ = require('lodash');

const Bullet = require('./bullet');

function convertToInstances(res) {
    const bullets = res.bullets;
    const collections = res.collections.map(collection => {
        return new Collection(collection).deserializeBullets(bullets);
    });

    return collections.length > 1 ? collections : collections[0];
}

class Collection {
    constructor(props, type) {
        if (typeof props === 'string' || !props) {
            this.id = new Date().toISOString();
            this.title = props;
            this.bullets = [];
            this.type = type || 'generic'; // day, month, month-cal, future, generic
        } else {
            _.extend(this, props);
        }
    }

    deserializeBullets(bulletInstances) {
        this.bullets = this.bullets.map(bulletId => {
            const bullet = bulletInstances.find(b => b.id === bulletId);
            return new Bullet[bullet.type](bullet);
        });
        return this;
    }

    serializeBullets() {
        if(this.bullets.every(b => typeof b !== "string")){
            this.bullets = this.bullets.map(bullet => bullet.id); //beforeSave, converts bullet instances to ids
        }
    }

    addBullet(bullet, index) {
        index = index || this.bullets.length; //so we can preserver ordering in collections.bullet array
        this.bullets = this.bullets.slice(0, index).concat(bullet).concat(this.bullets.slice(index));
        if (bullet.collections.indexOf(this.id) < 0) bullet.collections.push(this.id)
        return Promise.all([this.save(), bullet.save()])
            .catch(err => console.error('error ', err))
    }

    removeBullet(bullet) {
        let bulletIdx = this.bullets.indexOf(bullet.id);
        if (bulletIdx > -1) {
            this.bullets.splice(bulletIdx, 1);
        }
        return this.save();
    }

    save() {
        const bulletInstances = this.bullets;
        this.serializeBullets();
        return db.rel.save('collection', this).then(() => {
            this.bullets = bulletInstances;
            return this;
        })
    }
    static fetchById(id) {  //can delete
        return db.rel.find('collection', id)
            .then(convertToInstances)
            .catch(err => console.error(`Could not fetch collection ${id}: ${err}`));
    }

    static findOrReturn(props) {
        return db.rel.find('collection', props.id)
            .then(convertToInstances)
            .catch(err => {
                console.log('created new collection');
                return new Collection(props); //this does NOT create instance in database
            });
    }

    static fetchAll(props) {
        return db.rel.find('collectionShort')
            .then(res => {
                if (props) return _.filter(res.collectionShorts, props);
                else return res.collectionShorts;
            })
            .then(collections => collections.map(collection => new Collection(collection)))
            .catch(err => console.error('could not fetch all collections'));
    }


    static fetchAllWithBullets(props) {     //can delete
        return this.fetchAll(props) // andrew's refactoring comment
            .then(collections => {
                return Promise.all(collections.map(collection => this.fetchById(collection.id)));
            })
            .catch(err => console.error('could not fetch all collections'));
    }

}

module.exports = Collection;
