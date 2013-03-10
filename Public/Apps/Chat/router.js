define([
    'jquery',
    'underscore',
    'backbone',
    'TabView',
    'Models/Discussion',
    'Views/HomeView',
    'Views/DiscussionView',
], function ($, _, Backbone, TabView, Discussion, HomeView, DiscussionView) {

    var AppRouter = Backbone.Router.extend({
        routes:{
            '':"home",
            "show_discussion/:id": "show_discussion"
        }
    });

    var initialize = function (websocket) {
        var AppEvents = _.extend({}, Backbone.Events);

        var app_view = new TabView();
        app_view.init(AppEvents);
        $("#app_container").html(app_view.$el);
        //Home view: 1
        var home_view = new HomeView();
        home_view.init(AppEvents);
        app_view.addTab("Chat home", home_view.$el, "");

        //Discussion view : 2
        var discussion_container = $(document.createElement("div"));
        app_view.addTab("Discussions", discussion_container, "show_discussion/1");

        var app_router = new AppRouter();
        app_router.on("route:home", function () {
            app_view.show(1);
        });

        app_router.on("route:show_discussion", function (id) {
            app_view.show(2);
            var discussion = new Discussion({ id: id });
            var discussionView = new DiscussionView({ model: discussion });
            discussionView.init(AppEvents, websocket);
            discussion_container.html(discussionView.$el);

        });


        Backbone.history.start();
    };

    return {
        initialize:initialize
    };

});