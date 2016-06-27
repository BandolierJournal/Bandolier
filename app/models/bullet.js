/*jshint node: true*/
'use strict'
const db = require('./index');
const _ = require('lodash');

class Bullet {
	constructor(content) {
		if (typeof content === 'string' || !content) {
			this.id = new Date().toISOString();
			this.content = content;
			this.strike = false;
		} else {
			_.extend(this, content);
		}
	}

	toggleStrike() {
		this.strike = !this.strike;
	}

	save() {
		return db.rel.save('bullet', this);
	}
}



// TODO:
// from: @octowl
// to: @sechu
// Should the status be something that other kinds of bullets also have?
// If so, it should be on the parent Bullet class

class Task extends Bullet {
	constructor(content, date, status) {
		super(content);
		this.date = date || this.date;
		this.status = status || this.status || 'incomplete'; // complete, migrated, scheduled ?
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
