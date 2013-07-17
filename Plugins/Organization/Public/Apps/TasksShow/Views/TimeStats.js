define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/time_stats.html'
], function ($, _, Backbone, TimeStatsTemplate) {
    var View = Backbone.View.extend({
        tagName:"div",
        className:"task_time_stats",
        initialize:function (model) {
            var base = this;
            base.model = model;
            base.task = model;
        },
        init:function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
        },
        render:function () {
            var base = this;

            var template = _.template(TimeStatsTemplate, {

            });
            base.$el.html(template);
            base.update();
            var timer = setInterval(function () {
                if (base.$el.height() > 0)
                    base.update();
                else
                    clearInterval(timer);
            }, 500);

        },
        update:function () {
            var base = this;

            base.$el.find(".required_time").html(base.task.get("required_time") / 3600000);

            var now = new Date();
            var past_planned = 0;
            var next_planned = 0;
            var planned_tasks = base.task.get("planned_tasks").models;
            for (var k in planned_tasks) {

                var planned_task = planned_tasks[k];
                var start = planned_task.getStart();
                var end = new Date(planned_task.getStart());
                var duration = parseInt(planned_task.get("duration"));
                var time = start.getTime() + duration;
                end.setTime(time);

                if (end.getTime() < now.getTime()) {
                    past_planned += duration;
                } else {
                    if (start > now) {
                        next_planned += duration;
                    } else {
                        next_planned += duration + start.getTime() - end.getTime();
                        past_planned += -start.getTime() + now.getTime();
                    }
                }
            }
            past_planned = parseInt(past_planned);
            next_planned = parseInt(next_planned);
            base.$el.find(".past_planned_time").html((past_planned / 3600000).toFixed(2));
            base.$el.find(".next_planned_time").html((next_planned / 3600000).toFixed(2));
            var difference = ((base.task.get("required_time") - (past_planned + next_planned)) / 3600000).toFixed(2);
            base.$el.find(".planned_time_difference").html(difference > 0 ? difference : 0);
        },
        registerEvents:function () {
            var base = this;
        }
    });

    return View;
});