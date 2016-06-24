bulletApp.directive('collection', function(){
    return {
        restrict: 'E',
        templateUrl: './collections/collection.template.html',
        controller: 'CollectionCtrl'
    };
});
