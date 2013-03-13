define([
    'jquery',
    'underscore',
    'backbone',
    'TabView',
    'Chat/Models/Discussion',
    'Chat/Views/HomeView',
    'Chat/Views/DiscussionView',
    'Chat/Views/DiscussionCreationView',
    'UserModel'
], function ($, _, Backbone, TabView, Discussion, HomeView, DiscussionView, DiscussionCreationView, User) {

        var AppRouter = Backbone.Router.extend({
            routes:{
                '':"home",
                "show_discussion/:id":"show_discussion"
            }
        });


        var initialize = function (websocket) {
            var base = this;
            User.getCurrent(function (current_user) {

                    var ChatApplication = {
                        current_user:current_user
                    };

                    var discussion_creation_view = new DiscussionCreationView();
                    discussion_creation_view.init(ChatApplication);


                    ChatApplication.discussion_creation_view = discussion_creation_view;

                    var container = $(document.createElement("div"));
                    container.addClass("k_chat_main_container");
                    ChatApplication.$el = $("#chat_container");
                    $("#chat_container").append(container);
                    $("#chat_button").click(function () {
                        $("#chat_container").toggle();
                        if ($("#chat_container").css("display") == "block")
                            $(container).css("left", $(window).width() / 2 - container.width() / 2);
                    });
                    var pressed_keys = [];
                    $(document).keyup(function (e) {
                        if ($("#chat_container").css("display") == "block")
                            if (e.keyCode == 27) {
                                $("#chat_container").hide();
                            }
                        if (pressed_keys[39] && pressed_keys[17] && pressed_keys[16]) {
                            $("#chat_container").show();
                            $(container).css("left", $(window).width() / 2 - container.width() / 2);
                        }
                        pressed_keys = [];

                    });




                    $(document).keydown(function (e) {

                        pressed_keys[e.keyCode] = true;

                    });

                    $(window).resize(function () {
                        if ($("#chat_container").css("display") == "block")
                            $(container).css("left", $(window).width() / 2 - container.width() / 2);
                    });



                    var AppEvents = _.extend({}, Backbone.Events);
                    ChatApplication.AppEvents = AppEvents;

                    var discussion_container = $(document.createElement("div"));
                    $(container).html(discussion_container);
                    ChatApplication.show_discussion = function (id) {
                        console.log("showing");
                        var discussion = new Discussion({ id:id });
                        console.log("name", discussion.get('name'));
                        var discussionView = new DiscussionView({ model:discussion });
                        discussionView.init(ChatApplication, AppEvents, current_user, websocket, function () {
                            discussion_container.html(discussionView.$el);
                        });
                    };
                    ChatApplication.show_discussion(0);


                    try {
                        Backbone.history.start()
                    } catch (err) {
                        Backbone.history.loadUrl()
                    }


                }
            )
            ;
        };


        return {
            initialize:initialize
        };

    }
)
;