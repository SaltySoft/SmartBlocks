define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var Note = Backbone.Model.extend({
        urlRoot: "/Notes",
        defaults: {
        }
    });

    return Note;
});