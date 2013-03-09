define([
    'jquery',
    'underscore',
    'backbone',
    'SmartBlocks'
], function ($, _, Backbone, SmartBlock) {
    var HomeView = Backbone.View.extend({
        tagName: "div",
        className: "k_chat_home",
        initialize: function () {

        },
        init: function (AppEvents) {
            this.AppEvents = AppEvents;
            this.render();
        },
        render: function () {
            this.$el.html("Chat Home View");
        }
    });

    return HomeView;
});