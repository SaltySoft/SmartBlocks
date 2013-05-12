define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Calendar/Templates/calendar.html',
    'Organization/Apps/Calendar/Views/CalendarDay'
], function ($, _, Backbone, CalendarTemplate, CalendarDayView) {
    var CalendarView = Backbone.View.extend({
        tagName: "div",
        className: "calendar_view",
        initialize: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.init();
        },
        init: function () {
            var base = this;
            base.render();
        },
        render: function () {
            var base = this;

            var template = _.template(CalendarTemplate, {});
            base.days = [];
            base.$el.html(template);
            base.setUpCalendar();
        },
        setUpCalendar: function () {
            var base = this;
            var today = new Date();
            var first_day = new Date(today.getFullYear(), today.getMonth(), 1);
            var month_days = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//            var last_month = new Date(today.getFullYear(), today.getMonth(), 0);

            var last_month = new Date();
            last_month.setDate(first_day.getDate() - 1);
            console.log(last_month);

            var next_month = new Date();
            next_month.setDate(month_days.getDate() + 1);
            var last_month_days = last_month.getDate();
            console.log("LASTMONTH", last_month_days);
            console.log("THISMONTH", month_days.getDate());
            var j = 0;
            //First week setup
            var calendar_days_div = base.$el.find(".calendar_days");
            for (var i = first_day.getDay(); i > 0; i--) {
                var day_box = new CalendarDayView(base.SmartBlocks, base);
                base.days.push(day_box);
                day_box.$el.attr("attr-index", base.days.length - 1);
                day_box.setDate(first_day.getDate() - i);
                calendar_days_div.append(day_box.$el);
                console.log("DAY");
            }

            for (var i = 1; i <= month_days.getDate(); i++) {
                var day_box = new CalendarDayView(base.SmartBlocks, base);
                base.days.push(day_box);
                day_box.$el.attr("attr-index", base.days.length - 1);
                day_box.setDate(first_day.getDate() + i - 1);
                calendar_days_div.append(day_box.$el);
                console.log("DAY");
            }
            j = 1;
            for (var i = next_month.getDay(); i <= 6; i++) {
                var day_box = new CalendarDayView(base.SmartBlocks, base);
                base.days.push(day_box);
                day_box.$el.attr("attr-index", base.days.length - 1);
                day_box.setDate(month_days.getDate() + j++);
                calendar_days_div.append(day_box.$el);
                console.log("DAY");
            }
            base.registerEvents();
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return CalendarView;
});