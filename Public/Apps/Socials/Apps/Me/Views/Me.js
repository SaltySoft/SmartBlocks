define([
    'jquery',
    'underscore',
    'backbone',
    'text!Apps/Socials/Apps/Me/Templates/me.html',
    'Apps/Socials/Apps/Me/Views/ContactList',
    'UserModel'
], function ($, _, Backbone, MeTemplate, ContactListView, User) {
    var MeView = Backbone.View.extend({
        tagName: "div",
        className: "me_view_app",
        initialize: function () {

        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

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
        },
        registerEvents: function () {

        }
    });

    return MeView;
});