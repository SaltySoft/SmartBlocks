define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main.html'
], function ($, _, Backbone, main_template) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "task_normal_thumbnail",
        initialize: function () {
            var base = this;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
        },
        render: function () {
            var base = this;

            var template = _.template(main_template, {});
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});