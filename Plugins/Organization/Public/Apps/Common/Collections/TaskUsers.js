define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Common/Models/TaskUser'
], function ($, _, Backbone, TaskUser) {
    var TaskUsersCollection = Backbone.Collection.extend({
        model: TaskUser,
        url: "/Organization/TasksUsers"
    });

    return TaskUsersCollection;
});