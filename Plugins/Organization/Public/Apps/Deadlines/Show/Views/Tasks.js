define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/tasks.html'
], function ($, _, Backbone, tasks_template) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "deadlines_show_tasks",
        initialize: function (deadline) {
            var base = this;
            base.deadline = deadline;
            base.model = deadline;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(tasks_template, {});
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});