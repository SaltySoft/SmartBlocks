define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Calendar/Templates/calendar_day.html'
], function ($, _, Backbone, CalendarDayTemplate) {
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
        registerEvents: function () {
            var base = this;
            base.$el.click(function () {
                var elt = $(this);

                if (!elt.hasClass("expanded")) {
                    base.calendar.$el.find(".day").removeClass("expanded");
                    elt.addClass("expanded");
                }
                else {
                    elt.removeClass("expanded");
                }
            });

        }
    });

    return CalendarDayView;
});