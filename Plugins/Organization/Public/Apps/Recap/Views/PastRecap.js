define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Recap/Templates/past_recap.html',
    'Organization/Apps/Daily/Collections/PlannedTasks'
], function ($, _, Backbone, PastRecapTemplate, PlannedTasksCollection) {

    function getTimeString(time) {
        var display = "";

        var hours = time / 3600000;
        if (hours >= 1) {
            display += Math.floor(hours) + "h ";
        }

        var min = (hours - Math.floor(hours)) * 60;
        if (min >= 1) {
            display += Math.floor(min) + "m ";
        }

        var sec = (min - Math.floor(min)) * 60;
        if (sec >= 1 && time < 15 * 60000) {
            display += Math.floor(sec) + "s ";
        }
        return display;
    }

    var PastRecapView = Backbone.View.extend({
        tagName: "div",
        className: "past_recap",
        initialize: function () {

        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.today_planned = new PlannedTasksCollection();

            base.render();
            base.update();
            base.fetch();
            base.interval = setInterval(function () {
                if (base.$el.height() > 0)
                    base.update();
                else
                    clearInterval(base.interval);
            }, 1000);
        },
        update: function () {
            var base = this;
            var time_worked = 0;
            var total_work = 0;
            var now = new Date();
            for (var k in base.today_planned.models) {
                var planned_task = base.today_planned.models[k];
                var start = planned_task.getStart()
                if (start < now) {
                    if (start.getTime() + planned_task.get("duration") < now.getTime()) {
                        time_worked += planned_task.get("duration");
                    } else {
                        time_worked += now.getTime() - (start.getTime());
                    }

                }
                total_work += planned_task.get("duration");
            }
            base.$el.find(".today_worked_amount").html(getTimeString(time_worked));
            base.$el.find(".today_work_amount").html(getTimeString(total_work));
        },
        fetch: function () {
            var base = this;
            base.today_planned.fetch({
                data: {
                    "date": new Date().getTime()
                },
                success: function () {

                }
            });
        },
        render: function () {
            var base = this;

            var template = _.template(PastRecapTemplate, {});

            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return PastRecapView;
});