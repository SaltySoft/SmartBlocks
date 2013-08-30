define([
    'underscore',
    'backbone',
    './ActivityType',
    'Organization/Apps/Tasks/Models/Task',
    'Organization/Apps/Tasks/Collections/Tasks'
], function (_, Backbone, ActivityType, Task, TasksCollection) {
    var Activity = Backbone.Model.extend({
        defaults: {
            "model_type": "Activity",
            has_changed: false

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
                    Task = require('Organization/Apps/Tasks/Models/Task');
                }
                var task = new Task(task_array[k]);

                collection.add(task);
            }
            response.tasks = collection;


            return response;
        },
        set: function (attributes, options) {
            var base = this;
            var result = Backbone.Model.prototype.set.call(this, attributes, options);
            base.has_changed = true;
            return result;
        },
        save: function (attributes, options) {
            var base = this;
            var result = Backbone.Model.prototype.save.call(this, attributes, options);
            base.has_changed = false;
            return result;
        }
    });
    return Activity;
});