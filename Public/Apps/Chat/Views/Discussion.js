define([
    'jquery',
    'underscore',
    'backbone',
    'text!Apps/Chat/Templates/discussion.html',
    'Apps/Chat/Models/Message',
    'text!Apps/Chat/Templates/message_template.html'
], function ($, _, Backbone, DiscussionTemplate, Message, MessageTemplate) {
    var DiscussionView = Backbone.View.extend({
        tagName: "li",
        className: "chat_discussion_view",
        initialize: function () {
            var base = this;
            base.discussion = base.model;
        },
        init: function (SmartBlocks, main_view) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.main_view = main_view;
            console.log("main view", main_view);

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(DiscussionTemplate, {});
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;

            base.$el.find(".discussion_button").click(function () {
                base.$el.find(".discussion").toggle();
            });

            base.$el.find(".remove_button").click(function () {
                base.$el.remove();
            });

            base.$el.find(".discussion_input").keyup(function (e) {
                var elt = $(this);
                if (e.keyCode == 13) {
                    var part = [];
                    var part_list = base.discussion.get("participants");
                    for (var k in part_list) {
                        part.push(part_list[k].get("session_id"));
                    }

                    var message = new Message();
                    message.set("discussion_id", base.discussion.get("id"));
                    message.set("content", elt.val());
                    message.save();
                    base.SmartBlocks.sendWs("chat", {
                        content: elt.val(),
                        discussion_id: base.discussion.get('id'),
                        sender: base.SmartBlocks.current_user.attributes
                    }, part);
                    console.log(message);
                    elt.val("");
                }
            });

            base.main_view.events.on("message", function (message) {
                if (message.app == "chat") {
                    if (message.content) {
                        if (message.discussion_id == base.discussion.get('id')) {
                            var template = _.template(MessageTemplate, {
                                message: message,
                                sender: message.sender
                            });
                            base.$el.find(".messages_list").append(template);
                        }
                    }
                }
            });
        }
    });

    return DiscussionView;
});