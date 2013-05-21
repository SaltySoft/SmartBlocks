define([
    'jquery',
    'underscore',
    'backbone',
    'text!'
], function ($, _, Backbone) {
    var TasksNotificationsWindow = Backbone.View.extend({
        tagName: "div",
        className: "cache tasks_notifs_window",
        initialize: function () {

        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.render();
            base.registerEvents();
        },
        render: function () {

        },
        registerEvents: function () {

        }
    });

    return TasksNotificationsWindow;
});