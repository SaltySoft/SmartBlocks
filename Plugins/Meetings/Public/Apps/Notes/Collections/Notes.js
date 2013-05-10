define([
    "underscore",
    "backbone",
    "Meetings/Apps/Notes/Models/Note"
], function (_, Backbone, Note) {
    var NotesCollection = Backbone.Collection.extend({
        url:"/Meetings/Notes",
        model:Note
    });

    return NotesCollection;
});