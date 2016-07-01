/*jshint node: true*/
'use strict'
const db = require('./index');
const _ = require('lodash');
const moment = require('moment');


class Bullet {
	constructor(content) {
		if (typeof content === 'string' || !content) {
			this.content = content;
			this.strike = false;
			this.collections = [];
		} else {
			if (!this.id) this.id = new Date().toISOString();
			if (!this.strike) this.strike = false;
			if (!this.collections) this.collections = [];
			_.extend(this, content);
		}
	}

	toggleStrike() {
		this.strike = !this.strike;
	}

	save() {
		if (this.content || this.rev) {
			if (!this.id) this.id = new Date().toISOString();
			return db.rel.save('bullet', this);
		}
	}

	convert() {	//not in use yet
    	return new Bullet[this.type](this);
	}

	migrate() {
		let destBullet = new Bullet(this.content)
		destBullet.type = this.type

		destBullet.date = moment(this.date).add(1, 'month').startOf('month').toISOString();
		return (function FetchAllWithoutBullets () {
			return db.rel.find('collectionShorts')
			.then(res => res.collectionShorts.find(r => r.title === destBullet.date && r.type === 'month'))
			.then(match => {
				const Collection = require('./collection');
				match = match ? new Collection (match) : new Collection(destBullet.date, 'month')
				return match.addBullet(destBullet)
			})
		})()
		.then(res => this.status = 'migrated')
		.catch(err => console.error('//this never runs because code is perfect', err))
	}

	static fetchById(id) {	//not in use yet
		return db.rel.find('bulletShort', id)
			.then(bullet => bullet.convert)
			.catch(err => console.error(`Could not fetch bullet ${id}: ${err}`))
	}
}


class Task extends Bullet {
	constructor(content, date, status) {
		super(content);
		this.date = date || this.date;
		this.status = status || this.status || 'incomplete'; // complete, migrated, scheduled, struckout
		this.type = 'Task';
	}

	toggleDone() {
		this.status = this.status === 'incomplete' ? 'complete' : 'incomplete';
	}

}

class EventBullet extends Bullet {
	constructor(content, date) {
		super(content);
		this.date = date || this.date;
		this.type = 'Event';
	}
}

class Note extends Bullet {
	constructor(content) {
		super(content);
		this.type = 'Note';
	}
}

const Bullets = {
	Task: Task,
	Event: EventBullet,
	Note: Note
};

module.exports = Bullets;
