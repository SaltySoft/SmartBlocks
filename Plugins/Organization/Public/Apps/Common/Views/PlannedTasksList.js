define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Daily/Collections/PlannedTasks',
    './PlannedTasksListItem'
], function ($, _, Backbone, PlannedTasksCollection, PlannedTasksListItem) {
    var PlannedList = Backbone.View.extend({
        tagName: "ul",
        className: "planned_list",
        initialize: function (planned_list) {
            var base = this;
            base.collection = planned_list;
        },
        init: function (SmartBlocks, planning) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.planned_tasks = base.collection;
            base.planning = planning;
            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;
            var planned_list = base.$el;
            planned_list.html("");
            var contained_tasks = [];
            for (var k in base.planned_tasks.models) {
                var planned_task = base.planned_tasks.models[k];
                if (!contained_tasks[planned_task.getName()]) {
                    var planned_task_item = new PlannedTasksListItem(planned_task);
                    base.$el.append(planned_task_item.$el);
                    planned_task_item.init(base.SmartBlocks);
                }
            }
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return PlannedList;
});