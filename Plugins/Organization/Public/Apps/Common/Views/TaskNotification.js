define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var TaskNotification = Backbone.View.extend({
        tagName :"li",
        className : "task_notification",
        initialize: function () {

        },
        init: function (SmartBlocks) {
            var base = this;
            base.Smartblocks = SmartBlocks;
            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;


        },
        registerEvents: function () {

        }

    });

    return TaskNotification;
});