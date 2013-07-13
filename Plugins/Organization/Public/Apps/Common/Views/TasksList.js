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
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.render();
        },
        render: function () {

            var base = this;
            console.log(base.task_list);
            for (var k in base.task_list.models) {
                var task = base.task_list.models[k];
                var task_list_item = new TaskListItem(task);
                base.$el.append(task_list_item.$el);
                task_list_item.init(base.SmartBlocks);
            }
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});