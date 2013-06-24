define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var PlannedList = Backbone.View.extend({
        tagName: "li",
        className: "planned_list_item",
        initialize: function () {

        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

        },
        registerEvents: function () {
            var base = this;
        }
    });

    return PlannedList;
});