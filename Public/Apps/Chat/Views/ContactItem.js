define([
    'jquery',
    'underscore',
    'backbone',
    'text!Apps/Chat/Templates/contact_item.html'
], function ($, _, Backbone, ContactItemTemplate) {
    var ContactItem = Backbone.View.extend({
        tagName: "li",
        className: "chat_contact_item",
        initialize: function () {
            var base = this;
            base.user = base.model;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(ContactItemTemplate, {
                user: base.user
            });

            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;


        }
    });

    return ContactItem;
});