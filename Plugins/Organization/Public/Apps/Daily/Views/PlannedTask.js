define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Daily/Templates/planned_task.html',
    'Organization/Apps/Daily/Models/PlannedTask',
    'ContextMenuView'
], function ($, _, Backbone, PlannedTaskTemplate, PlannedTask, ContextMenu) {

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
        init: function (SmartBlocks, DayPlanning, planning) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.DayPlanning = DayPlanning;
            base.planning = planning;
            base.render();
            base.registerEvents();
            base.planning.events.trigger("planning_modified");
        },
        render: function () {
            var base = this;

            var template = _.template(PlannedTaskTemplate, {
                task : base.planned_task.get("task")
            });

            base.$el.html(template);

            base.updatePosition();

//

        },
        updatePosition: function () {
            var base = this;
            base.$el.css("top", Math.round(base.DayPlanning.getStartPosition(base.planned_task.getStart())));
            base.$el.css("height", base.planned_task.get("duration") / 60 / 60 / 1000 * base.DayPlanning.getHourHeight());
            console.log(base.planned_task.get("start"));
            console.log(new Date(base.planned_task.get("start")));
        },
        registerEvents: function () {
            var base = this;
            base.$el.attr("oncontextmenu", "return false;");
            base.$el.mousedown(function (e) {
                if (e.which == 3) {
                    var context_menu = new ContextMenu();
                    context_menu.addButton("Delete", function () {
                        base.planned_task.destroy({
                            success: function () {
                                base.$el.remove();
                                base.planning.events.trigger("planning_modified");
                            }
                        });

                    });
                    context_menu.show(e);
                    return false;
                }

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
//                        if ( - base.$el.position().top > base.$el.parent().position().top - 100) {
//                            base.$el.parent().css("top", base.$el.parent().position().top - 20);
//                            base.mousePreviousY = ee.pageY;
//                            base.mouse_delta = 0;
//                        }
                    }




                });
                base.DayPlanning.$el.bind("mouseup.droptask", function () {
                    $(document).enableSelection();
                    base.$el.parent().unbind("mousemove.task");
                    base.moving = false;
                    var newY = base.$el.position().top;
                    newY = newY - (newY % (base.DayPlanning.getHourHeight() / 2));
                    base.$el.css("top", newY);
                    var start = base.planned_task.getStart();
                    start.setHours(Math.round(base.$el.position().top / base.DayPlanning.getHourHeight()));
                    start.setMinutes(Math.round((base.$el.position().top / base.DayPlanning.getHourHeight() % 1) * 60));
                    base.planned_task.set("start", start.getTime());
                    base.planned_task.save();
                    base.DayPlanning.$el.bind("click.create_task", function () {
                        base.DayPlanning.createTask();
                    });
                    base.DayPlanning.$el.unbind("mouseup.droptask");
                });
            });

            base.$el.resizable({
                grid : base.DayPlanning.getHourHeight() / 2,
                handles: 'n, s',
                stop: function(event, ui) {
                    var duration = (ui.size.height) / base.DayPlanning.getHourHeight();
                    duration *= 60 * 60 * 1000;
                    base.planned_task.set("duration", duration);
                    console.log(duration);
                    base.planned_task.save();
                }
            });


            base.planning.events.on("deleted_task", function (id) {
                if (base.planned_task.get("task").id == id) {
                    base.$el.remove();
                }
            });

            base.$el.mouseover(function () {
                base.planning.events.trigger("over_task", base.planned_task.get("task").id);
            });

            base.planning.events.on("over_task", function (id) {
                if (base.planned_task.get("task").id == id)
                    base.$el.addClass("over");
                else
                    base.$el.removeClass("over");
            });

            base.SmartBlocks.events.on("ws_notification", function (message) {
                if (message.app == "organizer") {
                    if (message.action == "task_saved") {
                        var date = new Date(message.task.due_date * 1000);

                        base.model.fetch({
                            success: function () {
                                base.render();
                            }
                        });

                        if (Math.abs(date.getTime() - base.planning.current_date.getTime()) > 24 * 3600 * 1000) {
                            base.$el.remove();
                            base.model.destroy();
                        }

                    }
                }
            });

        }
    });

    return PlannedTaskView;
});