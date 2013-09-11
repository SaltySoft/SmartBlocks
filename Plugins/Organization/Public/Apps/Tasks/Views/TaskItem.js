define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Tasks/Templates/task_item.html',
    'Organization/Apps/Common/Views/ShareWindow',
    'ContextMenuView',
    'Organization/Apps/Common/Views/TaskPopup'
], function ($, _, Backbone, TaskItemTemplate, ShareWindow, ContextMenu, TaskPopup) {
    var TaskItemView = Backbone.View.extend({
        tagName: "li",
        className: "task_item normal",
        initialize: function (model) {
            var base = this;
            base.model = model;

            base.days = [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ];
            base.task = base.model;
        },
        init: function (SmartBlocks, main_view) {
            var base = this;
            base.main_view = main_view;
            base.SmartBlocks = SmartBlocks;
            base.render();
            base.initalizeEvents();
            if (base.model.get("id") !== undefined)
                base.$el.attr("data-id", base.model.get("id"));
        },
        render: function () {
            var base = this;
            var due_date = base.model.getDueDate();
            var template = _.template(TaskItemTemplate, { task: base.model, time: due_date, current_date: base.model.getDueDate(), days: base.days });
            base.$el.html(template);
            if (base.model.get("completion_date") != null) {
                base.$el.addClass("completed");
            }

        },
        initalizeEvents: function () {
            var base = this;


            base.$el.delegate(".task_display", "click", function () {
                var name_input = base.$el.find(".task_edition_name_input");
                name_input.val(base.$el.find(".task_name").html());
                base.$el.find(".task_due_date_input").datepicker({ dateFormat: 'yy-mm-dd' });

                base.enterEditMode();

            });

            base.$el.delegate(".task_item_button", "click", function () {
                var elt = $(this);
                var action = elt.attr("data-action");

                if (action == "cancel") {
                    base.leaveEditMode();
                }

                if (action == "save") {
                    var name_input = base.$el.find(".task_edition_name_input");
                    base.model.set("name", name_input.val());
                    console.log(base.model);
                    base.SmartBlocks.startLoading("Saving task");
                    base.$el.find(".task_name").html(base.model.get("name"));
                    base.$el.find(".task_name").html(base.model.get("name"));
                    var due_date_str = base.$el.find(".task_due_date_input").val();
                    var due_date = new Date();
                    due_date.setMilliseconds(0);
                    due_date.setSeconds(0);
                    due_date.setMinutes(0);
                    due_date.setHours(0);
                    if (due_date_str != "") {
                        console.log("entering ");
                        var parts = due_date_str.match(/(\d+)/g);
                        due_date.setDate(parts[2]);
                        due_date.setMonth(parts[1] - 1);
                        due_date.setFullYear(parts[0]);
                    }
                    base.model.setDueDate(due_date);
                    base.model.save({}, {
                        success: function () {
                            base.SmartBlocks.stopLoading();
                            base.main_view.render();
                        }
                    });


                    base.leaveEditMode();

                }

                if (action == "delete") {
                    if (confirm("Are you sure you want to delete this task ?")) {
                        base.model.destroy();
                        base.$el.slideUp(200, function () {
                            base.$el.remove();
                        });
                    }
                }
            });



            base.$el.delegate(".checkbox", "click", function () {
                var elt = base.$el.find(".task_complete_checkbox");
                elt.prop("checked", !elt.prop("checked"));
                if (elt.prop("checked")) {
                    base.model.set("completion_date", new Date().getDate());
                    base.model.save();
                    base.$el.addClass("completed");
                } else {
                    base.model.set("completion_date", null);
                    base.model.save();
                    base.$el.removeClass("completed");
                }
            });

            base.$el.delegate(".share_button", "click", function () {
                var share_window = new ShareWindow({ model: base.model });
                share_window.init(base.SmartBlocks);
                share_window.show();
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
                                base.$el.remove();
                            }
                        });

                    });
                    context_menu.show(e);
                    return false;
                }

                return false;
            });
        },
        enterEditMode: function () {
            var base = this;
            base.$el.removeClass("normal");
            base.$el.addClass("edition");
            base.$el.closest(".tasks_list").enableSelection();
        },
        leaveEditMode: function () {
            var base = this;
            base.$el.removeClass("edition");
            base.$el.addClass("normal");
            base.$el.closest(".tasks_list").disableSelection();
        }
    });

    return TaskItemView;
});