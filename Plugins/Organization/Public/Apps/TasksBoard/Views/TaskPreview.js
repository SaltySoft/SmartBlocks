define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/task_preview.html',
    'Organization/Apps/Common/Views/TasksList',
    'Organization/Apps/Common/Views/WorkloadTimeline',
    'Organization/Apps/Common/Views/PlannedTasksList',
    'Organization/Apps/Common/Views/TaskTagItem',
    'Organization/Apps/TasksShow/Views/TimeStats'
], function ($, _, Backbone, TaskPreviewTemplate, TasksListView, WorkloadTimelineView, PlannedTasksListView, TaskTagItem, TimeStatsView) {
    var View = Backbone.View.extend({
        tagName:"div",
        className:"task_preview",
        initialize:function (model) {
            var base = this;
            base.task = model;
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
            var template = _.template(TaskPreviewTemplate, {
                task:base.task
            });
            base.$el.html(template);
            if (!base.task) {
                base.$el.addClass("empty");
            }
            else {
                base.$el.removeClass("empty");
                if (base.task.get("children").length > 0) {
                    var subtasks_list = new TasksListView(base.task.get("children"));
                    base.$el.find(".subtasks_list_container").html(subtasks_list.$el);
                    subtasks_list.init(base.SmartBlocks);
                }
                else {
                    base.$el.find(".subtasks_list_container").html("No subtasks found.");
                }
                base.update();
            }
        },
        update:function () {
            var base = this;

            base.$el.find(".name").html(base.task.get("name"));
            base.$el.find(".description").html(base.task.get("description"));
//            base.$el.find(".activity_link").html();
//            base.$el.find(".participants_container").html();

            var time_stats_view = new TimeStatsView(base.task);
            base.$el.find(".time_stats_container").html(time_stats_view.$el);
            time_stats_view.init(base.SmartBlocks);

            var workload_timeline_view = new WorkloadTimelineView(base.task.get("planned_tasks", base.task.get("required_time")));
            base.$el.find(".workload_timeline_container").html(workload_timeline_view.$el);
            workload_timeline_view.init(base.SmartBlocks);

            if (base.task.get("planned_tasks").length > 0) {
                var planned_tasks_list = new PlannedTasksListView(base.task.get("planned_tasks"));
                base.$el.find(".planned_tasks_list_container").html(planned_tasks_list.$el);
                planned_tasks_list.init(base.SmartBlocks);
            }
            else {
                base.$el.find(".planned_tasks_list_container").html("No work time planned.");
            }

            var task_tags = base.task.get("tags").models;
            if (task_tags.length > 0) {
                for (var k in task_tags) {
                    var task_tag_item = new TaskTagItem(task_tags[k]);
                    base.$el.find(".task_tags_panel").append(task_tag_item.$el);
                    task_tag_item.init(base.SmartBlocks, undefined);
                }
            }
            else {
                base.$el.find(".task_tags_panel").append("No tags associated.");
            }
        },
        registerEvents:function () {
            var base = this;
            base.parent.events.on("change_task_preview", function (task) {
                base.task = task;
                base.render();
            });

            base.$el.delegate(".deletion_button", "click", function () {
                if (confirm("Are you sure you want to delete this task ?")) {
                    base.task.destroy({
                        success:function () {
                            base.$el.addClass("empty");
                            base.parent.events.trigger("task_deleted");
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