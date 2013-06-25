define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Recap/Templates/today_recap.html',
    'Organization/Apps/Daily/Collections/PlannedTasks'
], function ($, _, Backbone, TodayRecapTemplate, PlannedTasksCollection) {


    function getTimeString(time) {
        var display = "";

        var hours = time / 3600000;
        if (hours >= 1) {
            display += " " +  Math.floor(hours) + "h";
        }

        var min = (hours - Math.floor(hours)) * 60;
        if (min >= 1) {
            display += " " + (Math.floor(min) < 10 ?  "0" : '') + Math.floor(min) + "m";
        }

        var sec = (min - Math.floor(min)) * 60;
        if (sec >= 1 && time < 15 * 60000) {
            display += " " + Math.floor(sec) + "s";
        }
        return display;
    }

    var MainView = Backbone.View.extend({
        tagName: 'div',
        className: 'recap_today',
        initialize: function () {

        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.today_planned = new PlannedTasksCollection();

            base.render();
            base.registerEvents();
            base.updateCurrentActivity();


            setInterval(function () {
                var now = new Date();
                var found_task = false;
                var next_task = undefined;
                var ptask = undefined;
                for (var k in base.today_planned.models) {
                    var planned_task = base.today_planned.models[k];
                    var task_start = planned_task.getStart();
                    var task_end = new Date(task_start.getTime() + planned_task.get("duration"));

                    if (task_start <= now && now <= task_end) {

                        ptask = planned_task;
                        var milliseconds = task_end.getTime() - now.getTime();

                        var display = "";
                        var hours = milliseconds / 3600000;
                        if (hours >= 1) {
                            display += Math.floor(hours) + "h";
                        }

                        var minutes = (hours - Math.floor(hours)) * 60;
                        if (minutes >= 1) {
                            display += " " + Math.floor(minutes) + "m";
                        }

                        var seconds = (minutes - Math.floor(minutes)) * 60;
                        if (seconds >= 1 && milliseconds < 15 * 60 * 1000) {
                            display += " " + Math.floor(seconds) + "s";
                        }

                        base.$el.find(".current_work_left_time").html('for ' + getTimeString(milliseconds) + ", until " +
                            task_end.getHours() + ":" +
                            (task_end.getMinutes() < 10 ? '0' : '') +
                            task_end.getMinutes());

                        found_task = true;
                    }


                    if (task_start > now && (!next_task || next_task.getStart() > task_start)) {
                        next_task = planned_task;
                    }
                }
                if (!found_task) {
                    base.$el.find(".right_now").addClass("nothing_to_do");
                } else {
                    base.$el.find(".right_now").removeClass("nothing_to_do");
                    base.$el.find(".current_work_name").html(ptask.getName());
                    base.$el.find(".deadline_name").html(ptask.getDeadlineName());
                }
                if (next_task) {
                    base.$el.find(".next_work_container").show();
                    var start_time = next_task.getStart();
                    base.$el.find(".next_work_name").html(next_task.getName());
                    var time_left = start_time.getTime() - new Date().getTime();
                    base.$el.find(".next_work_start_time").html(" in " + getTimeString(time_left) + " (at " + start_time.getHours() + "h" +
                        (start_time.getMinutes() < 10 ? "0" : "") +
                        start_time.getMinutes() + ")");
                    base.$el.find(".deadline_name_nxt").html(next_task.getDeadlineName());
                } else {
                    base.$el.find(".next_work_container").hide();
                }
            }, 500);
        },
        render: function () {
            var base = this;
            var template = _.template(TodayRecapTemplate, {});

            base.$el.html(template);


        },
        updateCurrentActivity: function () {
            var base = this;

            base.today_planned.fetch({
                data: {
                    "date": new Date().getTime()
                },
                success: function () {
                    console.log(base.today_planned);
                }
            });
        },
        registerEvents: function () {

        }
    });

    return MainView;
});