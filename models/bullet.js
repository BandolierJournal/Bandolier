// TODO: Bullet definition
class Bullet {
	constructor(content) {
		this.id = new Date().toISOString();
		this.content = content;
	}
}

class Task extends Bullet {
	constructor(content, status, date) {
		super(content);
		this.status = status || 'incomplete'; // complete, migrated, scheduled ?
		this.date = date;
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