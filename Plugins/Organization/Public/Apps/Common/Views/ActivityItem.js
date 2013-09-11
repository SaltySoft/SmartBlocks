define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/activity_item.html',
    'ContextMenuView'
], function ($, _, Backbone, ActivityItemTemplate, ContextMenu) {
    var View = Backbone.View.extend({
        tagName: "li",
        className: "activity_list_item",
        initialize: function (model) {
            var base = this;
            base.model = model;
            base.activity = model;
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

            var template = _.template(ActivityItemTemplate, {});
            base.$el.html(template);

            base.$el.find(".name").html(base.model.get("name"));

            base.$el.css("background", base.activity.get("type").get("color"));
        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate("a", "click", function () {
                base.parent.events.trigger("activity_clicked", base.activity);
            });

            base.$el.mouseup(function (e) {
                if (e.which == 3) {
                    var context_menu = new ContextMenu();
                    context_menu.addButton("Detailed view", function () {
                        window.location = "#activities/" + base.activity.get('id');
                    });
                    context_menu.addButton("Delete", function () {
                        base.activity.destroy({
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