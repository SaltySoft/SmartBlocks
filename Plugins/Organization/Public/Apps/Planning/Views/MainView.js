define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main_view.html',
    './Calendar'
], function ($, _, Backbone, MainViewTemplate, CalendarView) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "planning_view",
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

            var template = _.template(MainViewTemplate, {});
            base.$el.html(template);

            var calendar_view = new CalendarView();
            base.$el.find(".calendar_container").html(calendar_view.$el);
            calendar_view.init(base.SmartBlocks);

        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});