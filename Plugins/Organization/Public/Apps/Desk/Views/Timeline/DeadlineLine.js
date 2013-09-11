define([
    'jquery',
    'underscore',
    'backbone',
    'text!../../Templates/Timeline/deadline_line.html',
    'Organization/Apps/Common/SubApps/WorktimeProgressBar/WorktimeProgressBar'
], function ($, _, Backbone, deadline_line_tpl, WorktimeProgressBar) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "deadline_line",
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

            });
            base.$el.html(template);

            base.update();

            setInterval(function () {
                base.update();
            }, 1000);
        },
        update: function () {
            var base = this;

            base.$el.find(".deadline_name").html(base.deadline.get('name'));
            var timeleft = base.deadline.getTimeLeft();
            var left_time_str =  (timeleft > 0 ? "- " : "+ ") + OrgApp.common.getFullTimeString(Math.abs(timeleft));

            base.$el.find(".timeleft").html(left_time_str);

            var canvas = base.$el.find(".work_time_pb");
            var progress_bar = new WorktimeProgressBar(canvas[0], base.deadline.getWork());
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});