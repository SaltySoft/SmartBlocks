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
        initialize: function () {
            var base = this;
            base.events = $.extend({}, Backbone.Events);
        },
        init: function (SmartBlocks, parent_view) {
            var base = this;

            base.SmartBlocks = SmartBlocks;

            base.planned_tasks = new PlannedTasksCollection();



            base.parent_view = parent_view;

            var template = _.template(TimelineTemplate, {});
            base.$el.html(template);

            base.$el.disableSelection();

            base.$canvas = base.$el.find("canvas");
            base.canvas = base.$canvas[0];
            base.timeline_app = new TimelineApp();




            base.planned_tasks.fetch({
                success: function () {
                    base.timeline_app.init(base.SmartBlocks, base.canvas, base);
                }
            });

        },
        registerEvents: function () {
            var base = this;
        }
    });

    return TimelineView;
});