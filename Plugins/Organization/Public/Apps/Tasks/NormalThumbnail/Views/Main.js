define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main.html',
    'text!../Templates/new_task_thb.html',
    'text!../Templates/new_subtask_tpl.html',
    './SubtaskLine',
    'ContextMenuView'
], function ($, _, Backbone, main_template, new_tpl, new_subtask_tpl, SubtaskLineView, ContextMenu) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "task_normal_thumbnail",
        initialize: function (task) {
            var base = this;
            base.task = task;
            base.model = task;
            base.current_page = 1;
            base.page_size = 4;
            base.page_count = 0;
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
            if (page)
                base.current_page = page;



            base.page_count = Math.ceil(subtasks.models.length / base.page_size);

            if (base.current_page < 1) {
                base.current_page = 1;
            }
            if (base.current_page > base.page_count) {
                base.current_page = base.page_count;
            }

            var page_start = (base.current_page - 1) * base.page_size;
            var page_end = page_start + base.page_size;

            var subtasks_to_show = subtasks.slice(page_start, page_end);



            base.$el.find(".subtasks_list").html('');
            for (var k in subtasks_to_show) {
                var subtask = subtasks_to_show[k];
                var subtask_line = new SubtaskLineView(subtask);
                base.$el.find(".subtasks_list").append(subtask_line.$el);
                subtask_line.init(base.SmartBlocks);
            }

            var new_subtask_template = _.template(new_subtask_tpl, {});
            base.$el.find(".subtasks_list").append(new_subtask_template);



            //paginator construction
            base.$el.find(".pagination").html("");
            for (var i = 1; i <= base.page_count; i++) {
                var link = $('<a href="javascript:void(0)" class="page_button' + (i == base.current_page ? ' selected' : '') + '" data-page="' + i + '"><div></div></a>');
                base.$el.find(".pagination").append(link);
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
                            base.$el.hide(200, function () {
                                base.task.destroy({
                                    success: function () {
                                        base.SmartBlocks.show_message("Successfully deleted task");
                                    },
                                    error: function () {
                                        base.SmartBlocks.show_message("Couldn't delete task");
                                    }
                                });
                                base.$el.remove();
                            });

                        }
                    });

                    context_menu.show(e);
                }
            });



            base.$el.delegate('.create_subtask_button', 'mouseup', function (e) {
                if (e.which == 1) {
                    var subtask = new OrgApp.Subtask();
                    subtask.set('task', base.task);
                    subtask.set('name', "New subtask");
                    subtask.set('duration', 3600000);

                    subtask.save();

                    base.task.get("subtasks").add(subtask);
                    base.renderSubtasksList();
                    base.renderSubtasksList(base.page_count);
                }
                e.stopPropagation();
            });


            base.$el.delegate('.pagination a', 'click', function () {
                var elt = $(this);
                base.renderSubtasksList(elt.attr('data-page'));
            });

            base.task.get('subtasks').on('remove', function () {
                base.renderSubtasksList();
            });
        }
    });

    View.new_tpl = new_tpl;

    return View;
});