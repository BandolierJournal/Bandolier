/*jshint node: true, esversion: 6*/
'use strict';
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

	moveTo(collectionName, type) {
		const Collection = require('./collection');
		return Collection.fetchAll({title: collectionName, type: type})
		.then(collection => {
			let newBullet = this.createCopy();
			return Promise.all([newBullet, collection[0].addBullet(newBullet)]);
		})
		.catch(err => console.error(`Move Error: could not move ${this.content} to ${collection[0].title}`));
	}

	save() {
		if (this.content || this.rev) {
			if (!this.id) this.id = new Date().toISOString();
			return db.rel.save('bullet', this);
		}
	}

}

class Note extends Bullet {
	constructor(content) {
		super(content);
		this.type = 'Note';
	}
}

class DatedBullet extends Bullet {
	constructor(content, date, status) {
		super(content);
		this.date = date || this.date;
		this.status = status || this.status || 'incomplete';
	}

	schedule(date) {

	}


}


class Task extends DatedBullet {
	constructor(content, date, status) {
		super(content, date, status);
		this.type = 'Task';
	}

	migrate() {
		debugger;
		const nextMonth = Moment(this.date).add(1, 'month').startOf('month').toISOString();
		return this.moveTo(nextMonth, 'month')
		.then(res => {
			let newBullet = res[0];
			newBullet.date = nextMonth;
			this.status = 'migrated';
			return newBullet.save();
		})
		.catch(err => console.error('Migration Failed: ', err));
	}

	toggleDone() {
		if(this.status === 'migrated') return;
		this.status = this.status === 'incomplete' ? 'complete' : 'incomplete';
	}

}

class EventBullet extends DatedBullet {
	constructor(content, date, status) {
		super(content, date, status);
		this.type = 'Event';
	}
}


const Bullets = {
	Task: Task,
	Event: EventBullet,
	Note: Note
};

module.exports = Bullets;
