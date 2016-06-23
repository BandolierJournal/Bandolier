bulletApp.directive('collection', function(){
    return {
        restrict: 'E',
        templateUrl: './app/collections/collection.template.html',
        controller: 'CollectionCtrl'
    };
});
