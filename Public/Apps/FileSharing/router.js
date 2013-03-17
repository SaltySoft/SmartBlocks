define([
    'jquery',
    'underscore',
    'backbone',
    'FileSharing/Models/Folder',
    'FileSharing/Views/ChooseFileView',
    'FileSharing/Views/ChoosePeopleView',
    'FileSharing/Views/DragDropView',
    'FileSharing/Views/FolderView',
    'UserModel'
], function ($, _, Backbone, Folder, ChooseFileView, DragDropView, ChoosePeopleView, FolderView, User) {
    var AppRouter = Backbone.Router.extend({
        routes:{
            '':"home",
            "show_folder/:id":"show_folder"
        }
    });

    var initialize = function () {
        var base = this;
        User.getCurrent(function (current_user) {
            var App = {
                current_user:current_user
            };

            var choose_file_view = new ChooseFileView();
            choose_file_view.init(App);

            var drag_drop_view = new DragDropView();
            drag_drop_view.init(App);

            var choose_people_view = new ChoosePeopleView();
            choose_people_view.init(App);

            var folder_view = new FolderView();
            folder_view.init(App);

            App.choose_file_view = choose_file_view;
            App.drag_drop_view = drag_drop_view;
            App.choose_people_view = choose_people_view;
            App.folder_view = folder_view;


            var container = $(document.createElement("div"));
            container.addClass("k_file_sharing_main_container");
            App.$el = $("#file_sharing_container");
            $("#file_sharing_container").append(container);
            $("#file_sharing_button").click(function () {
                $("#file_sharing_container").toggle();
                if ($("#file_sharing_container").css("display") == "block")
                    $(container).css("left", $(window).width() / 2 - container.width() / 2);
            })



            $(window).resize(function () {
                if ($("#chat_container").css("display") == "block")
                    $(container).css("left", $(window).width() / 2 - container.width() / 2);
            });

            var AppEvents = _.extend({}, Backbone.Events);
            App.AppEvents = AppEvents;
        })
    };

    return {
        initialize:initialize
    };
});