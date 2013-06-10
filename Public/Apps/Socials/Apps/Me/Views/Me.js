define([
    'jquery',
    'underscore',
    'backbone',
    'text!Apps/Socials/Apps/Me/Templates/me.html',
    'UserModel'
], function ($, _, Backbone, MeTemplate, User) {
    var MeView = Backbone.View.extend({
        tagName: "div",
        className: "me_view_app",
        initialize: function () {

        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
        },
        fetchUser: function () {
            var base = this;
            User.getCurrent(function (current_user) {
                base.user = current_user;
                base.render();
            });
        },
        render: function () {
            var base = this;
            var template = _.template(MeTemplate, {user: base.user});
            base.$el.html(template);

        },
        registerEvents: function () {

        }
    });

    return MeView;
});