define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/task_tag_item.html',
    'ContextMenuView'
], function ($, _, Backbone, TaskTagItemTemplate, ContextMenu) {
    var View = Backbone.View.extend({
        tagName: "li",
        className: "task_tag_item",
        initialize: function (tag) {
            var base = this;
            base.tag = tag;
        },
        init: function (SmartBlocks, callbacks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.callbacks = callbacks;
            base.render();
            base.registerEvents();
            base.$el.attr("oncontextmenu", "return false;");
        },
        render: function () {
            var base = this;
            var template = _.template(TaskTagItemTemplate, {
                tag: base.tag
            });
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;

            base.$el.mousedown(function (e) {

                if (e.which == 1) {
                    if (base.callbacks && base.callbacks.main) {
                        base.callbacks.main(base.tag);
                    }
                }
                if (e.which == 3) {
                    if (base.callbacks && base.callbacks.context) {
                        var context_menu = new ContextMenu();
                        for (var k in base.callbacks.context) {
                            var callback = base.callbacks.context[k];
                            context_menu.addButton(callback.name, function () {
                                callback.callback(base.tag);
                            });
                        }
                        context_menu.show(e);
                    }
                }

            });
        }
    });

    return View;
});