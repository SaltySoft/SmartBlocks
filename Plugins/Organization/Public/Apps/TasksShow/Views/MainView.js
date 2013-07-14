define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main_view.html',
    'Organization/Apps/Common/Views/TasksList',
    'Organization/Apps/Common/Views/PlannedTasksList',
    'Organization/Apps/Tasks/Models/Task',
    'Organization/Apps/Common/Views/TaskPopup',
    './TimeStats'
], function ($, _, Backbone, MainViewTemplate, TasksListView, PlannedTasksListView, Task, TaskPopup, TimeStatsView) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "task_show_main_view",
        initialize: function (task) {
            var base = this;
            base.model = task;
            base.task = task;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.task.fetch({
                success: function () {
                    base.render();
                    base.update();
                    base.registerEvents();
                }
            });

        },
        render: function () {
            var base = this;

            var template = _.template(MainViewTemplate, {});
            base.$el.html(template);
        },
        update: function () {
            var base = this;
            base.$el.find(".name").html(base.task.get("name"));
            base.$el.find(".description").html(base.task.get("description"));
            if (base.task.get("parent") !== undefined && base.task.get("parent") !== null) {
                base.$el.find(".parent_task_link").html('<a href="#tasks/' + base.task.get("parent").get("id") +'">' +  base.task.get("parent").get("name") + '</a>');
            } else {
                base.$el.find(".parent_task_link").html("No parent");
            }


            var subtask_list_view = new TasksListView(base.task.get("children"));
            base.$el.find(".subtasks_container").html(subtask_list_view.$el);
            subtask_list_view.init(base.SmartBlocks, function () {

            });


            var planned_tasks_list = new PlannedTasksListView(base.task.get("planned_tasks"));
            base.$el.find(".planned_tasks_container").html(planned_tasks_list.$el);
            planned_tasks_list.init(base.SmartBlocks);

            var time_stats_view = new TimeStatsView(base.task);
            base.$el.find(".time_stats_container").html(time_stats_view.$el);
            time_stats_view.init(base.SmartBlocks);
        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate(".add_task_button", "click", function () {
                var task = new Task();
                task.set("parent", base.task);
                var date = new Date();
                date.setHours(23,59,59,0);
                task.setDueDate(date);
                var task_popup = new TaskPopup(task);
                task_popup.init(base.SmartBlocks, function () {
                    base.task.fetch({
                        success: function () {
                            base.update();
                        }
                    });
                });
            });
        }
    });

    return View;
});