define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/task_item.html',
    'ContextMenuView'
], function ($, _, Backbone, TaskItemTemplate, ContextMenu) {
    var View = Backbone.View.extend({
        tagName: "li",
        className: "task_list_item",
        initialize: function (model) {
            var base = this;
            base.model = model;
            base.task = model;
        },
        init: function (SmartBlocks, parent) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.parent = parent;

            base.$el.attr("oncontextmenu", "return false;");

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;
            var template = _.template(TaskItemTemplate, {});
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate("a", "click", function () {
                base.parent.events.trigger("change_task_preview", base.task);
            });

            base.$el.mouseup(function (e) {
                if (e.which == 3) {
                    var context_menu = new ContextMenu();
                    context_menu.addButton("Detailed view", function () {
                        window.location = "#task/" + base.task.get('id');
                    });
                    context_menu.addButton("Delete", function () {
                        base.task.destroy({
                            success: function () {
                                base.$el.remove();
                            }
                        });
                    });
                    context_menu.show(e);
                }
            })
        }
    });

    return View;
});