define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Daily/Templates/hour.html'
], function ($, _, Backbone, HourTemplate) {
    var HourView = Backbone.View.extend({
        tagName: "div",
        className: "hour_view",
        initialize: function () {

        },
        init: function (SmartBlocks, time) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.time = time;
            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(HourTemplate, {
                time: base.time
            });
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return HourView;
});