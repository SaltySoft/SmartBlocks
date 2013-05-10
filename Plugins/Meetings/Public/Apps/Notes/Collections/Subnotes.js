define([
    "underscore",
    "backbone",
    'Meetings/Apps/Notes/Models/Subnote'
], function (_, Backbone, Subnote) {
    var SubnotesCollection = Backbone.Collection.extend({
        url:"/Meetings/Subnotes",
        model:Subnote
    });

    return SubnotesCollection;
});