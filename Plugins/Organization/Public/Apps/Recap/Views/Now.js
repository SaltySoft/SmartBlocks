define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Recap/Templates/now_view.html',
    'Organization/Apps/Common/Organization',
    'Organization/Apps/Daily/Models/PlannedTask',
    'Organization/Apps/Recap/Views/Clock'
], function ($, _, Backbone, NowTemplate, Organization, PlannedTask, ClockView) {


    var View = Backbone.View.extend({
        tagName: "div",
        className: "now_view loading",
        states: {
            working: 1,
            pause: 0
        },
        initialize: function (planned_tasks) {
            var base = this;

            base.planned_tasks = planned_tasks;
            base.current_state = base.states.working;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
            base.registerEvents();

            var timer = 0;
            timer = setInterval(function () {
                if (base.$el.height() > 0) {

                    base.update();
                } else {
                    clearInterval(timer);
                }
            }, 1000);
            base.pause_time = undefined;
        },
        update: function () {
            var base = this;
            var now = new Date();
            if (base.current_state == base.states.working) {
                base.current_task = undefined;
                for (var k in base.planned_tasks.models) {
                    var planned_task = base.planned_tasks.models[k];
                    var start = planned_task.getStart();
                    var stop = new Date(start);
                    stop.setTime(start.getTime() + planned_task.get("duration"));
                    if (start <= now && now <= stop) {
                        base.current_task = planned_task;
                        break;
                    }
                }

                if (base.current_task) {
                    base.$el.removeClass("no_task");
                    var start = base.current_task.getStart();
                    var stop = new Date(start);
                    stop.setTime(start.getTime() + base.current_task.get("duration"));
                    base.$el.find(".current_task_name").html(base.current_task.get("content"));
                    base.$el.find(".current_task_end").html(stop.getHours() + "." + (stop.getMinutes() < 10 ? '0' : '') + stop.getMinutes());
                    var time_left = stop.getTime() - new Date().getTime();
                    base.$el.find(".current_task_time_left").html(Organization.getTimeString(time_left));
                    if (base.current_task.get("task")) {
                        base.$el.find(".deadline_linked").show();
                        base.$el.find(".deadline_name").html(base.current_task.get("task").get("name"));
                    } else {
                        base.$el.find(".deadline_linked").hide();
                    }
                } else {
                    base.$el.addClass("no_task");
                }
                base.$el.removeClass("loading");
            } else {
                var pause_time = Organization.getTimeString(now.getTime() - base.pause_time.getTime());
                base.$el.find(".pause_time").html(pause_time != "" ? pause_time : "0s");
            }

        },
        render: function () {
            var base = this;

            var template = _.template(NowTemplate, {});
            base.$el.html(template);

            var clock_view = new ClockView();
            base.$el.find(".clock_container").html(clock_view.$el);
            clock_view.init(base.SmartBlocks, base.planned_tasks);
        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate(".pause_button", "click", function () {
                var elt = $(this);

                if (base.current_state == base.states.working) {
                    base.current_state = base.states.pause;
                    base.$el.addClass("paused");
                    base.pause_time = new Date();
                    base.$el.find(".pause_time").html("0s");
                } else {
                    base.current_state = base.states.working;
                    base.$el.removeClass("paused");
                    var start = base.current_task.getStart();
                    var stop = new Date(start);
                    stop.setTime(stop.getTime() + base.current_task.get("duration"));

                    base.current_task.set("duration", base.pause_time.getTime() - start.getTime());
                    base.current_task.save();
                    var now = new Date();
                    if (now < stop) {
                        var task = new PlannedTask(base.current_task.attributes);
                        task.id = undefined;
                        task.attributes.id = undefined;


                        task.setStart(now);

                        task.set("duration", stop.getTime() - now.getTime());
                        task.save();
                        base.planned_tasks.add(task);
                    }

//                    base.planned_tasks.fetch();
                }
            });
            base.$el.delegate(".cancel_pause_button", "click", function () {
                base.current_state = base.states.working;
                base.$el.removeClass("paused");
                base.pause_time = undefined;
            });

            base.$el.delegate(".postpone_button", "click", function () {
                var date = base.current_task.getStart();
                date.setMinutes(date.getMinutes() + 30);
                base.current_task.setStart(date);
                base.current_task.save();
            });

            base.$el.delegate(".prepone_button", "click", function () {
                var date = base.current_task.getStart();
                date.setMinutes(date.getMinutes() - 30);
                base.current_task.setStart(date);
                base.current_task.save();
            });

            base.$el.delegate(".remtime_button", "click", function () {
                if (base.current_task.get("duration") > 60 * 60 * 1000) {
                    base.current_task.set("duration", base.current_task.get("duration") - 30 * 60 * 1000);
                    base.current_task.save();
                }
            });
            base.$el.delegate(".addtime_button", "click", function () {
                base.current_task.set("duration", base.current_task.get("duration") + 30 * 60 * 1000);
                base.current_task.save();
            });

            $(window).resize(function () {
                base.$el.find(".now_container").width = base.$el.width();
            });

        }
    });

    return View;
});