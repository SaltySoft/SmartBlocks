define([
    'jquery',
    'underscore',
    'backbone',
    'text!Apps/Socials/Apps/Me/Templates/me.html',
    'Apps/Socials/Apps/Me/Views/ContactList',
    'UserModel',
    'UsersCollection',
    'Apps/Socials/Apps/Me/Views/UserSearch',
    'Apps/Socials/Apps/Me/Views/ContactRequestsList'
], function ($, _, Backbone, MeTemplate, ContactListView, User, UsersCollection, UserSearchView, ContactRequestsList) {
    var MeView = Backbone.View.extend({
        tagName: "div",
        className: "me_view_app",
        initialize: function () {

        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.user_search_res = new UsersCollection();

            base.fetchUser();
        },
        fetchUser: function () {
            var base = this;
            User.getCurrent(function (current_user) {
                base.user = current_user;
                base.render();
                base.renderList();
            });
        },
        render: function () {
            var base = this;
            var template = _.template(MeTemplate, {user: base.user});
            base.$el.html(template);

        },
        renderList: function () {
            var base = this;

            var list = new ContactListView({
                model: base.user
            });
            list.init(base.SmartBlocks);
            base.$el.find(".contact_list_container").html(list.$el);


            var user_search = new UserSearchView();
            user_search.init(base.SmartBlocks);
            base.$el.find(".user_search_container").html(user_search.$el);

            var contact_request_list = new ContactRequestsList();
            contact_request_list.init(base.SmartBlocks);
            base.$el.find(".contact_requests_list_container").html(contact_request_list.$el);
        },
        registerEvents: function () {
            var base = this;

        }
    });

    return MeView;
});