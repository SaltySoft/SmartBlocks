define([
    'jquery',
    'underscore',
    'backbone',
    'SmartBlocks',
    'text!Templates/chat_home.html'
], function ($, _, Backbone, SmartBlock, HomeTemplate) {
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
            var template = _.template(HomeTemplate, {});

            this.$el.html(template);
        }
    });

    return HomeView;
});