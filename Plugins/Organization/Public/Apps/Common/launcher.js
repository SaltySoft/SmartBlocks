define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Common/Views/OrganizationView',
    'Organization/Apps/Calendar/Views/MainView',
    'Organization/Apps/Tasks/Views/MainView'
], function ($, _, Backbone, OrganizationView, CalendarView, WeekView) {
    var initialize = function (SmartBlocks) {
//
//
//
//        var Controller = {
//            main_view: null,
//            setContent: function (element) {
//                $("#app_container").html(element);
//            },
//            LaunchCalendar: function () {
//                alert("month");
//                Controller.main_view = new CalendarView();
//                Controller.main_view.init(SmartBlocks);
//                Controller.setContent(Controller.main_view.$el)
//            },
//            LaunchWeek: function () {
//                alert("week");
//                Controller.main_view = new WeekView();
//                Controller.main_view.init(SmartBlocks);
//                Controller.setContent(Controller.main_view.$el)
//            }
//        };
//
//        var Router = Backbone.Router.extend({
//            routes : {
//                "week" : "week",
//                "month" : "month"
//            },
//            week: function () {
//                Controller.LaunchWeek();
//            },
//            month: function () {
//                Controller.LaunchCalendar();
//            }
//        });
//
//        var app_router = new Router();
//        Backbone.history.start();
        var org_view = new OrganizationView();
        $("#app_container").html(org_view.$el);
        org_view.init(SmartBlocks);

    };


    return {
        init: initialize
    };
});