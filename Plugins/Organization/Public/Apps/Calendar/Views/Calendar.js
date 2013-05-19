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
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.render();
        },
        render: function () {
            var base = this;

            var template = _.template(CalendarTemplate, {});
            base.days = [];
            base.$el.html(template);
            base.tasks_list = new TasksCollection();
            base.date = new Date();

            base.setUpCalendar(base.date);
            base.registerEvents();


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
            var total_count = 0;
            for (var i = first_day.getDay(); i > 0; i--) {
                var day_box = new CalendarDayView();
                day_box.init(base.SmartBlocks, base, today);
                base.days.push(day_box);
                day_box.$el.attr("attr-index", base.days.length - 1);
                day_box.setDate(first_day.getDate() - i);

                day_box.setInactive();
                calendar_days_div.append(day_box.$el);
                total_count++;
            }
            var current_date = new Date();
            for (var i = 1; i <= month_days.getDate(); i++) {
                var day_box = new CalendarDayView();
                day_box.init(base.SmartBlocks, base, today);
                base.days.push(day_box);
                day_box.$el.attr("attr-index", base.days.length - 1);
                day_box.setDate(first_day.getDate() + i - 1);
                calendar_days_div.append(day_box.$el);
                if (day_box.date.getMonth() == current_date.getMonth() && day_box.date.getFullYear() == current_date.getFullYear() && day_box.date.getDate() == current_date.getDate()) {
                    day_box.setCurrentDay();
                }
                total_count++;
            }
            var j = 1;
            for (var i = next_month.getDay(); i <= 6 || total_count < 42; i++) {
                var day_box = new CalendarDayView();
                day_box.init(base.SmartBlocks, base, today);
                base.days.push(day_box);
                day_box.$el.attr("attr-index", base.days.length - 1);
                day_box.setDate(month_days.getDate() + j++);
                day_box.setInactive();
                calendar_days_div.append(day_box.$el);
                total_count++;
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
            base.SmartBlocks.startLoading("Loading month tasks...");
            base.tasks_list.fetch({
                success: function () {
                    var tasks = base.tasks_list.models;
                    for (var k in tasks) {
                        base.addTask(tasks[k]);
                    }
                    base.SmartBlocks.stopLoading();
                }
            });
        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate(".prev_month_button", "click", function () {
                console.log(base.date);
                base.date.setMonth(base.date.getMonth() - 1);
                base.setUpCalendar(base.date);
            });

            base.$el.delegate(".next_month_button", "click", function () {
                console.log(base.date);
                base.date.setMonth(base.date.getMonth() + 1);
                base.setUpCalendar(base.date);
            });
        }
    });

    return CalendarView;
});