define([
    'jquery',
    'underscore',
    'backbone',
    'UsersCollection',
    'Apps/Socials/Apps/Me/Views/ContactItem'
], function ($, _, Backbone, UsersCollection, ContactItem){
    var UserSearchView = Backbone.View.extend({
        tagName: "div",
        className: "user_search_view",
        initialize: function () {

        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.user_search_res = new UsersCollection();

            base.render();
        },
        render: function () {
            var base = this;


        },
        registerEvents: function () {

        }
    });

    return UserSearchView;
});