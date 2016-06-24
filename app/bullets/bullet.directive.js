bulletApp.directive('bullet', function(){
    return {
        restrict: 'E',
        templateUrl: './bullets/bullet.template.html',
        scope: {
            bullet: '='
        },
        link: function(scope, element) {
            element.bind('keydown keypress', function(e) {
                if(e.which === 13) {
                    scope.bullet.save();
                    e.preventDefault();
                }
            });
        }
    };
});
