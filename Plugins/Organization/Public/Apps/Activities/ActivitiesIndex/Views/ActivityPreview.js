define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/activity_preview.html',
    'Organization/Apps/Common/Views/TasksList',
    'Organization/Apps/Common/Views/WorkloadTimeline',
    'Organization/Apps/Daily/Collections/PlannedTasks'
], function ($, _, Backbone, ActivityPreviewTemplate, TasksListView, WorkloadTimelineView, PlannedTasksCollection) {
    var View = Backbone.View.extend({
        tagName:"div",
        className:"activity_preview",
        initialize:function (model) {
            var base = this;
            base.activity = model;
        },
        init:function (SmartBlocks, parent) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.parent = parent;

            base.render();
            base.registerEvents();
        },
        render:function () {
            var base = this;
            var template = _.template(ActivityPreviewTemplate, {
                activity:base.activity
            });
            base.$el.html(template);
            if (!base.activity) {
                base.$el.addClass("empty");
            } else {
                base.$el.removeClass("empty");
                if (base.activity.get("tasks").length > 0) {
                    var tasks_list = new TasksListView(base.activity.get("tasks"));
                    base.$el.find(".tasks_list_container").html(tasks_list.$el);
                    tasks_list.init(base.SmartBlocks);
                }
                else {
                    base.$el.find(".tasks_list_container").html("No tasks found.");
                }
                if (base.activity.get("archived")) {
                    base.$el.addClass("archived");
                } else {
                    base.$el.removeClass("archived");
                }

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
            }


        },
        registerEvents:function () {
            var base = this;
            base.parent.events.on("activity_clicked", function (activity) {
                base.activity = activity;
                base.render();
            });

            base.$el.delegate(".archive_button", "click", function () {
                base.activity.set("archived", !base.activity.get("archived"));
                base.activity.save({}, {
                    success:function () {

                        if (base.activity.get("archived")) {
                            base.$el.addClass("archived");
                            base.SmartBlocks.show_message("Activity archived");
                        } else {
                            base.$el.removeClass("archived");
                            base.SmartBlocks.show_message("Activity unarchived");
                        }
                    }
                });
            });

            base.$el.delegate(".deletion_button", "click", function () {
                if (confirm("Are you sure you want to delete this activity ?")) {
                    base.activity.destroy({
                        success:function () {
                            base.$el.addClass("empty");
                            base.parent.events.trigger("loaded_activities");
                        },
                        error:function () {

                        }
                    });
                }

            });
        }
    });

    return View;
});