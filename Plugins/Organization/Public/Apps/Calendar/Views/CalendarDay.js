define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Calendar/Templates/calendar_day.html',
    'text!Organization/Apps/Calendar/Templates/task_slot.html'
], function ($, _, Backbone, CalendarDayTemplate, TaskSlotTemplate) {
    var CalendarDayView = Backbone.View.extend({
        tagName: "div",
        className: "box day",
        initialize: function (SmartBlocks, calendar) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.calendar = calendar;
            base.date = new Date();
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
            var div = _.template(TaskSlotTemplate, { task: task });

            base.$el.find(".tasks").append(div);
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
        }
    });

    return CalendarDayView;
});