define([
    "underscore",
    "backbone",
    "Enterprise/Apps/Notes/Models/Subnote"
], function (_, Backbone, Subnote) {
    var SubnotesCollection = Backbone.Collection.extend({
        url:"/Enterprise/Subnotes",
        model:Subnote
    });

    return SubnotesCollection;
});