define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Calendar/Templates/calendar.html',
    'Organization/Apps/Calendar/Views/CalendarDay',
    'Organization/Apps/Tasks/Collections/Tasks'
], function ($, _, Backbone, CalendarTemplate, CalendarDayView, TasksCollection) {
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
            base.tasks_list = new TasksCollection();
            base.date = new Date();
            base.tasks_list.fetch({
                success: function () {
                    base.setUpCalendar(base.date);
                    base.registerEvents();
                }
            });

        },
        setUpCalendar: function (date) {
            var base = this;

            var calendar_days_div = base.$el.find(".calendar_days");
            calendar_days_div.html("");

            var monthNames = [ "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December" ];

            var today = date;
            var first_day = new Date(today.getFullYear(), today.getMonth(), 1);
            var month_days = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            var last_month = new Date(today);
            last_month.setDate(first_day.getDate() - 1);
            console.log(last_month);

            var next_month = new Date(today);
            next_month.setDate(month_days.getDate() + 1);
            //First week setup

            for (var i = first_day.getDay(); i > 0; i--) {
                var day_box = new CalendarDayView();
                day_box.init(base.SmartBlocks, base, today);
                base.days.push(day_box);
                day_box.$el.attr("attr-index", base.days.length - 1);
                day_box.setDate(first_day.getDate() - i);
                calendar_days_div.append(day_box.$el);
            }

            for (var i = 1; i <= month_days.getDate(); i++) {
                var day_box = new CalendarDayView();
                day_box.init(base.SmartBlocks, base, today);
                base.days.push(day_box);
                day_box.$el.attr("attr-index", base.days.length - 1);
                day_box.setDate(first_day.getDate() + i - 1);
                calendar_days_div.append(day_box.$el);
            }
            var j = 1;
            for (var i = next_month.getDay(); i <= 6; i++) {
                var day_box = new CalendarDayView();
                day_box.init(base.SmartBlocks, base, today);
                base.days.push(day_box);
                day_box.$el.attr("attr-index", base.days.length - 1);
                day_box.setDate(month_days.getDate() + j++);
                calendar_days_div.append(day_box.$el);
            }
            base.$el.find(".current_month").html(monthNames[date.getMonth()] + " " + date.getFullYear());
            base.fillCalendar();

        },
        addTask: function (task) {
            var base = this;
            for (var k in base.days) {
                var date = base.days[k].date;
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                var after = new Date();
                after.setFullYear(date.getFullYear());
                after.setMonth(date.getMonth());
                after.setDate(date.getDate() + 1);
                after.setHours(0);
                after.setMinutes(0);
                after.setSeconds(0);
                after.setMilliseconds(0);
                if (task.getDueDate() >= date && task.getDueDate() < after) {
                    base.days[k].addTask(task);
                }
            }
        },
        fillCalendar: function () {
            var base = this;
            console.log("fetching calendar");
            var tasks = base.tasks_list.models;
            for (var k in tasks) {
                base.addTask(tasks[k]);
            }
        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate(".next_month_button", "click", function () {
                console.log(base.date);
                base.date.setMonth(base.date.getMonth() - 1);
                base.setUpCalendar(base.date);
            });

            base.$el.delegate(".prev_month_button", "click", function () {
                console.log(base.date);
                base.date.setMonth(base.date.getMonth() + 1);
                base.setUpCalendar(base.date);
            });
        }
    });

    return CalendarView;
});