define([
    'underscore',
    'backbone',
    'Enterprise/Apps/Notes/Models/Subnote',
    'Enterprise/Apps/Notes/Collections/Subnotes'
], function (_, Backbone, Subnote, SubnotesCollection) {
    var Note = Backbone.Model.extend({
        urlRoot: "/Enterprise/Notes",
        defaults: {
        },
        parse: function (response) {
            var subnotes_array = response.subnotes;
            var subnotes_collection = new SubnotesCollection();

            for (var k in subnotes_array) {
                var subnote = new Subnote(subnotes_array[k]);
                subnotes_collection.add(subnote);
            }

            response.subnotes = subnotes_collection;

            return response;
        }
    });

    return Note;
});