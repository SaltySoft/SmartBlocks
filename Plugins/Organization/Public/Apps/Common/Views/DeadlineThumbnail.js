define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/deadline_thumbnail.html',
    '../SubApps/DeadlineClock/DeadlineClock',
    '../SubApps/DeadlineProgressBar/DeadlineProgressBar'
], function ($, _, Backbone, DeadlineThumbnailTemplate, DeadlineClock, DeadlineProgressBar) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "deadline_thumbnail_view",
        initialize: function (task) {
            var base = this;
            base.task = task;
            base.events = $.extend({}, Backbone.Events);
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(DeadlineThumbnailTemplate, {
                task: base.task
            });
            base.$el.html(template);

            base.$el.find(".name").html(base.task.get("name"));

            var canvas_c = base.$el.find(".deadline_clock");

            var canvas_p = base.$el.find(".progress_bar");


            var deadline_clock = new DeadlineClock(canvas_c[0], base.task);
            var deadline_progress_bar = new DeadlineProgressBar(canvas_p[0], base.task);

        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate(".completed_button", "click", function () {
                base.task.set("completion_date", new Date().getTime());
                base.task.save();
                base.events.trigger("set_complete", base);
            });
        }
    });

    return View;
});