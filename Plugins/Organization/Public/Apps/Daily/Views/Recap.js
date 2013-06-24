define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var RecapView = Backbone.View.extend({
        tagName: "div",
        className: 'organization_recap_view',
        initialize: function () {

        },
        init: function (SmartBlocks) {
            var base = this;

            base.SmartBlocks = SmartBlocks;

            base.render();
            base.registerEvents();
        },
        render: function () {

        },
        registerEvents: function () {

        }
    });

    return RecapView;
});