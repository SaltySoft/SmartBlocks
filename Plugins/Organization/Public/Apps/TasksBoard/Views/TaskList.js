define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/task_list.html',
    './TaskItem',
    'Organization/Apps/Common/Views/TaskCreationView'
], function ($, _, Backbone, TaskListTemplate, TaskItemView, TaskCreationView) {
    var View = Backbone.View.extend({
        tagName:"div",
        className:"task_list",
        initialize:function () {
            var base = this;
        },
        init:function (SmartBlocks, parent) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.parent = parent;
            base.tasks = base.parent.tasks;

            base.render();
            base.registerEvents();
        },
        render:function () {
            var base = this;
            var template = _.template(TaskListTemplate, {});
            base.$el.html(template);
        },
        registerEvents:function () {
            var base = this;

            base.parent.events.on("tasks_loaded", function () {
                base.$el.find(".tasks_list").find(".task_list_item").remove();
                for (var k in base.tasks.models) {
                    var task = base.tasks.models[k];
                    var task_item_view = new TaskItemView(task);
                    base.$el.find(".tasks_list").append(task_item_view.$el);
                    task_item_view.init(base.SmartBlocks, base.parent);
                }
            });

            base.$el.delegate(".task_creation_button", "click", function () {
                var task_creation_view = new TaskCreationView();
                task_creation_view.init(base.SmartBlocks, base.parent.tasks_tags);
            });
        }
    });

    return View;
});