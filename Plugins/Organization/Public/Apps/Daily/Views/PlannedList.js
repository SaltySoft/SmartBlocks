define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Daily/Templates/planned_list.html'
], function ($, _, Backbone, PlannedListTemplate) {
    var PlannedList = Backbone.View.extend({
        tagName: "ul",
        className: "planned_list",
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
            var template = _.template(PlannedListTemplate, {});

            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return PlannedList;
});