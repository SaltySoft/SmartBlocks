define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main.html',
    'text!../Templates/new_task_thb.html',
    './SubtaskLine',
    'ContextMenuView'
], function ($, _, Backbone, main_template, new_tpl, SubtaskLineView, ContextMenu) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "task_normal_thumbnail",
        initialize: function (task) {
            var base = this;
            base.task = task;
            base.model = task;
            base.current_page = 1;
            base.page_size = 5;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(main_template, {
                task: base.task
            });
            base.$el.html(template);

            base.renderSubtasksList();
        },
        renderSubtasksList: function (page) {
            var base = this;


            var subtasks = base.task.get("subtasks");
            base.$el.find(".subtasks_list").html('');
            for (var k in subtasks.models) {
                var subtask = subtasks.models[k];
                var subtask_line = new SubtaskLineView(subtask);
                base.$el.find(".subtasks_list").append(subtask_line.$el);
                subtask_line.init(base.SmartBlocks);
            }


            //paginator construction
            for (var i = 1; i < base.page_size; i++) {
                var link = $('<a href="javascript:void(0)" class="page_button" data-page="' + i + '"><div></div></a>');
            }

        },
        update: function () {
            var base = this;
            base.$el.find('.name').html(base.task.get('name'));
            base.$el.find('.task_name_input').html(base.task.get('name'));
        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate(".name", "click", function () {
                base.$el.find(".name_container").addClass("edition");
                base.$el.find('.task_name_input').focus();
            });

            base.$el.delegate(".task_name_input", "blur", function () {
                var elt = $(this);
                base.$el.find(".name_container").removeClass('edition');
                if (elt.val() != base.task.get('name')) {
                    base.task.set('name', elt.val());
                    base.task.save({}, {
                        success: function () {
                            base.SmartBlocks.show_message('Changes saved on server');
                        }
                    });
                    base.update();
                }
            });

            base.$el.delegate(".task_name_input", "keyup", function (e) {
                if (e.keyCode == 13) {
                    var elt = $(this);
                    base.$el.find(".name_container").removeClass('edition');
                    if (elt.val() != base.task.get('name')) {
                        base.task.set('name', elt.val());
                        base.task.save({}, {
                            success: function () {
                                base.SmartBlocks.show_message('Changes saved on server');
                            }
                        });
                        base.update();
                    }
                }
            });

            base.$el.bind("mouseup", function (e) {
                if (e.which == 3) {
                    var context_menu = new ContextMenu();
                    context_menu.addButton("View", function () {
                        window.location = "#tasks/" + base.task.get('id');
                    });

                    context_menu.addButton("Delete", function () {
                        if (confirm("Are you sure you want to delete this task ?")) {
                            base.task.destroy({
                                success: function () {
                                    base.SmartBlocks.show_message("Successfully deleted task");
                                },
                                error: function () {
                                    base.SmartBlocks.show_message("Couldn't delete task");
                                }
                            });
                            base.$el.hide(200, function () {
                                base.$el.remove();
                            });

                        }
                    });

                    context_menu.show(e);
                }
            });


        }
    });

    View.new_tpl = new_tpl;

    return View;
});