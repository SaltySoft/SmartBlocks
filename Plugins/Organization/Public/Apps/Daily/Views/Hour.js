define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Daily/Templates/hour.html'
], function ($, _, Backbone, HourTemplate) {
    var HourView = Backbone.View.extend({
        tagName: "div",
        className: "hour_view",
        initialize: function () {

        },
        init: function (SmartBlocks, time, dayPlanning) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.dayPlanning = dayPlanning;
            var time2 = new Date(time);
//            time2.setHours(time.getHours());
            base.time = time2;
            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(HourTemplate, {
                time: base.time
            });
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;

            base.$el.droppable({
                hoverClass: "ui-state-active",
                drop: function( event, ui ) {
                    var task = base.dayPlanning.planning.tasks_list.tasks_list.get(ui.draggable.attr("data-id"));
                    base.dayPlanning.createTask(task, base.time);

                }
            });
        }
    });

    return HourView;
});