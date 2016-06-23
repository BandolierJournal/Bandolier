/*jshint node: true*/
const db = require('./index');
const _ = require('lodash');

class Bullet {
	constructor(content) {
		if (typeof content === 'string' || !content) {
			this.id = new Date().toISOString();
			this.content = content;
		} else {
			_.extend(this, content)
		}
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
	}
}

class EventBullet extends Bullet {
	constructor(content, date) {
		super(content);
		this.date = date || this.date;
	}
}

class Note extends Bullet {
	constructor(content) {
		super(content);
	}
}

Bullet.prototype.test = function() {
	return this._id;
}

module.exports = {
	Task: Task,
	Event: EventBullet,
	Note: Note
}
