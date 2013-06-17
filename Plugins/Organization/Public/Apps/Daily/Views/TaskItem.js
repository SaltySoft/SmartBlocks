define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Daily/Templates/task_item.html',
    'ContextMenuView'
], function ($, _, Backbone, TaskItemTemplate, ContextMenu) {
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
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(TaskItemTemplate, { task: base.task });
            base.$el.html(template);
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