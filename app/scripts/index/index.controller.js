bulletApp.controller('IndexCtrl', function ($scope, collections) {
  $scope.collections = collections.filter(col => col.type==='generic');
  var months = {};
  collections.filter(col => col.type==='month' || col.type==='month-cal').forEach(month => {
  	if (months[month.title]) months[month.title].push(month.id);
  	else months[month.title] = [month.id];
  });
  $scope.months = months;
});
