bulletApp.filter('displayType', function () {
  return function(input) {
    var output;
    switch(input) {
      case 'day':
        output = 'Day';
        break;
      case 'month':
        output = 'Month';
        break;
      case 'month-cal':
        output = 'Monthly Calendar';
        break;
      case 'future':
        output = 'Future Log';
        break;
      case 'generic':
        output = 'Custom';
        break;
      default:
        output = '';
        break;
    }
    return output
  }
})
