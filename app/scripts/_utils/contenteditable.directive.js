bulletApp.directive('contenteditable', function ($sanitize) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function (scope, element, attrs, ngModel) {
      if (!ngModel) return;
      function read() {
        ngModel.$setViewValue(element.html());
      }
      ngModel.$render = function () {
        var sanitary = $sanitize(ngModel.$viewValue || '');
        element.html(sanitary);
      };
      element.bind('blur keyup change', function () {
        scope.$apply(read);
      });
    }
  };
});
