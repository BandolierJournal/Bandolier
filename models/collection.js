/*jshint node: true*/

var Collection = function(title) {
    this.id = new Date().toISOString();
    this.title = title;
};

modules.export = Collection;
