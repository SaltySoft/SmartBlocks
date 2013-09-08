define([
    'underscore',
    'backbone',
    'Organization/Apps/Daily/Collections/PlannedTasks',
    'Organization/Apps/Daily/Models/PlannedTask',
    'UserModel',
    'Organization/Apps/Models/Subtask',
    'Organization/Apps/Collections/Subtasks',
    'UsersCollection',
    'Organization/Apps/Common/Models/TaskTag',
    'Organization/Apps/Common/Collections/TaskTags',
    'Organization/Apps/Models/Deadline',
    'Organization/Apps/Collections/Subtasks'
], function (_, Backbone, PlannedTasksCollection, PlannedTask, User, Subtask, SubtasksCollection, UsersCollection, TaskTag, TaskTagsCollection, Deadline, SubtasksCollection) {


    var Task = Backbone.Model.extend({
        urlRoot:"/Organization/Tasks",
        defaults:{
            "model_type":"Task",
            activities:[],
            subtasks: new SubtasksCollection(),
            creation_time: new Date().getTime()
        },
        hasDeadline:function () {
            return this.get("due_date");
        },
        getDueDate:function () {
            return new Date(this.get("due_date") * 1000);
        },
        setDueDate:function (date) {
            this.set("due_date", date.getTime() / 1000);
        },
        getActivityForUser:function (user) {
            var base = this;
            var activity = undefined;
            var activities_list = base.get("activities");
            for (var k in activities_list) {
                var current_activity = activities_list[k];
                if (current_activity.creator.id == user.get('id')) {
                    activity = current_activity;
                }
            }
            return activity;
        },
        parse:function (response) {

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

            var subtasks = new SubtasksCollection();
            if (response.subtasks != null && response.subtasks != undefined) {
                var subtasks_array = response.subtasks;

                for (var k in subtasks_array) {
                    var subtask = new Subtask(subtasks_array[k]);
                    if (subtask) {
                        subtasks.add(subtask);
                    }
                }
            }
            response.subtasks = subtasks;

            var planned_tasks_array = response.planned_tasks;
            var planned_tasks_collection = new PlannedTasksCollection();
            for (var k in planned_tasks_array) {
                var planned_task = new PlannedTask(planned_tasks_array[k]);
//                var planned_task = OrgApp.planned_tasks.get(planned_tasks_array[k].id);
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


            if (response.deadline) {
                var deadline = new Deadline(response.deadline);
                response.deadline = deadline;
            }

//            if (!Activity) {
//                Activity  = require('Organization/Apps/Common/Models/Activity');
//            }
//            var activity = new Activity(response.activity)
//            response.activity = activity;

            var linked_users = response.task_users;
            if (linked_users) {
                var users_collection = new UsersCollection();
                for (var k in linked_users) {
                    var user = new User(linked_users[k]);
                    users_collection.add(user);
                }
                response.task_users = users_collection;
            }



//            console.log(response);
            return response;
        },
        initialize:function (model) {
            if (model) {
                var children_array = model.children;
                if (children_array && !model.children.models) {
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
                if (planned_tasks_array && !planned_tasks_array.models) {
                    var planned_tasks_collection = new PlannedTasksCollection();
                    for (var k in planned_tasks_array) {
                        var planned_task = new PlannedTask(planned_tasks_array[k]);
//                        var planned_task = OrgApp.planned_tasks.get(planned_tasks_array[k].id);
                        planned_tasks_collection.add(planned_task);
                    }
                    this.attributes.planned_tasks = planned_tasks_collection;
                }


                var parent_a = model.parent;
                if (parent_a && !parent_a.attributes)
                    this.attributes.parent = new Task(parent_a);


                var tags_a = model.tags;
                if (model.tags && !tags_a.models) {
                    var tags_collection = new TaskTagsCollection();
                    for (var k in tags_a) {
                        var tag = new TaskTag(tags_a[k]);
                        tags_collection.add(tag);
                    }
                    this.attributes.tags = tags_collection;
                }


                if (model.subtasks && !model.subtasks.models) {
                    var subtasks_collection = new OrgApp.SubtasksCollection();
                    for (var k in model.subtasks) {
                        var subtask = new OrgApp.Subtask(model.subtasks[k]);
                        subtasks_collection.add(subtask);
                    }
                    this.attributes.subtasks = subtasks_collection;
                }

//                if (!Activity) {
//                    Activity  = require('Organization/Apps/Common/Models/Activity');
//                }
//                var activity = new Activity(model.activity);
//                if (model.activity && !model.activity.attributes)
//                    this.attributes.activity = activity;


                var linked_users = model.task_users;
                if (linked_users && !linked_users.models) {
                    var users_collection = new UsersCollection();
                    for (var k in linked_users) {
                        var user = new User(linked_users[k]);
                        users_collection.add(user);
                    }
                    this.attributes.task_users = users_collection;
                }

                var owner = new User(model.owner);
                if (model.owner && !model.owner.attributes)
                    this.attributes.owner = owner;
            }
        },
        fullyPlanned:function () {
            var base = this;
            var worked_time = 0;
            var now = new Date();
            var planned_tasks = base.attributes.planned_tasks.models;
            for (var k in planned_tasks) {
                var pt = planned_tasks[k];
                var start = pt.getStart();
                var end = new Date(start);
                end.setTime(end.getTime() + pt.get("duration"));

                worked_time += parseInt(pt.get("duration"));
            }

            if (!base.get("due_date")) {
                return 0;
            } else {
                if (worked_time == parseInt(base.get("required_time"))) {
                    return 1;
                } else if (worked_time < parseInt(base.get("required_time"))) {
                    return -1;
                } else if (worked_time > parseInt(base.get("required_time"))) {
                    return 2;
                }
            }
        },
        isFinished:function () {
            var base = this;
            console.log(base.get('completion_date'));
            return base.get('completion_date') != null;
        },
        getRequiredWork: function () {
            var base = this;

            var subtasks = base.get('subtasks');
            var required_time = 0;
            var left = 0;
            var done = 0;
            for (var k in subtasks.models) {
                var st = subtasks.models[k];
                required_time += parseInt(st.get('duration'));
                if (st.get('finished')) {
                    done += parseInt(st.get('duration'));
                } else {
                    left += parseInt(st.get('duration'));
                }
            }

            return {
                total: required_time,
                left: left,
                done: done
            };
        },
        getPlannedTasks: function () {
            var base = this;
            var filtered = OrgApp.planned_tasks.filter(function (pt) {
                return pt.get("task").get("id") === base.get("id");
            });
            return new OrgApp.PlannedTasksCollection(filtered);
        },
        getWork: function () {
            var base = this;

            var total = 0;
            var left = 0;
            var done = 0;

            total += base.getRequiredWork().total;
            var pts = base.getPlannedTasks();



            for (var l in pts.models) {
                var pt = pts.models[l];
                var now = new Date();
                var start = pt.getStart();
                var end = new Date(start);
                end.setTime(start.getTime() + pt.get("duration"));
                if (start > now) {
                    left +=  pt.get("duration");
                } else if (end < now) {
                    done += pt.get("duration");
                } else {
                    left += end.getTime() - now.getTime();
                    done += now.getTime() - start.getTime();
                }
            }

            return {
                total: total,
                left: left,
                done: done
            };
        }
    });

    var TasksCollection = Backbone.Collection.extend({
        url:"/Organization/Tasks",
        model:Task
    });

    window.Task = Task;
    return Task;
});