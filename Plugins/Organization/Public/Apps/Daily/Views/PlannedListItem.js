define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Daily/Templates/planned_list_item.html'
], function ($, _, Backbone, PlannedItemTemplate) {
    var PlannedList = Backbone.View.extend({
        tagName: "li",
        className: "planned_list_item",
        initialize: function (planned_task) {
            var base = this;
            base.planned_task = planned_task;
            base.model = planned_task;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(PlannedItemTemplate, {
                planned_task: base.model
            });
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return PlannedList;
});