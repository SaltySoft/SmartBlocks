define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Daily/Templates/tasks_list.html',
    'Organization/Apps/Tasks/Collections/Tasks',
    'Organization/Apps/Tasks/Models/Task',
    'Organization/Apps/Daily/Views/TaskItem',
    'Organization/Apps/Common/Views/TaskPopup'
], function ($, _, Backbone, TaskListTemplate, TasksCollection, Task, TaskItemView, TaskPopupView) {
    var TasksListView = Backbone.View.extend({
        tagName: "div",
        className: "tasks_list",
        initialize: function () {

        },
        init: function (SmartBlocks, planning) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.tasks_list = new  TasksCollection();

            base.planning = planning;

            base.date = base.planning.current_date;
            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(TaskListTemplate, {});
            base.$el.html(template);
            base.fetchList();
        },
        fetchList: function () {
            var base = this;
            base.date.setHours(0);
            base.date.setMinutes(0);
            base.date.setSeconds(0);
            base.SmartBlocks.startLoading("Fetching this day's tasks");

            base.tasks_list.fetch({
                data: {
                    date: Math.round(base.date.getTime() / 1000)
                },
                success: function () {
                    base.$el.find(".tasks_list").html("");
                    for (var k in base.tasks_list.models) {
                        var task = base.tasks_list.models[k];
                        var task_item_view = new TaskItemView({
                            model: task
                        });
                        task_item_view.init(base.SmartBlocks, base.planning);
                        base.$el.find(".tasks_list").append(task_item_view.$el);
                    }
                    base.SmartBlocks.stopLoading();
                }
            });
        },
        registerEvents: function () {
            var base = this;

            base.$el.sortable({

            });

            base.$el.delegate(".action", "click", function () {
                var elt = $(this);
                var action = elt.attr("data-action");

                switch (action)
                {
                    case "add":
                        var task = new Task();
                        task.setDueDate(base.date);
                        var tsk_popup = new TaskPopupView(task);
                        tsk_popup.events.on("task_updated", function () {
                            base.fetchList();
                        });
                        tsk_popup.init(base.SmartBlocks);
                        break;
                    default:
                        break;
                }

            });

        }
    });

    return TasksListView;
});