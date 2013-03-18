define([
    'jquery',
    'underscore',
    'backbone',
    '/Apps/FileSharing/Views/MainView.js',

    'UserModel'
], function ($, _, Backbone, MainView, User) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': "home",
            "show_folder/:id": "show_folder"
        }
    });

    var initialize = function (SmartBlocks) {
        var base = this;
        User.getCurrent(function (current_user) {
            SmartBlocks.current_user = current_user;


            var container = $(document.createElement("div"));
            container.addClass("k_file_sharing_main_container");
//            App.$el = $("#file_sharing_container");


            $("#file_sharing_container").append(container);
            $("#file_sharing_button").click(function () {
                $("#file_sharing_container").toggle();
                if ($("#file_sharing_container").css("display") == "block")
                    $(container).css("left", $(window).width() / 2 - container.width() / 2);
            });

            var main_view = new MainView();
            main_view.init(SmartBlocks);
            container.append(main_view.$el);

            $(window).resize(function () {
                if ($("#chat_container").css("display") == "block")
                    $(container).css("left", $(window).width() / 2 - container.width() / 2);
            });

//            var AppEvents = _.extend({}, Backbone.Events);
//            App.AppEvents = AppEvents;
        })
    };

    return {
        initialize: initialize
    };
});