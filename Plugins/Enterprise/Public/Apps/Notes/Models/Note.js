define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var Note = Backbone.Model.extend({
        urlRoot: "/Enterprise/Notes",
        defaults: {
        }
    });

    return Note;
});