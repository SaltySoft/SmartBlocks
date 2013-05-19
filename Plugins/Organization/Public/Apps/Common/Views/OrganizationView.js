define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Common/Templates/organization.html',
    'Organization/Apps/Calendar/Views/MainView',
    'Organization/Apps/Tasks/Views/MainView'
], function ($, _, Backbone, Template, CalendarView, WeekView) {
    var OrganizationView = Backbone.View.extend({
        tagName: "div",
        className: "organization_view",
        initialize: function () {
            var base = this;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.render();
            base.registereEvents();
            var Router = Backbone.Router.extend({
                routes : {
                    "week" : "week",
                    "month" : "month"
                },
                week: function () {
                    base.launchWeek();
                },
                month: function () {
                    base.launchCalendar();
                }
            });

            var app_router = new Router();
            Backbone.history.start();
        },
        render: function () {
            var base = this;
            var template = _.template(Template, {});
            base.$el.html(template);
        },
        registereEvents: function () {
            var base = this;
            base.$el.delegate(".control_bar a", "click", function () {
                var elt = $(this);
                if (elt.hasClass("month_view_button")) {
                    base.launchCalendar();
                }
                if (elt.hasClass("week_view_button")) {
                    base.launchWeek();
                }
            });
        },
        setContent: function (element) {
            var base = this;
            base.$el.find(".sub_app_holder").html(element);
        },
        launchCalendar: function () {
            var base = this;
            base.current_view = new CalendarView();
            base.current_view.init(base.SmartBlocks);
            base.setContent(base.current_view.$el)
        },
        launchWeek: function () {
            var base = this;
            base.current_view = new WeekView();
            base.current_view.init(base.SmartBlocks);
            base.setContent(base.current_view.$el)
        }
    });

    return OrganizationView;
});