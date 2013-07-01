define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Daily/Templates/task_item.html',
    'underscore_string'
], function ($, _, Backbone, TaskItemTemplate, _s) {
    var DeadlineItemView = Backbone.View.extend({
        tagName: "li",
        className: "deadline_item",
        initialize: function () {
            var base = this;
            base.task = this.model;
        },
        init: function (SmartBlocks) {
            var base = this;

            base.SmartBlocks = SmartBlocks;

            base.render();
            base.interval = setInterval(function () {
                base.render();
                if (base.$el.height() <= 0) {
                    clearInterval(base.interval);
                }
            }, 500);
            base.registerEvents();
            base.$el.show();
        },
        render: function () {
            var base = this;

            var template = _.template(TaskItemTemplate, { task: base.task, _s: _s });
            base.$el.html(template);
            var now = new Date();

            var date = base.task.getDueDate();

            if (date < now) {

                base.$el.addClass("overdue");

                var display = "Overdue by ";
                var milliseconds = now.getTime() - date.getTime();

                var days = milliseconds / ( 24 * 3600 * 1000);
                if (days >= 1) {
                    display += Math.floor(days) + "d ";
                }

                var hours = (days - Math.floor(days)) * 24;
                if (hours >= 1 && days <= 3)
                    display += Math.floor(hours) + " h ";

                var minutes = (hours - Math.floor(hours)) * 60;
                if (milliseconds < 1000 * 3600 * 24 && milliseconds > 60000)
                    display += Math.floor(minutes) + " m ";

                var seconds = (minutes - Math.floor(minutes)) * 60;
                if (milliseconds < 1000 * 3600 * 0.5 && milliseconds < 60000) {
                    display += Math.floor(seconds) + " s ";
                }

            } else {
                base.$el.removeClass("overdue");

                var display = "Due in ";
                var milliseconds = date.getTime() - now.getTime();

                var days = milliseconds / ( 24 * 3600 * 1000);
                if (days >= 1) {
                    display += Math.floor(days) + "d ";
                }

                var hours = (days - Math.floor(days)) * 24;
                if (hours >= 1 && days <= 3)
                    display += Math.floor(hours) + " h ";

                var minutes = (hours - Math.floor(hours)) * 60;
                if (milliseconds < 1000 * 3600 * 24)
                    display += Math.floor(minutes) + " m ";

                var seconds = (minutes - Math.floor(minutes)) * 60;
                if (milliseconds < 1000 * 3600 * 5) {
                    display += Math.floor(seconds) + " s ";
                }
            }

            base.$el.find(".ti_due_on").html(display);

        },
        registerEvents: function () {
            var base = this;
        }
    });

    return DeadlineItemView;
});