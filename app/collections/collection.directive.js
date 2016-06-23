bulletApp.directive('collection', function(){
    return {
        restrict: 'E',
        template: `
        <h1>{{collection.title}}</h1>
        <pre>{{collection | json}}</pre>
        <pre>{{bullets | json}}</pre>
        `,
        controller: 'CollectionCtrl'
    };
});
