define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Tasks/Collections/Tasks',
    'Organization/Apps/Daily/Views/TaskItem'
], function ($, _, Backbone, TasksCollection, TaskItemView) {
    var TasksListView = Backbone.View.extend({
        tagName: "ul",
        className: "tasks_list",
        initialize: function () {

        },
        init: function (SmartBlocks, planning) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.tasks_list = new  TasksCollection();

            base.planning = planning;

            base.date = new Date();
            base.render();
            base.registerEvents();
        },
        render: function () {
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
                    for (var k in base.tasks_list.models) {
                        var task = base.tasks_list.models[k];
                        var task_item_view = new TaskItemView({
                            model: task
                        });
                        task_item_view.init(base.SmartBlocks, base.planning);
                        base.$el.append(task_item_view.$el);
                    }
                    base.SmartBlocks.stopLoading();
                }
            });
        },
        registerEvents: function () {
            var base = this;

            base.$el.sortable({

            });

        }
    });

    return TasksListView;
});