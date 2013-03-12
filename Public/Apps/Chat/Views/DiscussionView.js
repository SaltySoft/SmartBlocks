define([
    'jquery',
    'underscore',
    'backbone',
    'SmartBlocks',
    'Chat/Models/Discussion',
    'Chat/Models/Message',
    'text!Chat/Templates/discussion_view.html',
    'text!Chat/Templates/message_list.html',
    'Chat/Collections/Discussions'
], function ($, _, Backbone, SmartBlocks, Discussion, Message, DiscussionTemplate, MessageListTemplate, DiscussionsCollection) {
    var DiscussionView = Backbone.View.extend({
        tagName:"div",
        className:"k_discussion_view",
        events:{
            "click .k_chat_send_message_button":"sendMessage"
        },
        initialize:function () {

        },
        init:function (ChatApplication, AppEvents, current_user, websocket, callback) {
            var base = this;
            base.app = ChatApplication;
            this.current_user = current_user;
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

            base.discussions = new DiscussionsCollection();

            base.discussions.fetch({
                data:{
                    user_id:base.app.current_user.get('id')
                },
                success:function () {
                    base.render(callback);
                }
            });
        },
        render:function (callback) {
            var base = this;
            this.$el.html("Discussion");

            base.model.fetch({
                success:function () {
                    var template = _.template(DiscussionTemplate, {
                        discussion:base.model,
                        current_user:base.current_user,
                        available_discussions:base.discussions.models
                    });
                    base.$el.html(template);




                    base.initializeEvents();

                    callback();
                    if (base.model.get('id') == 0)
                    {
                        $(".k_chat_send_message_input").attr("disabled", true);
                        $(".k_chat_send_message_button").attr("disabled", true);
                        base.$el.find(".k_chat_messages_list").html('<div style="color: white; width: 200px; margin: auto; text-align: center; margin-top: 50px;">Select a discussion on the left.</div>');
                    }
                    else {
                        base.getMessage();
                    }
                }
            });



            return this;
        },
        initializeEvents:function () {
            var base = this;
            base.$el.find(".k_chat_discussion_selector_link").click(function () {
                $(".k_chat_messages_list").html('<div style="text-align: center; margin-top: 200px; color: white"><img src="/images/loader.gif" /><br/>Loading...</div>');
                var elt = $(this);
                var id = elt.attr("data-id");
                base.app.show_discussion(id);
            });
            base.$el.find(".k_chat_send_message_input").keyup(function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code == 13) { //Enter keycode
                    base.sendMessage();
                    base.$el.find(".k_chat_send_message_input").val("");
                }
            });
        },
        getMessage:function () {
            var base = this;

            base.model.fetch({
                success:function () {
                    console.log(base.model);
                    var template = _.template(MessageListTemplate, { discussion:base.model, current_user:base.current_user });
                    base.$el.find(".k_chat_messages_list").html(template);
                    base.$el.find(".k_chat_messages_list").scrollTop(base.$el.find(".k_chat_messages_list")[0].scrollHeight);
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
                    success:function () {
                        console.log("message sent");
                        base.$el.find(".k_chat_send_message_input").val("");
                    }
                });
            }

        }
    });

    return DiscussionView;
});