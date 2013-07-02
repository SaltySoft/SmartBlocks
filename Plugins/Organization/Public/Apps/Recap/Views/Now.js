define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Recap/Templates/now_view.html'
], function ($, _, Backbone, NowTemplate) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "now_view",
        initialize: function (planned_tasks) {
            var base = this;

            base.planned_task_collection = planned_tasks;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(NowTemplate, {});
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});