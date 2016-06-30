bulletApp.factory('DateFactory', function() {
    let today = Moment().startOf('day').toISOString(); // TODO: make this a function (so today is always up to date)
    let yesterday = Moment(today).subtract(1, 'days').toISOString();
    let thisMonth = Moment().startOf('month').toISOString();
    let lastMonth = Moment(thisMonth).subtract(1, 'months').toISOString();

    function splitCollections(collections) {

        let last = (collections[0].type === "day") ? yesterday : lastMonth;
        let split = _.partition(collections, function(c) {
            return c.title < last;
        })
        let aged = split[0].sort(chronoSort);
        let future = split[1];
        return [aged, future];
    }

    function chronoSort(a, b) {
        return a.title - b.title;
    }

    function roundDate(date, type) {
        type = type || 'day'; // or month
        return Moment(date).startOf(type).toISOString();
    }

    function display(offset, type) { //offset from today
        let display = [];
        let current = (type === 'day') ? today : thisMonth;
        for (let i = 1; i > -5; i--) {
            display.push(Moment(current).subtract(i - offset, type + 's').toISOString());
        }
        if (type === 'month') type = 'future';
        return display.map((e, index) => new Collection({
            title: e,
            type: type,
            id: Moment().add(index, 'milliseconds').toISOString()
        }));
    }

    function monthCal(month) {
        month = new Date(month);
        let day = month;
        let dayArray = [];
        while (day.getMonth() == month.getMonth()) {
            dayArray.push(day.toISOString());
            day = Moment(day).add(1, 'days').toISOString();
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
        monthCal: monthCal,
        splitCollections: splitCollections,
        today: today,
        thisMonth: thisMonth
    }
})
