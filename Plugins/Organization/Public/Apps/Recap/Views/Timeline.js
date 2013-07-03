define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Recap/Templates/timeline.html',
    'Organization/Apps/Recap/SubApps/Timeline/Timeline',
    'Organization/Apps/Daily/Collections/PlannedTasks'
], function ($, _, Backbone, TimelineTemplate, TimelineApp, PlannedTasksCollection) {
    var TimelineView = Backbone.View.extend({
        tagName: "div",
        className: "timeline_view",
        initialize: function (planned_tasks) {
            var base = this;
            base.events = $.extend({}, Backbone.Events);
            base.planned_tasks = planned_tasks;
        },
        init: function (SmartBlocks, parent_view) {
            var base = this;

            base.SmartBlocks = SmartBlocks;


            base.parent_view = parent_view;

            var template = _.template(TimelineTemplate, {});
            base.$el.html(template);

            base.$el.disableSelection();

            base.$canvas = base.$el.find("canvas");
            base.canvas = base.$canvas[0];
            base.timeline_app = new TimelineApp();

            base.timeline_app.init(base.SmartBlocks, base.canvas, base);


            base.registerEvents();

        },
        registerEvents: function () {
            var base = this;

            $(window).resize(function () {
                base.canvas.width = base.$el.width();
            });
            base.planned_tasks.on("change", function () {
                base.timeline_app.init(base.SmartBlocks, base.canvas, base);
            });
        }
    });

    return TimelineView;
});