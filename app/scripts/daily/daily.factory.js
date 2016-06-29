bulletApp.factory('DateFactory', function() {
	const today = roundDate(new Date());

	function roundDate(date) {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	}

	function roundMonth(date) {
		return new Date(date.getFullYear(), date.getMonth());
	}

	function display(offset, type) { // where date is always given as the top left index
		const display = [];

		const rounded = (type==='day') ? roundDate(today) : roundMonth(today);
		for (let i = 1; i > -5; i--) {
            display.push(Moment(rounded).subtract(i-offset, type+'s').toISOString());
        }
        return display.map(el => new Collection(el, type));
	}

	function monthCal(month) {
		month = new Date(month);
		let day = month;
		const dayArray = [day.toISOString()];
		while (day.getMonth()==month.getMonth()) {
			day = Moment(day).add(1, 'days').toISOString();
			dayArray.push(day);
			day = new Date(day);
		}
		return dayArray.map(getWeekday);
	}

	function getWeekday(date) {
		let weekday = Moment(date).isoWeekday();
		weekday = Moment().isoWeekday(weekday).format('ddd')
		return weekday;
	}

	return {
		display: display,
		roundDate: roundDate,
		roundMonth: roundMonth,
		monthCal: monthCal
	}
})