define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Common/Templates/task_item.html',
    'underscore_string',
    'ContextMenuView'
], function ($, _, Backbone, TaskItemTemplate, _s, ContextMenu) {
    var DeadlineItemView = Backbone.View.extend({
        tagName: "li",
        className: "task_list_item",
        initialize: function (model) {
            var base = this;
            base.task = model;
        },
        init: function (SmartBlocks, item_click_handler) {
            var base = this;

            base.SmartBlocks = SmartBlocks;
            base.item_click_handler = item_click_handler;
            base.render();
            base.interval = setInterval(function () {
                base.render();
                if (base.$el.height() <= 0) {
                    clearInterval(base.interval);
                }
            }, 900);
            base.registerEvents();
            base.$el.show();
            base.$el.attr("oncontextmenu", "return false;");
        },
        render: function () {
            var base = this;

            var template = _.template(TaskItemTemplate, { task: base.task, _s: _s });
            base.$el.html(template);
            var now = new Date();
            if (base.task.get("due_date")) {
                var date = base.task.getDueDate();

                if (date < now) {

                    base.$el.addClass("overdue");

                    var display = "+ ";
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

                    var display = "- ";
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
            }


        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate("a", "mousedown", function (e) {
                e.stopPropagation();
            });

            base.$el.mousedown(function (e) {
                if (e.which == 1 && base.item_click_handler) {
                    base.item_click_handler(base.task);
                }

                if (e.which == 3) {
                    var context_menu = new ContextMenu();
                    context_menu.addButton("Open", function () {
                        window.location = "#tasks/" + base.task.get('id');
                    });
                    context_menu.addButton("Delete", function () {
                        if (confirm("Are you sure you want to delete this task ?")) {
                            base.$el.remove();
                            base.task.destroy({
                                success: function () {
                                    base.SmartBlocks.show_message("Task successfully deleted");

                                },
                                error: function () {
                                    base.SmartBlocks.show_message("Task could not be deleted");
                                }
                            });
                        }
                    });


                    context_menu.show(e);
                }
            });


        }
    });

    return DeadlineItemView;
});