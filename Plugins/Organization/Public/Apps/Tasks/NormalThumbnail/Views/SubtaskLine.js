define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/subtask_line.html',
    'ContextMenuView'
], function ($, _, Backbone, subtask_line_tpl, ContextMenu) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "subtask_line",
        initialize: function (subtask) {
            var base = this;
            base.subtask = subtask;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
            base.registerEvents();

        },
        render: function () {
            var base = this;

            var template = _.template(subtask_line_tpl, {
                subtask: base.subtask
            });
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;

            base.$el.mouseup(function (e) {

                if (e.which == 3) {
                    var context_menu = new ContextMenu();
                    context_menu.addButton('Subtask menu');

                    context_menu.addButton('Delete', function () {
                        if (confirm("Are you sure you want to delete this subtask ?")) {
                            base.$el.slideUp(200, function () {
                                base.subtask.destroy();
                                base.$el.remove();
                            });
                        }
                    });

                    context_menu.show(e);
                }


                e.stopPropagation();
            });

            base.$el.delegate(".edit_button", "click", function () {
                base.$el.toggleClass("edition");
                if (base.$el.hasClass("edition")) {
                    base.$el.find('.name_input').val(base.subtask.get("name"));
                    base.$el.find('.time_input').val(parseFloat(base.subtask.get("duration")) / 3600000);

                    base.$el.find(".edit_button").html("Done");
                } else {
                    base.$el.find(".edit_button").html("Edit");

                    base.subtask.set("name", base.$el.find('.name_input').val());
                    base.subtask.set("duration", parseFloat(base.$el.find('.time_input').val()) * 3600000);

                    base.$el.find('.st_name').html(base.subtask.get("name"));
                    base.$el.find('.st_time').html(parseFloat(base.subtask.get("duration")) / 3600000);

                    base.subtask.save({}, {
                        success: function () {
                            base.SmartBlocks.show_message("Successfully saved sub-task");
                        }
                    });
                }
            });

            base.$el.delegate(".finished_input", 'change', function () {
                var elt = $(this);
                base.subtask.set("finished", elt.is(":checked"));
                base.subtask.save({}, {
                    success: function () {
                        base.SmartBlocks.show_message("Successfully saved sub-task");
                    }
                });
            });
        }
    });

    return View;
});