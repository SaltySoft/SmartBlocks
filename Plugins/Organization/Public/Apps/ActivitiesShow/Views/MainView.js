define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main_view.html',
    'Organization/Apps/Common/Collections/ActivityTypes',
    'Organization/Apps/Common/Models/ActivityType',
    'Organization/Apps/Common/Views/TasksList',
    './TaskPreview',
    'Organization/Apps/Common/Views/TaskPopup',
    'Organization/Apps/Tasks/Models/Task',
    'Organization/Apps/Common/Collections/Activities',
    'Organization/Apps/Common/Views/WorkloadTimeline',
    'Organization/Apps/Daily/Collections/PlannedTasks'
], function ($, _, Backbone, MainViewTemplate, ActivityTypesCollection, ActivityType, TasksListView, TaskPreview, TaskPopup, Task, ActivitiesCollection, WorkloadTimelineView, PlannedTasksCollection) {
    var View = Backbone.View.extend({
        tagName:"div",
        className:"activity_show_view",
        initialize:function (model) {
            var base = this;
            base.events = $.extend({}, Backbone.Events);

            base.model = model;
            base.activity = model;
        },
        init:function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.activity_types = new ActivityTypesCollection();
            base.loaded = 0;
            base.activity_types.fetch({
                success:function () {
                    base.loaded++;
                    if (base.loaded == 2) {
                        base.launch();
                    }
                }
            });

            base.activity.fetch({
                success:function () {
                    base.loaded++;
                    if (base.loaded == 2) {
                        base.launch();
                    }
                }
            });
        },
        launch:function () {
            var base = this;
            base.render();
            base.registerEvents();
        },
        render:function () {
            var base = this;
            var template = _.template(MainViewTemplate, {
                activity:base.activity,
                types:base.activity_types.models
            });

            base.$el.html(template);
            base.$el.css("border", "2px " + base.activity.get('type').get('color') + " solid");
            base.update();


            var planned_tasks = new PlannedTasksCollection();
            var tasks = base.activity.get("tasks").models;
            var required_time = 0;
            for (var k in tasks) {
                var planned_tasks_c = tasks[k].get("planned_tasks");
                required_time += tasks[k].get("required_time");
                for (var k in planned_tasks_c.models) {
                    planned_tasks.add(planned_tasks_c.models[k]);
                }
            }

            var workload_timeline_view = new WorkloadTimelineView(planned_tasks, required_time);
            base.$el.find(".workload_timeline_container").html(workload_timeline_view.$el);
            workload_timeline_view.init(base.SmartBlocks);
        },
        update:function () {
            var base = this;
            base.$el.css("border", "2px " + base.activity.get('type').get('color') + " solid");
            base.$el.find(".name").html(base.activity.get("name"));
            base.$el.find(".description").html(base.activity.get("description"));


            if (base.activity.get("tasks").length > 0) {
                var tasks_list = new TasksListView(base.activity.get("tasks"));
                base.$el.find(".tasks_list_container").html(tasks_list.$el);
                tasks_list.init(base.SmartBlocks, function (task) {
                    var task_preview = new TaskPreview(task);
                    base.$el.find(".task_preview_container").html(task_preview.$el);
                    task_preview.init(base.SmartBlocks);
                });
            }
            else {
                base.$el.find(".tasks_list_container").html("No tasks found.");
            }
        },
        registerEvents:function () {
            var base = this;

            base.$el.delegate(".type_select", "change", function () {
                var value = $(this).val();
                var type = new ActivityType({
                    id:value
                });
                type.fetch({
                    success:function () {
                        base.activity.set("type", type);
                        base.activity.save();
                        base.update();
                    }
                });
            });

            base.$el.delegate(".edit_button", "click", function () {
                base.$el.addClass("edition");
            });

            base.$el.delegate(".edition_cancel_button", "click", function () {
                base.$el.find(".edition_form")[0].reset();
                base.$el.removeClass("edition");
            });

            base.$el.delegate(".edition_save_button", "click", function () {
                var form = base.$el.find(".edition_form");

                var array = form.serializeArray();

                for (var k in array) {
                    base.activity.set(array[k].name, array[k].value);
                    base.activity.save();
                    base.$el.removeClass("edition");
                    base.update();
                }
            });

            base.$el.delegate(".add_task_button", "click", function () {
                var task = new Task();
                var date = new Date();
                date.setHours(23, 59, 59, 0);
                task.setDueDate(date);
                var task_popup = new TaskPopup(task);
                task_popup.init(base.SmartBlocks, function (task) {
                    base.SmartBlocks.startLoading("Saving");
                    base.activity.get('tasks').add(task);
                    base.activity.save({}, {
                        success:function () {
                            base.SmartBlocks.stopLoading();
                            base.update();
                        }
                    });
                });
            });
        }
    });

    return View;
});