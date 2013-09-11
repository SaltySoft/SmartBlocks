define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Daily/Templates/hour.html',
    'Organization/Apps/Daily/Models/PlannedTask'
], function ($, _, Backbone, HourTemplate, PlannedTask) {
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
            if (time2.getHours() < 7 || time2.getHours() > 20) {
                base.$el.addClass("night");
            }
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

//            base.$el.droppable({
//                hoverClass: "ui-state-active",
//                drop: function (event, ui) {
//                    var task = base.dayPlanning.planning.tasks_list.tasks_list.get(ui.draggable.attr("data-id"));
//                    base.dayPlanning.createTask(task, base.time);
//
//                }
//            });

//            base.$el.attr("oncontextmenu", "return false;");
            base.$el.mousedown(function (e) {
                if (e.which == 1) {
                    var planned_task = new PlannedTask({
//                        content: "New planned task",
                        start: base.time.getTime(),
                        duration: 3600000
                    });
                    var planned_view = base.dayPlanning.addPlannedTask(planned_task);
                    planned_view.showPopup();
                }
                return false;
            });
        }
    });

    return HourView;
});