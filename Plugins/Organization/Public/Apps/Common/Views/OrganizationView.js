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
    'Organization/Apps/ActivitiesShow/Views/MainView',
    'Organization/Apps/TasksBoard/Views/MainView',
    'Organization/Apps/TasksShow/Views/MainView',
    'Organization/Apps/Planning/Views/MainView',
    'Organization/Apps/Common/Collections/TaskUsers',
    'Organization/Apps/Common/Models/Activity',
    'Organization/Apps/Tasks/Models/Task',
    'Apps/Common/Useful/External'
], function ($, _, Backbone, Template, CalendarView, WeekView, DailyView, RecapView, ActivitiesIndexView,  ActivitiesShowView, TasksBoardView,TasksShow, PlanningView, TaskUsersCollection, Activity, Task, External) {
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
                    "activities": "activitiesIndex",
                    "activities/:id": "activitiesShow",
                    "tasks/:id": "tasksShow",
                    "tasks":"tasksBoard",
                    "planning": "planning"
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
                },
                tasksBoard:function () {
                    base.launchTasksBoard();
                },
                activitiesShow: function (id) {
                    base.launchActivitiesShow(id);
                },
                tasksShow: function (id) {
                    base.launchTasksShow(id);
                },
                planning: function () {
                    base.launchPlanningView();
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
        registerEvents: function () {
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
        launchTasksBoard:function () {
            var base = this;

            base.current_view = new TasksBoardView();
            base.current_view.init(base.SmartBlocks);
            base.$el.find(".control_bar a").removeClass("selected");
            base.$el.find(".control_bar a.tasks").addClass("selected");
            base.setContent(base.current_view.$el);
        },
        launchActivitiesShow: function (id) {
            var base = this;
            var activity = new Activity({ id: id });
            base.current_view = new ActivitiesShowView(activity);
            base.current_view.init(base.SmartBlocks);
            base.$el.find(".control_bar a").removeClass("selected");
            base.$el.find(".control_bar a.activities").addClass("selected");
            base.setContent(base.current_view.$el);
        },
        launchTasksShow : function (id) {
            var base = this;
            var task = new Task({ id: id });
            base.current_view = new TasksShow(task);
            base.current_view.init(base.SmartBlocks);
            base.$el.find(".control_bar a").removeClass("selected");
            base.$el.find(".control_bar a.activities").addClass("selected");
            base.setContent(base.current_view.$el);
        },
        launchPlanningView: function () {
            var base = this;
            base.current_view = new PlanningView();

            base.$el.find(".control_bar a").removeClass("selected");
            base.$el.find(".control_bar a.planning").addClass("selected");
            base.setContent(base.current_view.$el);
            base.current_view.init(base.SmartBlocks);
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