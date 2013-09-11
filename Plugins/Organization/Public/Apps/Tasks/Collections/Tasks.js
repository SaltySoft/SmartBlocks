define([
    'underscore',
    'backbone',
    'Organization/Apps/Tasks/Models/Task'
], function (_, Backbone, Task) {

    var TasksCollection = Backbone.Collection.extend({
        url: "/Organization/Tasks",
        model: Task
    });

    return TasksCollection;
});