define([
    'jquery',
    'underscore',
    'backbone',
    'SmartBlocks',
    'Chat/Collections/Discussions',
    'text!Chat/Templates/chat_home.html'
], function ($, _, Backbone, SmartBlock, DiscussionsCollection, HomeTemplate) {
    var HomeView = Backbone.View.extend({
        tagName:"div",
        className:"k_chat_home",
        initialize:function () {

        },
        init:function (ChatApplication) {
            var base = this;
            base.app = ChatApplication;
            base.AppEvents = ChatApplication.AppEvents;
            base.discussions = new DiscussionsCollection();

            base.discussions.fetch({
                data: {
                    user_id: base.app.current_user.get('id')
                },
                success:function () {
                    base.render();
                    base.initializeEvents();
                }
            });

        },
        initializeEvents:function () {
            console.log("init events for home view");
            var base = this;
            $(".k_chat_discussion_selector").click(function () {
                var elt = $(this);
                var id = elt.attr("data-id");
                alert(id);
                base.app.show_discussion(id);
            });
        },
        render:function () {
            var base = this;
            var template = _.template(HomeTemplate, { discussions:base.discussions.models });

            this.$el.html(template);
        }
    });

    return HomeView;
});