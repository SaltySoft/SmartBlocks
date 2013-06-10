define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Daily/Templates/task_item.html'
], function ($, _, Backbone, TaskItemTemplate) {
    var TaskItemView = Backbone.View.extend({
        tagName: "li",
        className: "task_item",
        initialize: function () {
            var base = this;
            base.task = base.model;
        },
        init: function (SmartBlocks, planning) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.planning = planning;
            base.$el.attr("data-id", base.task.get('id'));
            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(TaskItemTemplate, { task: base.task });
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;

            base.$el.draggable({
                revert: true
            });
        }
    });

    return TaskItemView;
});