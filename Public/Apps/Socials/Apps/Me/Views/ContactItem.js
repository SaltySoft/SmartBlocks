define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var ContactListItemView = Backbone.View.extend({
        tagName: "li",
        className: "contact_list_item",
        initialize: function () {

        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
        },
        render: function () {
            var base = this;
        },
        registerEvents: function () {

        }
    });

    return ContactListItemView;
});