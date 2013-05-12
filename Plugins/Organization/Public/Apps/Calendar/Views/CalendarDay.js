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
        },
        registerEvents: function () {
            var base = this;
            base.$el.click(function () {
                var elt = $(this);

                if (!elt.hasClass("expanded")) {
                    base.calendar.$el.find(".day").removeClass("expanded");
                    elt.addClass("expanded");
                    console.log(base.date);
                }
                else {
                    elt.removeClass("expanded");
                }
            });

        }
    });

    return CalendarDayView;
});