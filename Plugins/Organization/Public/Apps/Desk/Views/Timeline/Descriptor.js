define([
    'jquery',
    'underscore',
    'backbone',
    'text!../../Templates/Timeline/descriptor.html',
    'Organization/Apps/Tasks/NormalThumbnail/Views/Main',
    'text!../../Templates/Timeline/current_event_timing.html',
    'text!../../Templates/Timeline/future_event_timing.html',
    './DeadlineLine',
    './ActivityBox',
    'Organization/Apps/Recap/Views/Clock'
], function ($, _, Backbone, descriptor_tpl, NormalThumbnailView, current_event_tpl, future_event_tpl, DeadlineLineView, ActivityBoxView, Clock) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "descriptor",
        initialize: function (planned_task) {
            var base = this;

            base.planned_task = planned_task;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.task = OrgApp.tasks.get(base.planned_task.get('task').get('id'));
            base.deadline = OrgApp.deadlines.get(base.task.get('deadline').get('id'));
            base.activity = OrgApp.activities.get(base.task.get('activity').id);

            base.render();

        },
        render: function () {
            var base = this;

            var template = _.template(descriptor_tpl, {});
            base.$el.html(template);

            var task_thumbnail = new NormalThumbnailView(base.task);
            base.$el.find(".task_thb_container").html(task_thumbnail.$el);
            task_thumbnail.init(base.SmartBlocks);

            var deadline_line_view = new DeadlineLineView(base.deadline);
            base.$el.find(".deadline_line_container").html(deadline_line_view.$el);
            deadline_line_view.init(base.SmartBlocks);

            var activity_box_view = new ActivityBoxView(base.activity);
            base.$el.find(".activity_box_container").html(activity_box_view.$el);
            activity_box_view.init(base.SmartBlocks);

            var clock_view = new Clock();
            base.$el.find(".clock_container").html(clock_view.$el);
            clock_view.init(base.SmartBlocks, OrgApp.planned_tasks);


            base.update();

            setInterval(function () {
                if (base.$el.height() > 0)
                    base.update();
            }, 500);
        },
        update: function () {
            var base = this;

            var now = new Date();
            if (base.planned_task.getStart() < now && base.planned_task.getEnd() > now) {
                var end_time = base.planned_task.getEnd();
                var time = (end_time.getHours() < 10 ? '0' : '') + end_time.getHours() + ":" +
                    (end_time.getMinutes() < 10 ? '0' : '') + end_time.getMinutes();


                var timing_tpl = _.template(current_event_tpl, {
                    end_time: time,
                    worked_time: OrgApp.common.getTimeString(now.getTime() - base.planned_task.getStart().getTime()),
                    time_to_end: OrgApp.common.getTimeString(base.planned_task.getEnd().getTime() - now.getTime()),
                    total_task_worked_time: OrgApp.common.getTimeString(base.task.getWork().done)
                });

                base.$el.find(".timing_container").html(timing_tpl);
            } else if (base.planned_task.getStart() > now) {
                var end_time = base.planned_task.getEnd();
                var start_time = base.planned_task.getStart();
                var etime = (end_time.getHours() < 10 ? '0' : '') + end_time.getHours() + ":" +
                    (end_time.getMinutes() < 10 ? '0' : '') + end_time.getMinutes();
                var stime = (start_time.getHours() < 10 ? '0' : '') + start_time.getHours() + ":" +
                    (start_time.getMinutes() < 10 ? '0' : '') + start_time.getMinutes();


                var timing_tpl = _.template(future_event_tpl, {
                    end_time: etime,
                    start_time: stime,
                    duration: OrgApp.common.getTimeString(base.planned_task.get('duration')),
                    total_task_worked_time: base.task.getWork().done ? OrgApp.common.getTimeString(base.task.getWork().done) : '-'
                });

                base.$el.find(".timing_container").html(timing_tpl);
            } else if (base.planned_task.getStop() < now) {
                var end_time = base.planned_task.getEnd();
                var start_time = base.planned_task.getStart();
                var etime = (end_time.getHours() < 10 ? '0' : '') + end_time.getHours() + ":" +
                    (end_time.getMinutes() < 10 ? '0' : '') + end_time.getMinutes();
                var stime = (start_time.getHours() < 10 ? '0' : '') + start_time.getHours() + ":" +
                    (start_time.getMinutes() < 10 ? '0' : '') + start_time.getMinutes();


                var timing_tpl = _.template(future_event_tpl, {
                    end_time: etime,
                    start_time: stime,
                    duration: OrgApp.common.getTimeString(base.planned_task.get('duration')),
                    total_task_worked_time: base.task.getWork().done ? OrgApp.common.getTimeString(base.task.getWork().done) : '-'
                });
            }
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});