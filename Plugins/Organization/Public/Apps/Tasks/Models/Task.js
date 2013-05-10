define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var Task = Backbone.Model.extend({
        urlRoot: "/Organization/Tasks"
    });

    return Task;
});