define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main_view.html'
], function ($, _, Backbone) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "task_show_main_view",
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

            var template = _.template(SomeTemplate, {});
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});