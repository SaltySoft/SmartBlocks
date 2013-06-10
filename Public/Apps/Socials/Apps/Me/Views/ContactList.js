define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var ContactListView = Backbone.View.extend({
        tagName: "ul",
        className: "contact_list_view",
        initialize: function () {

        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
        },
        render: function () {

        },
        registerEvents: function () {

        }
    });

    return ContactListView;
});