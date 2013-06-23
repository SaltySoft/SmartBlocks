define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Daily/Templates/task_item.html',
    'ContextMenuView'
], function ($, _, Backbone, TaskItemTemplate, ContextMenu) {

    var days = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];

    var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

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

            var template = _.template(TaskItemTemplate, { task: base.task });
            base.$el.html(template);

            var date = base.task.getDueDate();
            var today = new Date();
            var display = "";
            var milliseconds = date.getTime() - today.getTime();

            var days = (date.getTime() - today.getTime()) / ( 24 * 3600 * 1000);
            if (days >= 1) {
                display += Math.floor(days) + "d ";
            }

            var hours = (days - Math.floor(days)) * 24;
            display += Math.floor(hours) + " h ";

            var minutes = (hours - Math.floor(hours)) * 60;
            display += Math.floor(minutes) + " m ";

            var seconds = (minutes - Math.floor(minutes)) * 60;
            display += Math.floor(seconds) + " s ";


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
                    context_menu.addButton("Delete this task", function () {
                        base.task.destroy({
                            success: function () {
                                base.planning.events.trigger("deleted_task", id);
                                base.$el.remove();
                            }
                        });

                    });
                    context_menu.show(e);
                    return false;
                }

                return false;
            });

            base.$el.mouseover(function () {
                base.planning.events.trigger("over_task", base.task.id);
            });

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