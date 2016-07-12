bulletApp.filter('titleFormat', function (DateFactory) {
  return function(title, type) {
    if (!Moment(new Date(title)).isValid()) return title;

    var output;
    switch(type) {
      case 'day':
        output = DateFactory.getWeekday(title)+', '+Moment(title).format('MMMM D');
        break;
      case 'month':
        output = Moment(title).format('MMMM YYYY');
        break;
      case 'month-cal':
        output = Moment(title).format('MMMM')+' Calendar';
        break;
      case 'future':
        output = Moment(title).format('MMMM YYYY');
        break;
      default:
        output = title;
    }
    return output;
  }
})

bulletApp.filter('dateFormat', function (DateFactory) {
  return function(title, type) {
    
    if (!Moment(new Date(title)).isValid()) return title;

    var output;
    switch(type) {
      case 'day':
        output = Moment(title).format('MMM D');
        break;
      case 'month':
        output = Moment(title).format('MMMM YYYY');
        break;
      case 'month-cal':
        output = Moment(title).format('MMMM')+' Calendar';
        break;
      case 'future':
        output = Moment(title).format('MMMM');
        break;
      default:
        output = Moment(title).format('MMM d');
    }
    return output;
  }
})
