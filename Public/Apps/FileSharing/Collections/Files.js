define([
    'underscore',
    'backbone',
    'FileSharing/Models/Folder'
], function (_, Backbone, Folder) {
    var FilesCollection = Backbone.Collection.extend({
        model: File,
        url: "/File",
        parse: function (response, options) {
            console.log(response);

            return response.results;
        }
    });

    return FilesCollection;
});