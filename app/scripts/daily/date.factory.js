bulletApp.factory('DateFactory', function() {
    const today = roundDate(new Date());
    const yesterday = new Date(Moment(today).subtract(1, 'days').toISOString());
    const thisMonth = roundMonth(today);

    function splitCollections(collections) {
        const split = _.partition(collections, function(c) {
            return new Date(c.title) < yesterday; //or last month for future log
        })
        const aged = split[0].sort(chronoSort);
        const future = split[1];
        return [aged, future];
    }

    function chronoSort(a, b) {
        a = new Date(a.title);
        b = new Date(b.title);
        return a - b;
    }

    function chronoFilter(a) {
        return new Date(a.title) < yesterday;  //not used
    }

    function roundDate(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    function roundMonth(date) {
        return new Date(date.getFullYear(), date.getMonth());
    }

    function display(offset, type) { //offset from today
        const display = [];
        const rounded = (type === 'day') ? today : roundMonth(today);
        for (let i = 1; i > -5; i--) {
            display.push(Moment(rounded).subtract(i - offset, type + 's').toISOString());
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
        const dayArray = [day.toISOString()];
        while (day.getMonth() == month.getMonth()) {
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
        monthCal: monthCal,
        splitCollections: splitCollections,
        today: today,
        thisMonth: thisMonth
    }
})
