define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Recap/Views/NextDay',
    'text!Organization/Apps/Recap/Templates/next_days.html'
], function ($, _, Backbone, NextDayView, NextDaysTemplate) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "next_days_view",
        initialize: function () {
            var base = this;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;



            base.render();
        },
        render: function () {
            var base = this;

            var template = _.template(NextDaysTemplate, {});
            base.$el.html(template);

            base.next_days = [];
            var today = new Date();
            var date = new Date(today);
            date.setHours(0,0,0,0);
            for (var i = 0; i <= 7; i++) {
                var next_day = new NextDayView();
                base.$el.find(".days_container").append(next_day.$el);
                next_day.init(base.SmartBlocks, date, base);
                base.next_days.push(next_day);
                date = new Date(date);
                date.setDate(date.getDate() + 1);
            }
            base.$el.find(".days_container").append('<div class="clearer"></div>');
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});