bulletApp.directive('bullet', function(){
    return {
        restrict: 'E',
        templateUrl: './bullets/bullet.template.html',
        scope: {
            bullet: '='
        },
        link: function(scope, element) {
            scope.typeDict = {
                "Task" : "fa-circle",
                "Event": "fa-circle-thin",
                "Note": "fa-minus"
            };

            element.on('keydown keypress', function(e){
                if(e.which === 13) {
                    e.preventDefault();
                    e.target.blur();
                }
            });

            element.on('focusout', function(e) {
                    scope.bullet.save();
            });
        }
    };
});
