define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var TaskUser = Backbone.Model.extend({
        urlRoot: "/Organization/TasksUsers",
        defaults: {
            accepted: false,
            pending: true
        }
    });

    return TaskUser;
});