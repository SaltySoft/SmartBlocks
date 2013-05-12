define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Calendar/Views/Calendar',
    'text!Organization/Apps/Calendar/Templates/main_view.html'
], function ($, _, Backbone, CalendarView, MainViewTemplate) {
    var MainView = Backbone.View.extend({
        tagName: "div",
        className: "calendar_main_view",
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

            var template = _.template(MainViewTemplate, {});

            base.$el.html(template);
            base.calendar_view = new CalendarView(base.SmartBlocks);
            base.$el.find(".calendar_container").html(base.calendar_view.$el);

        },
        registerEvents: function () {

        }
    });

    return MainView;
});