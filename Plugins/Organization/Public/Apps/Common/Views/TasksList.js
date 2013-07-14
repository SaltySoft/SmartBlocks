define([
    'jquery',
    'underscore',
    'backbone',
    './TasksListItem'
], function ($, _, Backbone, TaskListItem) {
    var View = Backbone.View.extend({
        tagName: "ul",
        className: "task_list_view",
        initialize: function (task_list) {
            var base = this;
            base.task_list = task_list;
        },
        init: function (SmartBlocks, item_click_handler) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.item_click_handler = item_click_handler;
            base.render();
        },
        render: function () {
            var base = this;
            for (var k in base.task_list.models) {
                var task = base.task_list.models[k];
                var task_list_item = new TaskListItem(task);
                base.$el.append(task_list_item.$el);
                task_list_item.init(base.SmartBlocks, base.item_click_handler);
            }
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});