define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Daily/Templates/planned_task.html',
    'Organization/Apps/Daily/Models/PlannedTask'
], function ($, _, Backbone, PlannedTaskTemplate, PlannedTask) {
    var PlannedTaskView = Backbone.View.extend({
        tagName: "div",
        className: "planned_task",
        initialize: function () {
            var base = this;

            base.moving = false;
            base.mouse_delta = 0;
            base.mousePreviousY = 0;
            base.planned_task = base.model;
        },
        init: function (SmartBlocks, DayPlanning) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.DayPlanning = DayPlanning;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(PlannedTaskTemplate, {
                task : base.planned_task.get("task")
            });

            base.$el.html(template);

            base.updatePosition();
        },
        updatePosition: function () {
            var base = this;
            base.$el.css("top", Math.round(base.DayPlanning.getStartPosition(base.planned_task.getStart())));
            base.$el.css("height", Math.round(base.DayPlanning.getHourHeight() / 2) - 14);
            console.log(base.planned_task.get("start"));
            console.log(new Date(base.planned_task.get("start")));
        },
        registerEvents: function () {
            var base = this;

            base.$el.click(function () {
                return false;
            });

            base.$el.find(".handle").mousedown(function (e) {
                $(document).disableSelection();
                base.DayPlanning.$el.unbind("click.create_task");
                base.moving = true;
                base.mouse_delta = 0;
                base.mousePreviousY = e.pageY;

                base.$el.parent().bind("mousemove.task", function (ee) {

                    var newY = base.$el.position().top + ee.pageY - base.mousePreviousY;
                    if (newY > 0 && newY < base.DayPlanning.getHourHeight() * 24 - base.$el.height()) {
                        base.$el.css("top", newY);
                        base.mousePreviousY = ee.pageY;
                        if ( - base.$el.position().top > base.$el.parent().position().top - 100) {
                            base.$el.parent().css("top", base.$el.parent().position().top - 20);
                            base.mousePreviousY = ee.pageY;
                            base.mouse_delta = 0;
                        }
                    }




                });
                base.DayPlanning.$el.bind("mouseup.droptask", function () {
                    $(document).enableSelection();
                    base.$el.parent().unbind("mousemove.task");
                    base.moving = false;
                    var newY = base.$el.position().top;
                    newY = newY - (newY % (base.DayPlanning.getHourHeight() / 2));
                    base.$el.css("top", newY);
                    console.log("BEFORE CHANGE", base.planned_task.getStart());
                    var start = base.planned_task.getStart();
                    start.setHours(Math.round(base.$el.position().top / base.DayPlanning.getHourHeight()));
                    start.setMinutes(Math.round((base.$el.position().top / base.DayPlanning.getHourHeight() % 1) * 60));
                    base.planned_task.set("start", start.getTime());
                    base.planned_task.save();
                    console.log("AFTER CHANGE", base.planned_task.getStart());
                    base.DayPlanning.$el.bind("click.create_task", function () {
                        base.DayPlanning.createTask();
                    });
                    base.DayPlanning.$el.unbind("mouseup.droptask");
                });
            });

            base.$el.resizable({
                grid : base.DayPlanning.getHourHeight() / 2,
                minWidth: 580,
                maxWidth: 580,
                resize: function(event, ui) {

                }
            });


        }
    });

    return PlannedTaskView;
});