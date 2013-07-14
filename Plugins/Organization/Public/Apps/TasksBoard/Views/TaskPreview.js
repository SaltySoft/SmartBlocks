define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/task_preview.html',
    'Organization/Apps/Common/Views/TasksList'
], function ($, _, Backbone, TaskPreviewTemplate, TasksListView) {
    var View = Backbone.View.extend({
        tagName:"div",
        className:"task_preview",
        initialize:function (model) {
            var base = this;
            base.task = model;
        },
        init:function (SmartBlocks, parent) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.parent = parent;

            base.render();
            base.registerEvents();
        },
        render:function () {
            var base = this;
            var template = _.template(TaskPreviewTemplate, {
                task:base.task
            });
            base.$el.html(template);
            if (!base.task) {
                base.$el.addClass("empty");
            } else {
                base.$el.removeClass("empty");
                var subtasks_list = new TasksListView(base.activity.get("children"))
                base.$el.find(".subtasks_list_container").html(subtasks_list.$el);
                subtasks_list.init(base.SmartBlocks);

//                if (base.task.get("archived")) {
//                    base.$el.addClass("archived");
//                } else {
//                    base.$el.removeClass("archived");
//                }
            }
        },
        registerEvents:function () {
            var base = this;
            base.parent.events.on("change_task_preview", function (task) {
                base.task = task;
                base.render();
            });

//            base.$el.delegate(".archive_button", "click", function () {
//                base.activity.set("archived", !base.activity.get("archived"));
//                base.activity.save({}, {
//                    success: function () {
//
//                        if (base.activity.get("archived")) {
//                            base.$el.addClass("archived");
//                            base.SmartBlocks.show_message("Activity archived");
//                        } else {
//                            base.$el.removeClass("archived");
//                            base.SmartBlocks.show_message("Activity unarchived");
//                        }
//                    }
//                });
//            });

            base.$el.delegate(".deletion_button", "click", function () {
                if (confirm("Are you sure you want to delete this task ?")) {
                    base.task.destroy({
                        success:function () {
                            base.$el.addClass("empty");
                            base.parent.events.trigger("loaded_tasks");
                        },
                        error:function () {
                        }
                    });
                }
            });
        }
    });

    return View;
});