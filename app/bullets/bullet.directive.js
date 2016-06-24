bulletApp.directive('bullet', function(){
    return {
        restrict: 'E',
        templateUrl: './bullets/bullet.template.html',
        scope: {
            bullet: '='
        }
    };
});
