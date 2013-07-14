define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main_view.html',
    './TaskSearchControls',
    './TaskList',
    './TaskPreview',
    'Organization/Apps/Tasks/Collections/Tasks',
    'Organization/Apps/Common/Collections/TaskTags'
], function ($, _, Backbone, MainViewTemplate, TaskSearchControlsView, TaskListView, TaskPreview, TasksCollection, TaskTagsCollection) {
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

            base.tasks_list_view = new TaskListView();
            base.$el.find(".tasks_list_container").html(base.tasks_list_view.$el);
            base.tasks_list_view.init(SmartBlocks, base);

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
                    console.log("MAIN VIEW base.tasks_tags", base.tasks_tags);
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

            base.SmartBlocks.events.on("org_new_task", function (task) {
                base.tasks.add(task);
                base.events.trigger("loaded_tasks");
            });

            base.events.on("load_task_list_with_params", function (params) {
                base.tasks.fetch({
                    data:params,
                    success:function () {
                        base.events.trigger("loaded_tasks");
                    }
                });
            });
        }
    });

    return View;
});