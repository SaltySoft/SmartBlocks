define([
    'underscore',
    'backbone',
    'FileSharing/Models/Folder'
], function (_, Backbone, Folder) {
    var FoldersCollection = Backbone.Collection.extend({
        model: Folder,
        url: "/Folders",
        parse: function (response, options) {
            console.log(response);

            return response.results;
        }
    });

    return FoldersCollection;
});