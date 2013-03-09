define([
    'jquery',
    'underscore',
    'backbone',
    'TabView',
    'Views/HomeView'
], function ($, _, Backbone, TabView, HomeView) {

    var AppRouter = Backbone.Router.extend({
        routes:{
            '':"home"
        }
    });

    var initialize = function () {
        var AppEvents = _.extend({}, Backbone.Events);

        var app_view = new TabView();
        app_view.init(AppEvents);
        $("#app_container").html(app_view.$el);
        //Home view: 1
        var home_view = new HomeView();
        home_view.init(AppEvents);
        app_view.addTab("Chat home", home_view.$el, "");


        var app_router = new AppRouter();
        app_router.on("route:home", function () {
            app_view.show(1);
        });
        Backbone.history.start();
    };

    return {
        initialize:initialize
    };

});