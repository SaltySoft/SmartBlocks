define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Common/Templates/organization.html',
    'Organization/Apps/Calendar/Views/MainView',
    'Organization/Apps/Tasks/Views/MainView',
    'Organization/Apps/Daily/Views/MainView',
    'Organization/Apps/Recap/Views/MainView',
    'Organization/Apps/ActivitiesIndex/Views/MainView',
    'Organization/Apps/Common/Collections/TaskUsers',
    'Apps/Common/Useful/External'
], function ($, _, Backbone, Template, CalendarView, WeekView, DailyView, RecapView, ActivitiesIndexView, TaskUsersCollection, External) {
    var OrganizationView = Backbone.View.extend({
        tagName: "div",
        className: "organization_view",
        initialize: function () {
            var base = this;
            base.task_users = new TaskUsersCollection();
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.render();

            var Router = Backbone.Router.extend({
                routes : {
                    "week" : "week",
                    "month" : "month",
                    "daily": "daily",
                    "recap": "recap",
                    "activities": "activitiesIndex"
                },
                week: function () {
                    base.launchWeek();
                },
                month: function () {
                    base.launchCalendar();
                },
                daily: function () {
                    base.launchPlanning();
                },
                recap: function () {
                    base.launchRecap();
                },
                activitiesIndex: function () {
                    base.launchActivitiesIndex();
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
            base.$el.find(".control_bar a").removeClass("selected");
            base.$el.find(".control_bar a.month").addClass("selected");
            base.setContent(base.current_view.$el)
        },
        launchWeek: function () {
            var base = this;
            base.current_view = new WeekView();
            base.current_view.init(base.SmartBlocks);
            base.$el.find(".control_bar a").removeClass("selected");
            base.$el.find(".control_bar a.week").addClass("selected");
            base.setContent(base.current_view.$el)
        },
        launchPlanning: function () {
            var base = this;
            base.current_view = new DailyView();
            base.current_view.init(base.SmartBlocks);
            base.$el.find(".control_bar a").removeClass("selected");
            base.$el.find(".control_bar a.daily").addClass("selected");
            base.setContent(base.current_view.$el);

        },
        launchRecap: function () {
            var base = this;
            base.current_view = new RecapView();
            base.current_view.init(base.SmartBlocks);
            base.$el.find(".control_bar a").removeClass("selected");
            base.$el.find(".control_bar a.recap").addClass("selected");
            base.setContent(base.current_view.$el);
        },
        launchActivitiesIndex: function () {
            var base = this;

            base.current_view = new ActivitiesIndexView();
            base.current_view.init(base.SmartBlocks);
            base.$el.find(".control_bar a").removeClass("selected");
            base.$el.find(".control_bar a.activities").addClass("selected");
            base.setContent(base.current_view.$el);
        },
        checkForNotifications: function () {
            var base = this;
            base.task_users.fetch({
                success: function () {
                    if (base.task_users.models.length > 0) {

                    }
                }
            });
        }
    });

    return OrganizationView;
});