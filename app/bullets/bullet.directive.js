bulletApp.directive('bullet', function(Bullet){
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

            let map = {};

            function typeChange(){
                if(map[84]) return new Bullet.Task(scope.bullet);
                if (map[69]) return new Bullet.Event(scope.bullet);
                if (map[78]) return new Bullet.Note(scope.bullet);
                return scope.bullet;
            }

            element.on('keyup', function() {
                map = {};
            });

            element.on('keydown', function(e){
                map[e.which] = true;
                // console.log(map);
                if(map[13]) {
                    map = {};
                    e.preventDefault();
                    e.target.blur();
                } else if (map[91]) {
                    scope.bullet = typeChange();
                    scope.bullet.save();
                }
            });

            element.on('focusout', function(e) {
                    scope.bullet.save();
            });
        }
    };
});
