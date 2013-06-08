define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Daily/Views/Hour',
    'Organization/Apps/Daily/Views/PlannedTask'
], function ($, _, Backbone, HourView, PlannedTaskView) {
    var DailyPlanningView = Backbone.View.extend({
        tagName: "div",
        className: "daily_planning_view",
        initialize: function () {
            var base = this;
            base.update_on = true;
        },
        init: function (SmartBlocks, date) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.hours_holders = [];
            base.date = date;

            base.date.setHours(0);
            base.date.setMinutes(0);
            base.date.setSeconds(0);
            base.date.setMilliseconds(0);

            base.render();
            base.registerEvents();

        },
        render: function () {
            var base = this;
            base.$el.html('<div class="line"></div>');
            base.hours_holders = [];
            var last_time = new Date(base.date);
            console.log(last_time);
            for (var i = 0; i < 24; i++) {
                var hour_holder = new HourView();
                var time = new Date(last_time);

                hour_holder.init(base.SmartBlocks, time);

                base.hours_holders.push(hour_holder);
                base.$el.append(hour_holder.$el);
                base.$el.append('<div class="clearer"></div>');
                time.setHours(last_time.getHours() + 1);
                last_time = time;

            }


        },
        updateCurrentTime: function () {
            var base = this;

            var line = base.$el.find(".line");
            var now = new Date();
            if (base.getStartPosition(now) > 0) {
                line.css("top", base.getStartPosition(now));
                line.show();


            }

            if (base.update_on)
                setTimeout(function () {
                    base.updateCurrentTime();
                }, 300);
        },
        scroll: function (e) {
            var base = this;

            var e = window.event || e; // old IE support
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

            if (delta < 0) {
                if (base.pos > -base.getHourHeight() * 24 + base.$el.parent().height())
                    base.pos -= base.getHourHeight();
            } else {
                if (base.pos <= -base.getHourHeight())
                    base.pos += base.getHourHeight();
            }
            base.$el.css("top", base.pos);
        },
        getHourHeight: function () {
            var base = this;
            return base.$el.height() > 0 ? base.$el.height() / 24 : 27;
        },
        getStartPosition: function (date) {
            var base = this;
            var hour = date.getHours();
            var minute = date.getMinutes();
            return base.$el.height() / (24 * 60) * (hour * 60 + minute);
        },
        createTask: function () {
            var base = this;
            var planned_task = new PlannedTaskView();
            planned_task.init(base.SmartBlocks, base, new Date(), new Date().setHours(new Date().getHours + 2), undefined);
            base.$el.append(planned_task.$el);
        },
        registerEvents: function () {
            var base = this;


            var parent = base.$el.parent();
            console.log(parent);
            if (base.el.addEventListener) {
                // IE9, Chrome, Safari, Opera
                base.el.addEventListener("mousewheel", $.proxy(base.scroll, base), false);
                // Firefox
                base.el.addEventListener("DOMMouseScroll", $.proxy(base.scroll, base), false);
            }
            base.updateCurrentTime();
            var now = new Date();

            if (now.getHours() > 12) {
                base.pos = -12 * (base.getHourHeight());
                base.$el.css("top", base.pos);
            }

            /**
             * Tests
             */
            base.$el.bind("click.create_task", function () {
                base.createTask();
            });
        }
    });

    return DailyPlanningView;
});