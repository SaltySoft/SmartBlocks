define([
    'jquery',
    'underscore',
    'backbone',
    'text!Apps/Socials/Apps/Profile/Templates/profile.html'
], function ($, _, Backbone, ProfileTemplate) {
    var ProfileView = Backbone.View.extend({
        tagName: "div",
        className: "user_profile_app",
        initialize: function () {

        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
        },
        render: function () {
            var base = this;

            var template = _.template(ProfileTemplate, {});

            base.$el.html(template);
        },
        registerEvents: function () {

        }
    });

    return ProfileView;
});