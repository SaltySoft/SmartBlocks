define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/deadline_thumbnail.html',
    '../SubApps/DeadlineClock/DeadlineClock',
    '../SubApps/DeadlineProgressBar/DeadlineProgressBar',
    'Organization/Apps/Common/Organization'
], function ($, _, Backbone, DeadlineThumbnailTemplate, DeadlineClock, DeadlineProgressBar, Organization) {
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

            base.update()
            var timer = setInterval(function () {
                if (base.$el.height() > 0)
                    base.update()
            }, 500);

        },
        update: function () {
            var base = this;

            var date = base.task.getDueDate();
            var due_on = (date.getDate() < 10 ? '0' : '') + date.getDate() + '/' + (date.getMonth() < 10 ? '0' : '') + (date.getMonth() + 1) + '/' + date.getFullYear();
            var due_hour = (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '')  + date.getMinutes();

            base.$el.find(".due_on_d").html("Due on " + due_on);
            base.$el.find(".due_hour").html("At " + due_hour);

            var now = new Date();
            var timeleft = Math.abs(date.getTime() - now.getTime());

            if (now > date) {
                base.$el.find(".timeleft").html("+ " + Organization.getFullTimeString(timeleft));
            } else {
                base.$el.find(".timeleft").html("- " + Organization.getFullTimeString(timeleft));
            }

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