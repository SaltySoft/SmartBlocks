define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Daily/Views/Hour'
], function ($, _, Backbone, HourView) {
    var DailyPlanningView = Backbone.View.extend({
        tagName: "div",
        className : "daily_planning_view",
        initialize: function () {

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
            base.pos = 0;
            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;
            base.$el.html("");
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
        scroll: function (e) {
            var base = this;

            var e = window.event || e; // old IE support
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

            if (delta < 0) {
                if (base.pos > -62 * 24 + base.$el.parent().height())
                    base.pos -= 62;
            } else {
                if (base.pos <= -62)
                    base.pos += 62;
            }
            base.$el.css("top",base.pos);
        },
        registerEvents: function () {
            var base = this;

            base.$el.scroll(function () {
                alert("scrolled");
            });

            var parent = base.$el.parent();
            console.log(parent);
            if (base.el.addEventListener) {
                // IE9, Chrome, Safari, Opera
                base.el.addEventListener("mousewheel", $.proxy(base.scroll, base), false);
                // Firefox
                base.el.addEventListener("DOMMouseScroll",  $.proxy(base.scroll, base), false);
            }
        }
    });

    return DailyPlanningView;
});