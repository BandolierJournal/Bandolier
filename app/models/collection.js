/*jshint node: true, esversion: 6*/
'use strict';

// const db = require('./index')('bullet');
const _ = require('lodash');
const Moment = require('moment');


module.exports = function(db) {
    const Bullet = require('./bullet')(db);

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
            if (bullet.collections.includes(this.id)) return;
            bullet.collections.push(this.id);
            if (!bullet.date && Moment(new Date(this.title)).isValid()) bullet.date = this.title;

            //add to other collection check
            if (this.type === 'month-cal') {
                Collection.fetchAll({ title: Moment(bullet.date).startOf('day').toISOString(), type: 'day' })
                    .then(c => c[0].addBullet(bullet))
                    .catch(err => console.error(err));
            }

            return Promise.all([this.save(), bullet.save()])
                .catch(err => console.error('error ', err));
        }

        delete() {
            if (this.rev && this.type === 'generic') {
                let removingBullets = this.bullets.map(bullet => this.removeBullet(bullet));

                return Promise.all(removingBullets)
                    .then(() => db.rel.del('collections', this))
                    .catch(err => console.error(err));
            }
        }

        removeBullet(bullet) {
            let bulletPromise = function() {};
            let bulletIdx = this.bullets.indexOf(bullet);
            if (bulletIdx > -1) {
                bulletPromise = bullet.save.bind(bullet)
                this.bullets.splice(bulletIdx, 1);
                let collectionIdx = bullet.collections.indexOf(this.id);
                if (collectionIdx > -1) {
                    bullet.collections.splice(collectionIdx, 1);
                    if (bullet.collections.length < 1) {
                        bulletPromise = bullet.delete.bind(bullet)
                    }
                } else throw new Error('Database is so broken...')
            }
            return Promise.all([this.save(), bulletPromise()])
                .catch(err => console.error('error ', err))
        }

        save() {
            let bulletInstances = this.bullets;
            this.serializeBullets();
            return db.rel.save('collection', this).then(() => {
                this.bullets = bulletInstances;
                return this;
            });
        }

        update() {
            return Collection.findOrReturn(this);
        }

        static findOrReturn(props) {
            return db.rel.find('collection', props.id)
                .then(res => {
                    if (res.collections.length > 1) res.collections = [res.collections.find(c => c.id === props.id)]; //this is a hack to fix something wierd in PouchDB
                    return res.collections.length ? convertToInstances(res) : [new Collection(props)];
                })
                .catch(err => console.error(err));
        }

        static fetchAll(props) {
            return db.rel.find('collection')
                .then(res => {
                    return convertToInstances(res)
                })
                .then(collections => {
                    if (props) collections = _.filter(collections, props);
                    return collections.length ? collections : [new Collection(props)];
                })
                .catch(err => console.error('could not fetch all collections', err));
        }
    }

    return Collection;
};
