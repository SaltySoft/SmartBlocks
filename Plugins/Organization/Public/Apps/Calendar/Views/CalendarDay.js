define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Calendar/Templates/calendar_day.html',
    'text!Organization/Apps/Calendar/Templates/task_slot.html',
    'Organization/Apps/Common/Views/TaskPopup',
    'Organization/Apps/Tasks/Models/Task'
], function ($, _, Backbone, CalendarDayTemplate, TaskSlotTemplate, TaskPopup, Task) {
    var CalendarDayView = Backbone.View.extend({
        tagName: "div",
        className: "box day",
        initialize: function () {
            var base = this;
            base.active = true;
        },
        init: function (SmartBlocks, calendar, date) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.calendar = calendar;
            base.date = new Date(date);
            base.tasks = [];
            base.render();

        },
        setDate: function (date) {
            var base = this;
            base.date.setDate(date);
            base.$el.find(".day_number").html(base.date.getDate());
        },
        render: function () {
            var base = this;
            var template = _.template(CalendarDayTemplate, {});

            base.$el.html(template);
            base.registerEvents();
        },
        setDay: function (day) {
            var base = this;
        },
        addTask: function (task) {
            var base = this;
            var div = $(document.createElement("li"));
            div.html(_.template(TaskSlotTemplate, { task: task, index: base.tasks.length }));

            div.attr("data-index", base.tasks.length);
            div.attr("data-id", task.get('id'));
            var now = new Date();
            var late_date = new Date(task.getDueDate());
            if (task.get("completion_date") != null) {
                div.find(".task_container").addClass("done");
            }
            if (task.getDueDate().getDate() < now.getDate() && task.getDueDate().getFullYear() <= now.getFullYear() && task.getDueDate().getMonth() <= now.getMonth() ||
                task.getDueDate().getFullYear() <= now.getFullYear() && task.getDueDate().getMonth() < now.getMonth() ||
                task.getDueDate().getFullYear() < now.getFullYear()) {
                div.find(".task_container").addClass("late");
            }
            div.draggable({
                revert: "invalid",
                distance: 30
            });

            base.$el.find(".tasks").append(div);

            base.tasks.push(task);
        },
        expand: function (e) {
            var base = this;
            if (base.active) {
                var elt = base.$el;
                if (!elt.hasClass("expanded")) {
                    for (var k in base.calendar.days) {
                        base.calendar.days[k].retract();
                    }
                    elt.addClass("expanded");

                    console.log(base.date);
                    base.$el.unbind("click.open");
                }
            }
        },
        retract: function () {
            var base = this;
            base.$el.removeClass("expanded");
            base.$el.bind("click.open", $.proxy(base.expand, base));
        },
        addNewTask: function () {
            var base = this;
            var task = new Task();
            task.set("due_date", base.date.getTime() / 1000);

            var task_popup = new TaskPopup(task);
            task_popup.init(base.SmartBlocks);
            task_popup.events.on("task_updated", function (task) {
                base.addTask(task);
            });

        },
        registerEvents: function () {
            var base = this;
            base.$el.bind("click.open", $.proxy(base.expand, base));

            base.$el.delegate(".close_button", "click", $.proxy(base.retract, base));

            base.$el.delegate(".task_name a", "click", function () {
                if (base.active) {
                    var elt = $(this).parent();
                    var task_elt = elt.closest(".task");
                    console.log(task_elt);
                    var task = base.tasks[task_elt.attr("data-index")];
                    var popup = new TaskPopup(task);
                    popup.init(base.SmartBlocks);
                    popup.events.on("task_updated", function () {
                        task_elt.find(".task_name").html(task.get("name"));
                    });
                }

            });

            base.$el.delegate(".finished_button", "click", function () {
                if (base.active) {
                    var elt = $(this);
                    var task_elt = elt.closest(".task");
                    var task = base.tasks[task_elt.attr("data-index")];
                    task_elt.addClass("done");
                    task.set("completion_date", new Date().getTime() / 1000);
                    task.save({}, {
                        success: function () {
                            base.SmartBlocks.show_message("Task succesfully saved");
                        }
                    });
                }

            });

            base.$el.delegate(".cancel_finish_button", "click", function () {
                if (base.active) {
                    var elt = $(this);
                    var task_elt = elt.closest(".task");
                    var task = base.tasks[task_elt.attr("data-index")];
                    task.set("completion_date", null);
                    task_elt.removeClass("done");
                    task.save({}, {
                        success: function () {
                            base.SmartBlocks.show_message("Task successfully replanned");
                        }
                    });
                }

            });

            base.$el.delegate(".add_button", "click", function () {
                base.addNewTask();
            });

            base.$el.find(".tasks").droppable({
                drop: function (event, ui) {
                    console.log(ui.draggable);
                    var task = new Task({ id: ui.draggable.attr("data-id") });
                    ui.draggable.remove();
                    base.SmartBlocks.startLoading("Updating task date...");
                    task.fetch({
                        success: function () {
                            task.set("due_date", base.date.getTime() / 1000);
                            base.addTask(task);
                            task.save({}, {
                                success: function () {
                                    base.SmartBlocks.stopLoading();
                                }
                            });
                        }
                    });
                }
            });
        },
        setInactive: function () {
            var base = this;
            base.active = false;
            base.$el.addClass("inactive");
        },
        setCurrentDay: function () {
            var base = this;
            base.$el.addClass("current_day");
        }
    });

    return CalendarDayView;
});