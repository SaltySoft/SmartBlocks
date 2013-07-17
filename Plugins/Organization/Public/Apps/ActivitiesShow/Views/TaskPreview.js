define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/task_preview.html',
    'Organization/Apps/Common/Views/TasksList',
    'Organization/Apps/Tasks/Collections/Tasks',
    'Organization/Apps/Common/Views/PlannedTasksList'
], function ($, _, Backbone, TaskPreviewTemplate, TasksListView, TasksCollection, PlannedTasksListView) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "task_preview",
        initialize: function (model) {
            var base = this;
            base.model = model;
            base.task = model;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(TaskPreviewTemplate, {
                task: base.task
            });
            base.$el.html(template);

            var tasks = base.task.get('children');
//            console.log(tasks);
            var task_list_view = new TasksListView(tasks);
            base.$el.find(".subtasks_container").html(task_list_view.$el);
            task_list_view.init(base.SmartBlocks);

            var collection = base.task.get("planned_tasks");
//            console.log(collection);
            var planned_tasks_list = new PlannedTasksListView(collection);
            base.$el.find(".planned_tasks_container").html(planned_tasks_list.$el);
            planned_tasks_list.init(base.SmartBlocks);

            base.update();
        },
        update: function () {
            var base = this;
            base.$el.find(".task_name").html(base.task.get('name'));
        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate(".deletion_button", "click", function () {
                if (confirm("Are you sure you want to delete this task ?")) {
                    base.task.destroy({
                        success: function () {
                            base.SmartBlocks.show_message("Task successfully deleted");
                            base.$el.remove();
                        },
                        error: function () {
                            base.SmartBlocks.show_message("Task could not be deleted");
                        }
                    });
                }
            });
        }
    });

    return View;
});