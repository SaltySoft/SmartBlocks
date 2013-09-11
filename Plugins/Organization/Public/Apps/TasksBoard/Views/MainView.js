define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main_view.html',
    './TaskSearchControls',
    'Organization/Apps/Common/Views/TasksList',
    './TaskPreview',
    'Organization/Apps/Tasks/Collections/Tasks',
    'Organization/Apps/Common/Collections/TaskTags',
    'Organization/Apps/Tasks/Models/Task',
    'Organization/Apps/Common/Views/TaskPopup'
], function ($, _, Backbone, MainViewTemplate, TaskSearchControlsView, TasksListView, TaskPreview, TasksCollection, TaskTagsCollection, Task, TaskPopupView) {
    /**
     * Tasks Board Index
     * Main View
     */
    var View = Backbone.View.extend({
        tagName:"div",
        className:"task_board_view",
        initialize:function () {
            var base = this;
            base.events = $.extend({}, Backbone.Events);
        },
        init:function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.tasks = new TasksCollection();
            base.tasks_tags = new TaskTagsCollection();

            base.render();
            base.registerEvents();

            base.search_controls_view = new TaskSearchControlsView();
            base.$el.find(".search_controls_container").html(base.search_controls_view.$el);
            base.search_controls_view.init(SmartBlocks, base);

            base.tasks_list_view = new TasksListView(base.tasks);
            base.$el.find(".tasks_list_container").html(base.tasks_list_view.$el);
            base.tasks_list_view.init(SmartBlocks, function (task) {
                base.events.trigger("change_task_preview", task);
            });

            base.task_preview = new TaskPreview();
            base.$el.find(".task_preview_container").html(base.task_preview.$el);
            base.task_preview.init(SmartBlocks, base);

            base.loadTasks();
            base.loadTaskTags();
        },
        loadTasks:function () {
            var base = this;
            base.tasks.fetch({
                success:function () {
                    base.events.trigger("tasks_loaded");
                }
            });
        },
        loadTaskTags:function () {
            var base = this;
            base.tasks_tags.fetch({
                success:function () {
                    base.events.trigger("tasks_tags_loaded");
                }
            });
        },
        render:function () {
            var base = this;
            var template = _.template(MainViewTemplate, {});
            base.$el.html(template);
        },
        registerEvents:function () {
            var base = this;

            base.events.on("task_deleted", function () {
                base.loadTasks();
            });

            base.SmartBlocks.events.on("org_new_task", function (task) {
                base.tasks.add(task);
                base.events.trigger("loaded_tasks");
            });

            base.events.on("load_task_list_with_params", function (params) {
                base.tasks.fetch({
                    data:params,
                    success:function (data) {
                        base.events.trigger("loaded_tasks");
                    }
                });
            });

            base.$el.delegate(".task_creation_button", "click", function () {
                var date = new Date();
                date.setHours(23, 59, 59, 00);
                var task = new Task();
                task.setDueDate(date);
                var popup_view = new TaskPopupView(task, undefined);
                popup_view.init(base.SmartBlocks);
            });
        }
    });

    return View;
});