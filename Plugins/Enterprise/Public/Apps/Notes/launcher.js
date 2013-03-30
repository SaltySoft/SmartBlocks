define([
    'jquery',
    'underscore',
    'backbone',
    'UserModel',
    'Enterprise/Apps/Notes/Views/Dashboard'
], function ($, _, Backbone, User, DashboardView) {

    var AppRouter = Backbone.Router.extend({
        routes:{
            '':"home",
            'show_all':'show_all'
        }
    });

    var initialize = function () {
        //Init the events and the router
        var AppEvents = _.extend({}, Backbone.Events);
        var app_router = new AppRouter();

        var dashboard = new DashboardView();
        dashboard.init(AppEvents);

        $("#app_container").html(dashboard.$el);

        app_router.on('route:home', function () {
            dashboard.render();
        });

        app_router.on('route:show_all', function () {
            dashboard.render();
        });

        Backbone.history.start();
    };

    return {
        initialize:initialize
    };
});