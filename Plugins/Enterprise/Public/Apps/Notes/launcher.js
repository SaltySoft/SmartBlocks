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
            'show_all':'show_all',
            'show_importants':'show_importants',
            'create_note':'create_note'
        }
    });

    var initialize = function () {
        //Init the events and the router
        var AppEvents = _.extend({}, Backbone.Events);
        var app_router = new AppRouter();

        var dashboard = new DashboardView();
        dashboard.init(AppEvents);

        $("#app_container").html(dashboard.$el);

        // Backbone issue:
        // https://github.com/documentcloud/backbone/issues/652
        // because router.navigate doesn't call router unless hash is changed
        $('.panel_button_link').click(function () {
            route = Backbone.history.fragment;
            if ("#" + route == $(this).attr("href"))
            {
                app_router.navigate();
                app_router.navigate(route, true);
            }
//            app_router.navigate(route, {trigger: true});
        });

        app_router.on('route:home', function () {
            dashboard.clear();
        });
        app_router.on('route:show_all', function () {
            dashboard.clear();
            dashboard.render();
        });
        app_router.on('route:show_importants', function () {
            dashboard.clear();
        });
        app_router.on('route:create_note', function () {
            dashboard.clear();
            dashboard.showCreateNote();
        });

        Backbone.history.start();
    };

    return {
        initialize:initialize
    };
});