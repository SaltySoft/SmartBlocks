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
        },
        getDeadlines: function () {
            var base = this;

            var deadlines_array = OrgApp.deadlines.filter(function (deadline) {
                return deadline.get('activity').get('id') == base.get('id');
            });

            var deadlines = new OrgApp.DeadlinesCollection(deadlines_array);

            return deadlines;
        },
        getTasks: function () {
            var base = this;

            var tasks_array = OrgApp.tasks.filter(function (task) {
                return task.get('activity') != null && task.get('activity').get ? task.get('activity').get('id') == base.get('id') : task.get('activity').id == base.get('id')
            });

            return new OrgApp.TasksCollection(tasks_array);
        },
        getPlannedTasks: function () {
            var base = this;
            var planned_tasks = new OrgApp.PlannedTasksCollection();

            var tasks = base.getTasks();

            for (var k in tasks.models) {
                var pts = OrgApp.planned_tasks.filter(function (pt) {
                    return pt.get('task').get('id') == tasks.models[k].get('id')
                });
                for (var i in pts) {
                    planned_tasks.add(pts[i]);
                }
            }
            return planned_tasks;
        }
    });
    return Activity;
});