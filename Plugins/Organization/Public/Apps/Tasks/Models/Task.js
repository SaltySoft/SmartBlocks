define([
    'underscore',
    'backbone',
    'Organization/Apps/Daily/Collections/PlannedTasks',
    'Organization/Apps/Daily/Models/PlannedTask',
    'UserModel',
    'UsersCollection',
    'Organization/Apps/Common/Models/TaskTag',
    'Organization/Apps/Common/Collections/TaskTags'
], function (_, Backbone, PlannedTasksCollection, PlannedTask, User, UsersCollection, TaskTag, TaskTagsCollection) {



    var Task = Backbone.Model.extend({
        urlRoot: "/Organization/Tasks",
        getDueDate: function () {
            return new Date(this.get("due_date") * 1000);
        },
        setDueDate: function (date) {
            this.set("due_date", date.getTime() / 1000);
        },
        getActivityForUser: function (user) {
            var base = this;
            var activity = undefined;
            var activities_list = base.get("activities");
            console.log(activities_list);
            for (var k in activities_list) {
                var current_activity = activities_list[k];
                if (current_activity.creator.id == user.get('id')) {
                    activity = current_activity;
                }
            }
            return activity;
        },
        parse: function (response) {

            var children_array = response.children;
            if (!TasksCollection) {
                TasksCollection = require('../Collections/Tasks');
            }
            var subtasks = new TasksCollection();

            for (var k in children_array) {
                var task = new Task(children_array[k]);
                subtasks.add(task);
            }
            response.children = subtasks;

            var planned_tasks_array = response.planned_tasks;
            var planned_tasks_collection = new PlannedTasksCollection();
            for (var k in planned_tasks_array) {
                var planned_task = new PlannedTask(planned_tasks_array[k]);
                planned_tasks_collection.add(planned_task);
            }
            response.planned_tasks = planned_tasks_collection;

            var parent_a = response.parent;
            if (response.parent)
                response.parent = new Task(parent_a);


            var owner = new User(response.owner);
            response.owner = owner;

            var tags_a = response.tags;
            var tags_collection = new TaskTagsCollection();
            for (var k in tags_a) {
                var tag = new TaskTag(tags_a[k]);
                tags_collection.add(tag);
            }
            response.tags = tags_collection;


            return response;
        },
        initialize: function (model) {
            if (model) {
                var children_array = model.children;
                if (!model.children.models) {
                    if (!TasksCollection) {
                        TasksCollection = require('../Collections/Tasks');
                    }
                    var subtasks = new TasksCollection();

                    for (var k in children_array) {
                        var task = new Task(children_array[k]);
                        subtasks.add(task);
                    }
                    this.attributes.children = subtasks;
                }


                var planned_tasks_array = model.planned_tasks;
                var planned_tasks_collection = new PlannedTasksCollection();
                for (var k in planned_tasks_array) {
                    var planned_task = new PlannedTask(planned_tasks_array[k]);
                    planned_tasks_collection.add(planned_task);
                }
                this.attributes.planned_tasks = planned_tasks_collection;

                var parent_a = model.parent;
                if (parent_a)
                    this.attributes.parent = new Task(parent_a);

                var tags_a = model.tags;
                var tags_collection = new TaskTagsCollection();
                for (var k in tags_a) {
                    var tag = new TaskTag(tags_a[k]);
                    tags_collection.add(tag);
                }
                this.attributes.tags = tags_collection;

                var owner = new User(model.owner);
                this.attributes.owner = owner;
            }
        }
    });

    var TasksCollection = Backbone.Collection.extend({
        url: "/Organization/Tasks",
        model: Task
    });

    return Task;
});