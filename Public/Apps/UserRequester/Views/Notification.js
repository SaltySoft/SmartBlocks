define([
    'jquery',
    'underscore',
    'backbone',
    'text!Apps/UserRequester/Templates/notification.html'
], function ($, _, Backbone, NotificationTemplate) {
    var NotificationView = Backbone.View.extend({
        tagName: "div",
        className: 'user_request_notification',
        initialize: function () {

        },
        init: function (SmartBlocks, data) {
            var base = this;

            base.SmartBlocks = SmartBlocks;
            base.data = data;
            base.render();
        },
        render: function () {
            var base = this;

            $("body").append(base.$el);
            var template = _.template(NotificationTemplate, {
                text: base.data.notification_text
            });
            base.$el.html(template);
            base.registerEvents();
        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate(".answer_button", "click", function (e) {
                //create a form view with data
                console.log("Implement form view");
            });

            base.$el.delegate(".decline_button", "click", function (e) {
                base.$el.remove();
            });
        }

    });

    return NotificationView;
});