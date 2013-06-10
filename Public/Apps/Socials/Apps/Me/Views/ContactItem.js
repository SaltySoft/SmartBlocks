define([
    'jquery',
    'underscore',
    'backbone',
    'text!Apps/Socials/Apps/Me/Templates/contact_item.html'
], function ($, _, Backbone, ContactItem) {
    var ContactListItemView = Backbone.View.extend({
        tagName: "li",
        className: "contact_list_item",
        initialize: function () {
            var base = this;
            base.user = base.model;
        },
        init: function (SmartBlocks, request) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.request = request;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(ContactItem, {
                user: base.user
            });

            base.$el.html(template);

        },
        registerEvents: function () {
            var base = this;
            if (base.SmartBlocks.connected_users.get(base.user.get("id")))
            {
                base.$el.find(".online").addClass("true");
            }

            base.SmartBlocks.connected_users.on("change", function () {
                if (base.SmartBlocks.connected_users.get(base.user.get("id")))
                {
                    base.$el.find(".online").addClass("true");
                }
                else
                {
                    base.$el.find(".online").removeClass("true");
                }
            });

            if (base.request) {
                base.$el.delegate(".add_button", "click", function () {

//                    base.SmartBlocks.current_user
                });
            }
        }
    });

    return ContactListItemView;
});