define([
    'jquery',
    'underscore',
    'backbone',
    'SmartBlocks',
    'Models/Discussion',
    'Models/Message',
    'text!Templates/discussion_view.html',
    'text!Templates/message_list.html'
], function ($, _, Backbone, SmartBlocks, Discussion, Message, DiscussionTemplate, MessageListTemplate) {
    var DiscussionView = Backbone.View.extend({
        tagName:"div",
        className:"k_discussion_view",
        events:{
            "click .k_chat_send_message_button":"sendMessage"
        },
        initialize:function () {

        },
        init:function (AppEvents, websocket) {
            var base = this;
            this.AppEvents = AppEvents;
            this.websocket = websocket;
            this.websocket.onopen = function () {

            }

            base.websocket.onmessage = function (data) {

                var message = SmartBlocks.parseWs(data);
                if (message.app == "k_chat") {
                    base.getMessage();
                }
            }

            this.render();
        },
        render:function () {
            var base = this;
            this.$el.html("Discussion");
            base.model.fetch({
                success:function () {
                    var template = _.template(DiscussionTemplate, { discussion:base.model });
                    base.$el.html(template);
                    base.getMessage();
                }
            });


            return this;
        },
        getMessage:function () {
            var base = this;
            base.model.fetch({
                success:function () {
                    console.log(base.model);
                    var template = _.template(MessageListTemplate, { discussion:base.model });
                    base.$el.find(".k_chat_messages_list").html(template);
                    base.$el.find(".k_chat_messages_list").scrollTop( base.$el.find(".k_chat_messages_list")[0].scrollHeight);
                }
            });
        },
        sendMessage:function () {
            var base = this;
            var message_val = base.$el.find(".k_chat_send_message_input").val();

            if (message_val != "") {
                var message = new Message({
                    content:message_val,
                    discussion_id:base.model.get('id')
                });
                message.save({}, {
                    success: function () {
                        console.log("message sent");
                        base.$el.find(".k_chat_send_message_input").val("");
                    }
                });
            }

        }
    });

    return DiscussionView;
});