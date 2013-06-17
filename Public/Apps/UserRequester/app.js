define([
    'jquery',
    'underscore',
    'backbone',
    'Apps/UserRequester/Views/Notification'
], function ($, _, Backbone, NotificationView) {
    var initialize = function (SmartBlocks) {
        SmartBlocks.events.on("ws_notification", function (message) {
            if (message.app == "user_requester") {
                var notification = new NotificationView();
                notification.init(SmartBlocks, message.data);
            }
        });
    };

    return {
        initialize: initialize
    };
});