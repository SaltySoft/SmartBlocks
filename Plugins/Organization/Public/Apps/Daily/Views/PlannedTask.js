define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Daily/Templates/planned_task.html',
    'Organization/Apps/Daily/Models/PlannedTask',
    'ContextMenuView',
    'Organization/Apps/Daily/Views/PlannedTaskPopup'
], function ($, _, Backbone, PlannedTaskTemplate, PlannedTask, ContextMenu, PlannedTaskPopup) {

    var PlannedTaskView = Backbone.View.extend({
        tagName: "div",
        className: "planned_task",
        initialize: function () {
            var base = this;

            base.moving = false;
            base.mouse_delta = 0;
            base.mousePreviousY = 0;
            base.planned_task = base.model;
            base.events = $.extend({}, Backbone.Events);
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
                planned_task : base.planned_task
            });

            base.$el.html(template);

            base.update();

//

        },
        update: function () {
            var base = this;
            base.updatePosition();
            base.$el.find(".name").html(base.planned_task.get("content"));
            var date = base.planned_task.getStart();
            base.$el.find(".start_time").html(date.getHours() + ":" + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes());
            base.$el.find(".linked_task").html((base.planned_task.get("task")) ? "Deadline : " + base.planned_task.get("task").get("name") : "Not linked with a deadline");
        },
        updatePosition: function () {
            var base = this;
            base.$el.css("top", Math.round(base.DayPlanning.getStartPosition(base.planned_task.getStart())));
            base.$el.css("height", base.planned_task.get("duration") / 60 / 60 / 1000 * base.DayPlanning.getHourHeight());
//            console.log(base.planned_task.get("start"));
//            console.log(new Date(base.planned_task.get("start")));
        },
        showPopup: function () {
            var base = this;
            base.planning.events.trigger("planned_task_popsremove");
            var popup = new PlannedTaskPopup();
            popup.init(base.SmartBlocks, base);

        },
        registerEvents: function () {
            var base = this;
            base.$el.attr("oncontextmenu", "return false;");
            base.$el.mousedown(function (e) {
                if (e.which == 3) {
                    var context_menu = new ContextMenu();
                    context_menu.addButton("Edit", function () {
                       base.showPopup();
                    });
                    context_menu.addButton("Delete", function () {
                        base.planned_task.destroy({
                            success: function () {
                                base.$el.remove();
                                base.planning.events.trigger("planning_modified");
                            }
                        });

                    });

                    context_menu.show(e);
//                    return false;
                }
//
//                return false;
            });



            base.$el.find(".handle").mousedown(function (e) {
                $(document).disableSelection();
                e.stopPropagation();
                base.DayPlanning.$el.unbind("click.create_task");
                base.moving = true;
                base.mouse_delta = 0;
                base.mousePreviousY = e.pageY;

                base.$el.parent().bind("mousemove.task", function (ee) {

                    var newY = base.$el.position().top + ee.pageY - base.mousePreviousY;
                    if (newY > 0 && newY < base.DayPlanning.getHourHeight() * 24 - base.$el.height()) {
                        base.$el.css("top", newY);
                        base.mousePreviousY = ee.pageY;
                    }
                    base.events.trigger("moving", base.$el);
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
                    base.planned_task.save({}, {

                    });
                    base.DayPlanning.$el.bind("click.create_task", function () {
                        base.DayPlanning.createTask();
                    });
                    base.DayPlanning.$el.unbind("mouseup.droptask");
                    base.update();
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

            base.$el.droppable({
                drop: function (event, ui) {
                    var task = base.planning.tasks_list.tasks_list.get(ui.draggable.attr("data-id"));
                    base.planned_task.set("task", task);
                    base.planned_task.save({}, {
                        success: function () {
                            base.update();
                        }
                    });
                }
            });


            base.planning.events.on("deleted_task", function (id) {

                if (base.planned_task.get("task") && base.planned_task.get("task").id == id) {
                    base.$el.remove();
                }
            });

            base.$el.mouseover(function () {
                if (base.planned_task.get("task")) {
                    base.planning.events.trigger("over_task", base.planned_task.get("task").id);
                }
            });

            base.planning.events.on("over_task", function (id) {
                if (base.planned_task.get("task") && base.planned_task.get("task").id == id)
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

                    }
                }
            });

        }
    });

    return PlannedTaskView;
});