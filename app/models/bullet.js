/*jshint node: true*/
'use strict'
const db = require('./index');
const _ = require('lodash');
const Moment = require('moment');

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

	createCopy() {
		let newBullet = new Bullets[this.type](this.content);
		newBullet.type = this.type;
		return newBullet;
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

	migrate() {
		const Collection = require('./collection');
		const nextMonth = Moment(this.date).add(1, 'month').startOf('month').toISOString();
		return Collection.fetchAll({title: nextMonth, type: 'month'})
		.then(collection => {
			let newBullet = this.createCopy()
			newBullet.date = nextMonth;
			return collection[0].addBullet(newBullet)
		})
		.then(res => this.status = 'migrated')
		.catch(err => console.error('Migration Failed: ', err));
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
