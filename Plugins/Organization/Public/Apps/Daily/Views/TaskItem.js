define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Daily/Templates/task_item.html',
    'ContextMenuView',
    'Organization/Apps/Common/Views/TaskPopup',
    'underscore_string'
], function ($, _, Backbone, TaskItemTemplate, ContextMenu, TaskPopup, _s) {
    var TaskItemView = Backbone.View.extend({
        tagName: "li",
        className: "task_item",
        initialize: function () {
            var base = this;
            base.task = base.model;
        },
        init: function (SmartBlocks, planning) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.planning = planning;
            base.$el.attr("data-id", base.task.get('id'));
            base.render();
            setInterval(function () {
                base.render();

            }, 500);
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(TaskItemTemplate, { task: base.task, _s: _s });
            base.$el.html(template);
            var now = new Date();
            var date = base.task.getDueDate();
            if (date < now) {
                base.$el.addClass("overdue");

                var display = "Overdue by ";
                var milliseconds = now.getTime() - date.getTime();

                var days = milliseconds / ( 24 * 3600 * 1000);
                if (days >= 1) {
                    display += Math.floor(days) + "d ";
                }

                var hours = (days - Math.floor(days)) * 24;
                if (hours >= 1 && days <= 3)
                    display += Math.floor(hours) + " h ";

                var minutes = (hours - Math.floor(hours)) * 60;
                if (milliseconds < 1000 * 3600 * 24 && milliseconds > 60000)
                    display += Math.floor(minutes) + " m ";

                var seconds = (minutes - Math.floor(minutes)) * 60;
                if (milliseconds < 1000 * 3600 * 0.5 && milliseconds < 60000) {
                    display += Math.floor(seconds) + " s ";
                }

            } else {
                base.$el.removeClass("overdue");

                var display = "Due in ";
                var milliseconds = date.getTime() - now.getTime();

                var days = milliseconds / ( 24 * 3600 * 1000);
                if (days >= 1) {
                    display += Math.floor(days) + "d ";
                }

                var hours = (days - Math.floor(days)) * 24;
                if (hours >= 1 && days <= 3)
                    display += Math.floor(hours) + " h ";

                var minutes = (hours - Math.floor(hours)) * 60;
                if (milliseconds < 1000 * 3600 * 24)
                    display += Math.floor(minutes) + " m ";

                var seconds = (minutes - Math.floor(minutes)) * 60;
                if (milliseconds < 1000 * 3600 * 5) {
                    display += Math.floor(seconds) + " s ";
                }
            }

            base.$el.find(".ti_due_on").html(display);
        },
        registerEvents: function () {
            var base = this;

            base.$el.draggable({
                revert: true
            });

            base.$el.attr("oncontextmenu", "return false;");
            base.$el.mousedown(function (e) {
                var id = base.task.get("id");
                if (e.which == 3) {
                    var context_menu = new ContextMenu();
                    context_menu.addButton("Edit this task", function () {
                        var task_popup = new TaskPopup(base.task);
                        task_popup.init(base.SmartBlocks);
                    });
                    context_menu.addButton("Delete this task", function () {
                        base.task.destroy({
                            success: function () {
                                if (base.planning)
                                    base.planning.events.trigger("deleted_task", id);
                                base.$el.remove();
                                base.SmartBlocks.events.trigger("org.task_modified", base.task);
                            }
                        });

                    });
                    context_menu.show(e);
                    return false;
                }

                return false;
            });

            base.$el.mouseover(function () {
                if (base.planning)
                    base.planning.events.trigger("over_task", base.task.id);
            });
            if (base.planning)
                base.planning.events.on("over_task", function (id) {
                    if (base.task.id == id)
                        base.$el.addClass("over");
                    else
                        base.$el.removeClass("over");
                });


        }
    });

    return TaskItemView;
});