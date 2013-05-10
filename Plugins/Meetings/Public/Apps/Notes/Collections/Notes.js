define([
    "underscore",
    "backbone",
    "Enterprise/Apps/Notes/Models/Note"
], function (_, Backbone, Note) {
    var NotesCollection = Backbone.Collection.extend({
        url:"/Enterprise/Notes",
        model:Note
    });

    return NotesCollection;
});