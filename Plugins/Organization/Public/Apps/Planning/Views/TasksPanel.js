define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/task_panel.html',
    'Organization/Apps/Tasks/Collections/Tasks',
    './TaskItem'
], function ($, _, Backbone, TaskPanelTemplate, TasksCollection, TaskItem) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "a_class",
        initialize: function () {
            var base = this;
        },
        init: function (SmartBlocks, parent) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.parent = parent;
            base.tasks = base.parent.tasks;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(TaskPanelTemplate, {});
            base.$el.html(template);

            base.update();
        },
        update: function () {
            var base = this;

            var tasks = base.tasks.models;
            var list = base.$el.find(".planning_tasks_list");
            list.html("");
            for (var k in tasks) {
                var task = tasks[k];
                if (task.get("parent") == null) {
                    var task_item = new TaskItem(task);
                    list.append(task_item.$el);
                    task_item.init(base.SmartBlocks);
                }

            }
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});