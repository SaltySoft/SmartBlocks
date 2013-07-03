define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Recap/Templates/clock.html',
    'Organization/Apps/Recap/SubApps/Clock/Clock'
], function ($, _, Backbone, ClockViewTemplate, ClockApp) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "clock_view",
        initialize: function () {
            var base = this;
        },
        init: function (SmartBlocks, planned_tasks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.planned_tasks = planned_tasks;

            base.render();


        },
        render: function () {
            var base = this;

            var template = _.template(ClockViewTemplate, {});

            base.$el.html(template);
            base.$cv = base.$el.find("canvas");
            base.cv = base.$cv[0];
            var clock_app = new ClockApp(base.cv, base.planned_tasks);
            clock_app.run();
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});