define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Daily/Templates/planned_task.html'
], function ($, _, Backbone, PlannedTaskTemplate) {
    var PlannedTaskView = Backbone.View.extend({
        tagName: "div",
        className: "planned_task",
        initialize: function () {
            var base = this;

            base.moving = false;
            base.mouse_delta = 0;
            base.mousePreviousY = 0;
        },
        init: function (SmartBlocks, DayPlanning, start, end, task) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.task = task;
            base.start = start;
            base.start.setMinutes(0);
            base.start.setSeconds(0);
            base.end = end;

            base.DayPlanning = DayPlanning;




            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(PlannedTaskTemplate, {});

            base.$el.html(template);

            base.updatePosition();
        },
        updatePosition: function () {
            var base = this;
            base.$el.css("top", Math.round(base.DayPlanning.getStartPosition(base.start)));


        },
        registerEvents: function () {
            var base = this;

            base.$el.click(function () {
                return false;
            });
            base.$el.css("height", Math.round(base.DayPlanning.getHourHeight()));
            base.$el.mousedown(function (e) {
                $(document).disableSelection();
                base.DayPlanning.$el.unbind("click.create_task");
                base.moving = true;
                base.mouse_delta = 0;
                base.mousePreviousY = e.pageY;

                base.$el.parent().bind("mousemove.task", function (ee) {

                    var newY = base.$el.position().top + ee.pageY - base.mousePreviousY;
                    if (newY > 0 && newY < base.DayPlanning.getHourHeight() * 24 - base.$el.height()) {
                        base.$el.css("top", newY);
                    }
                    if ( - base.$el.position().top > base.$el.parent().position().top - 100) {
                        base.$el.parent().css("top", base.$el.parent().position().top - 20);
                    }

                    base.mousePreviousY = ee.pageY;
                    base.mouse_delta = 0;
                });
                base.DayPlanning.$el.bind("mouseup.droptask", function () {
                    $(document).enableSelection();
                    base.$el.parent().unbind("mousemove.task");
                    base.moving = false;
                    var newY = base.$el.position().top;
                    newY = newY - (newY % (base.DayPlanning.getHourHeight() / 2));
                    base.$el.css("top", newY);
                    base.start.setHours(Math.round(base.$el.position().top / base.DayPlanning.getHourHeight()));
                    base.start.setMinutes(Math.round((base.$el.position().top / base.DayPlanning.getHourHeight() % 1) * 60));
                    console.log(base.start);
                    base.DayPlanning.$el.bind("click.create_task", function () {
                        base.DayPlanning.createTask();
                    });
                    base.DayPlanning.$el.unbind("mouseup.droptask");
                });
            });


        }
    });

    return PlannedTaskView;
});