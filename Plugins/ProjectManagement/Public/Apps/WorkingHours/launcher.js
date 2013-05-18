define([
    'jquery',
    'underscore',
    'backbone',
    'UserModel',
    'ProjectManagement/Apps/WorkingHours/Views/Dashboard'
], function ($, _, Backbone, User, DashboardView) {

    var initialize = function (SmartBlocks) {
        var base = this;
        base.SmartBlocks = SmartBlocks;

        //Init the events and the router
        var AppEvents = _.extend({}, Backbone.Events);

//        var dashboard = new DashboardView(base.SmartBlocks);
//        dashboard.init(AppEvents);
//
//        $("#app_container").html(dashboard.$el);

        Backbone.history.start();
    };

    return {
        initialize:initialize
    };
});