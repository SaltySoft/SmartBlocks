define([
    'underscore',
    'backbone',
    './ActivityType',
    'Organization/Apps/Tasks/Models/Task',
    'Organization/Apps/Tasks/Collections/Tasks'
], function (_, Backbone, ActivityType, Task, TasksCollection) {
    var Activity = Backbone.Model.extend({
        defaults: {
                "model_type" : "Activity"

        },
        urlRoot: "/Organization/Activities",
        parse: function (response) {

            var type_array = response.type;
            var type = new ActivityType(type_array);
            response.type = type;

            var task_array = response.tasks;
            var collection = new TasksCollection();

            for (var k in task_array) {
                if (!Task) {
                    Task  = require('Organization/Apps/Tasks/Models/Task');
                }
                var task = new Task(task_array[k]);

                collection.add(task);
            }
            response.tasks = collection;


            return response;
        }
    });
    return Activity;
});