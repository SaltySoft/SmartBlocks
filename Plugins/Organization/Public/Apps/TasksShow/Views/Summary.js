define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/summary.html'
], function ($, _, Backbone, summary_template) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "a_class",
        initialize: function (task) {
            var base = this;
            base.task = task;
            base.model = task;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
        },
        render: function () {
            var base = this;

            var template = _.template(summary_template, {});
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});