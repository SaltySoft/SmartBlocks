define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Calendar/Templates/calendar_day.html',
    'text!Organization/Apps/Calendar/Templates/task_slot.html',
    'Organization/Apps/Common/Views/TaskPopup'
], function ($, _, Backbone, CalendarDayTemplate, TaskSlotTemplate, TaskPopup) {
    var CalendarDayView = Backbone.View.extend({
        tagName: "div",
        className: "box day",
        initialize: function () {

        },
        init: function (SmartBlocks, calendar, date) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.calendar = calendar;
            base.date = new Date(date);
            base.tasks = [];
            base.render();
        },
        setDate: function (date) {
            var base = this;
            base.date.setDate(date);
            base.$el.find(".day_number").html(base.date.getDate());
        },
        render: function () {
            var base = this;
            var template = _.template(CalendarDayTemplate, {});

            base.$el.html(template);
            base.registerEvents();
        },
        setDay: function (day) {
            var base = this;
        },
        addTask: function (task) {
            var base = this;
            var div = _.template(TaskSlotTemplate, { task: task, index:base.tasks.length });
            $(div).attr("data-index", base.tasks.length);
            base.$el.find(".tasks").append(div);
            base.tasks.push(task);


            if (task.get("completion_date") != null) {
                $(div).addClass("done");
            }
        },
        expand: function (e) {
            var base = this;
            var elt = base.$el;
            if (!elt.hasClass("expanded")) {
                for (var k in base.calendar.days) {
                    base.calendar.days[k].retract();
                }
                elt.addClass("expanded");

                console.log(base.date);
                base.$el.unbind("click.open");
            }
        },
        retract: function () {
            var base = this;
            base.$el.removeClass("expanded");
            base.$el.bind("click.open",$.proxy( base.expand, base));
        },
        registerEvents: function () {
            var base = this;
            base.$el.bind("click.open",$.proxy( base.expand, base ));

            base.$el.delegate(".close_button", "click", $.proxy( base.retract, base ));

            base.$el.delegate(".task_name", "click", function () {
                var elt = $(this);
                var task_elt = elt.closest(".task");
                console.log(task_elt);
                var task = base.tasks[task_elt.attr("data-index")];
                var popup = new TaskPopup(task);
                popup.init(base.SmartBlocks);
                popup.events.on("task_updated", function () {
                    task_elt.find(".task_name").html(task.get("name"));
                });
            });

            base.$el.delegate(".finished_button", "click", function () {
                var elt = $(this);
                var task_elt = elt.closest(".task");
                var task = base.tasks[task_elt.attr("data-index")];
                task_elt.addClass("done");
                task.set("completion_date", new Date().getTime() / 1000);
                task.save({}, {
                    success: function () {
                        base.SmartBlocks.show_message("Task succesfully saved");
                    }
                });
            });

            base.$el.delegate(".cancel_finish_button", "click", function () {
                var elt = $(this);
                var task_elt = elt.closest(".task");
                var task = base.tasks[task_elt.attr("data-index")];
                task.set("completion_date", null);
                task_elt.removeClass("done");
                task.save({}, {
                    success: function () {
                        base.SmartBlocks.show_message("Task successfully replanned");
                    }
                });
            });
        }
    });

    return CalendarDayView;
});