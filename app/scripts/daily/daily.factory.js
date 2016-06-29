bulletApp.factory('DateFactory', function() {
	let today = new Date();

	function roundDate(date) {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	}

	function roundMonth(date) {
		return new Date(date.getFullYear(), date.getMonth());
	}

	function display(date, type) { // where date is always given as the top left index
		let display = [];
		let date = date || today; // type is 'month' or 'day'
		let rounded = (type==='day') ? roundDate(date) : roundMonth(date);
		for (let i = 1; i > -5; i--) {
            display.push(Moment(rounded).subtract(i, type+'s').toISOString());
        }
        return display.map(el => new Collection(el, type+'s'));
	}

	function display(month) {
		let months = [];
		let month = month || today;
		let rounded = roundMonth(month);
		for (let i = 0; i > -6; i--) {
            days.push(Moment(date).subtract(i, 'days').toISOString());
        }
        return days.map(day => new Collection(day, 'day'));
	}

	return {
		displayDays: displayDays,
		roundDate: roundDate
	}
})