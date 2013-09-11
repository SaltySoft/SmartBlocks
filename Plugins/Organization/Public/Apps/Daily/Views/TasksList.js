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

            base.view_list = [];

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
        renderList: function () {
            var base = this;
            base.$el.find(".tasks_list").find(".task_item").remove();
            base.view_list = [];
            for (var k in base.tasks_list.models) {
                var task = base.tasks_list.models[k];
                var task_item_view = new TaskItemView({
                    model: task
                });
                task_item_view.init(base.SmartBlocks, base.planning);
                base.$el.find(".tasks_list").append(task_item_view.$el);
                base.view_list.push(task_item_view);
            }
        },
        fetchList: function () {
            var base = this;
            base.date.setHours(0);
            base.date.setMinutes(0);
            base.date.setSeconds(0);
            base.SmartBlocks.startLoading("Fetching this day's tasks");

            base.tasks_list.fetch({
                data: {
                    filter: "undone"
                },
                success: function () {

                    base.renderList();
                    base.SmartBlocks.stopLoading();
                }
            });
        },
        registerEvents: function () {
            var base = this;

            base.$el.sortable({
                items: "li:not(.li-state-disabled)"
            });

            base.$el.delegate(".action", "click", function () {
                var elt = $(this);
                var action = elt.attr("data-action");

                switch (action)
                {
                    case "add":
                        var task = new Task();
//                        task.setDueDate(base.date);
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
            base.SmartBlocks.events.on("ws_notification", function (message) {

                if (message.app == "organizer") {

                    if (message.action == "task_saved") {

                        var message_task = message.task;
                        var remove_list = [];
                        for (var k in base.view_list) {
                            var view = base.view_list[k];
                            var date = new Date(message_task.due_date * 1000);
                            if (message_task.id == view.task.id) {
                                view.task.attributes = message_task;
                                view.$el.find(".name").html(view.task.get("name"));

                                if (Math.abs(date.getTime() - base.planning.current_date.getTime()) > 24 * 3600 * 1000) {
                                    base.tasks_list.remove(message_task.id);
                                }
                            }
                        }
                        if (message_task.id && base.tasks_list.get(message_task.id) === undefined && Math.abs(date.getTime() - base.planning.current_date.getTime()) < (12 * 3600) * 1000) {
                            var task = new Task(message_task);
                            base.tasks_list.add(task);
                        }
                        console.log("ADDED ", task);
                    }
                    if (message.action == "task_deleted") {
                        var message_task = message.task;
                        base.tasks_list.remove(message_task.id);
                        console.log("deleted ", message_task);

                    }
                    base.SmartBlocks.show_message("Sync resulted in local changes");
                    base.renderList();
                }
            });
        }
    });

    return TasksListView;
});