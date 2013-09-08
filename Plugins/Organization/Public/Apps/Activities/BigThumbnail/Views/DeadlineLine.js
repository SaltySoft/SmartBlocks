define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/deadline_line.html',
    'Organization/Apps/Common/SubApps/WorktimeProgressBar/WorktimeProgressBar'
], function ($, _, Backbone, deadline_line_tpl, WorktimeProgressBar) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "activity_thb_deadline_line",
        initialize: function (deadline) {
            var base = this;

            base.deadline = deadline;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
        },
        render: function () {
            var base = this;

            var template = _.template(deadline_line_tpl, {
                deadline: base.deadline
            });
            base.$el.html(template);

            var work = base.deadline.getWork();
            var canvas = base.$el.find(".worktime_progressbar");
            base.progress_bar = new WorktimeProgressBar(canvas[0], work);
            base.update();
            setInterval(function () {
                if (base.$el.width() > 0) {
                    base.update();
                }
            }, 1000);

        },
        update: function () {
            var base = this;

            base.$el.find(".deadline_name").html(base.deadline.get('name'));

            var work = base.deadline.getWork();

            base.progress_bar.updateWorktime(work);
            var now = new Date();
            var end = base.deadline.getStop();
            var time_left = Math.abs(end.getTime() - now.getTime());

            var timeleft_container = base.$el.find(".deadline_timeleft");

            if (now < end) {
                base.$el.removeClass("late");
            } else {
                base.$el.addClass("late");
            }

            timeleft_container.html((now < end ? "-" : "+") + " " + OrgApp.common.getFullTimeString(time_left));
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});