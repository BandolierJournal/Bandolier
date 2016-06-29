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
            if (!this.id) this.id = new Date().toISOString();
            if (!this.title) this.title = props;
            if (!this.bullets) this.bullets = [];
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
        bullet = new Bullet[bullet.type](bullet) //this attaches id if needed
        index = index || this.bullets.length; //so we can preserve ordering in collections.bullet array
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


    static findOrReturn(props) {
       return db.rel.find('collection', props.id)
           .then(res => {
               if (res.collections.length > 1) res.collections = [res.collections.find(c => c.id === props.id)]; //this is a hack to fix something wierd in PouchDB
               if (!res.collections.length) return new Collection(props)
               else return convertToInstances(res);
           })
           .catch(err => console.error(err));
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

    //Not sure this is needed, but it works
    static fetchAllWithBullets(props) {
      return db.rel.find('collection')
          .then(res => {
              if (props) {
                res.collections = _.filter(res.collections, props);
              }
              return res;
          })
          .then(res => {
              return Promise.all(res.collections.map(collection => convertToInstances({collections: [collection], bullets: res.bullets})));
          })
          .catch(err => console.error('could not fetch all collections'));
    }
}

module.exports = Collection;
