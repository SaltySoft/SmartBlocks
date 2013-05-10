define([
    'underscore',
    'backbone',
    'Enterprise/Apps/Tasks/Models/Task'
], function (_, Backbone, Task) {
    var TasksCollection = Backbone.Collection.extend({
        url: "/Enterprise/Tasks",
        model: Task
    });

    return TasksCollection;
});