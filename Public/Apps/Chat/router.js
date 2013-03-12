define([
    'jquery',
    'underscore',
    'backbone',
    'TabView',
    'Chat/Models/Discussion',
    'Chat/Views/HomeView',
    'Chat/Views/DiscussionView',
    'UserModel'
], function ($, _, Backbone, TabView, Discussion, HomeView, DiscussionView, User) {

    var AppRouter = Backbone.Router.extend({
        routes:{
            '':"home",
            "show_discussion/:id":"show_discussion"
        }
    });


    var initialize = function (websocket) {
        User.getCurrent(function (current_user) {

                $("#chat_button").click(function () {
                    $("#chat_container").toggle();
                });

                var ChatApplication = {
                    current_user:current_user
                };

                var AppEvents = _.extend({}, Backbone.Events);
                ChatApplication.AppEvents = AppEvents;
                var app_view = new TabView();
                app_view.init(AppEvents, current_user);
                $("#chat_container").html(app_view.$el);
                console.log($("#chat_container"));

                var home_container = $(document.createElement("div"));
                app_view.addTab("Chat home", home_container);


                //Discussion view : 2
                var discussion_container = $(document.createElement("div"));
                app_view.addTab("Discussions", discussion_container);

                ChatApplication.show_discussion = function (id) {
                    var discussion = new Discussion({ id:id });
                    var discussionView = new DiscussionView({ model:discussion });
                    discussionView.init(AppEvents, current_user, websocket);
                    discussion_container.html(discussionView.$el);
                    app_view.show(2);
                };

                //Home view: 1
                var home_view = new HomeView();
                home_view.init(ChatApplication);
                home_container.append(home_view.$el);

                var app_router = new AppRouter();
                app_router.on("route:home", function () {
                    app_view.show(1);
                });
                app_router.on("route:show_discussion", function (id) {
                    app_view.show(2);
                    var discussion = new Discussion({ id:id });
                    var discussionView = new DiscussionView({ model:discussion });
                    discussionView.init(AppEvents, current_user, websocket);
                    discussion_container.html(discussionView.$el);
                });


                try {
                    Backbone.history.start()
                } catch(err) {
                    Backbone.history.loadUrl()
                }

            }
        )
        ;
    };


    return {
        initialize:initialize
    };

});