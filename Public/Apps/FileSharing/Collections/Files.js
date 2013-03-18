define([
    'underscore',
    'backbone',
    'FileSharing/Models/File'
], function (_, Backbone, File) {
    var FilesCollection = Backbone.Collection.extend({
        model: File,
        url: "/Files"
    });

    return FilesCollection;
});