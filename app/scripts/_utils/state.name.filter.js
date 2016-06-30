bulletApp.filter('stateName', function () {
  return function(input) {
    var output;
    switch(input) {
      case 'day':
        output = 'daily';
        break;
      case 'month':
        output = 'month';
        break;
      case 'month-cal':
        output = 'month';
        break;
      case 'future':
        output = 'future';
        break;
      case 'generic':
        output = 'generic';
        break;
      default:
        output = '';
        break;
    }
    return output
  }
})
