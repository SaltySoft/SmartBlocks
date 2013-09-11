define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Tasks/Collections/Tasks',
    './ActivityItem',
    './TasksListItem'
], function ($, _, Backbone, TasksCollection, ActivityListItemView, TasksListItemView) {
    var View = Backbone.View.extend({
        tagName: "ul",
        className: "activity_tree task_list_view",
        initialize: function () {
            var base = this;
            base.events = $.extend({}, Backbone.Events);
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.tasks = new TasksCollection();

            base.current_item = undefined;


            base.tasks.fetch({
                success: function () {
                    base.render();

                }
            });

            base.registerEvents();

        },
        render: function () {
            var base = this;

            base.update();
        },
        update: function () {
            var base = this;

            base.$el.html("");
            if (!base.current_item) {
                for (var k in base.tasks.models) {
                    var task = base.tasks.models[k];
                    base.addTaskItem(task, false);

                }
            } else {
                base.addTaskItem(base.current_item, true);
            }
        },
        addTaskItem: function (task, children) {
            var base = this;
            var task_item_view = new TasksListItemView(task);
            base.$el.append(task_item_view.$el);
            var handler = undefined;
            if (task.get("children").models.length > 0) {
                handler = function (task) {
                    base.itemClicked(task);
                }
            }

            task_item_view.init(base.SmartBlocks, handler);

            var eventObject = {
                title: task.get("name"),
                task_id: task.get("id")
            };
            task_item_view.$el.data('eventObject', eventObject);
            task_item_view.$el.draggable({
                revert: true
            });

            if (children) {
                for (var k in task.get("children").models) {
                    base.addTaskItem(task.get("children").models[k], false);
                }
            }
        },
        itemClicked: function (item) {
            var base = this;
            if (base.current_item == item) {
                base.current_item = undefined;

                base.update();
            } else {
                base.current_item = item;
                base.update();
            }
        },
        registerEvents: function () {
            var base = this;

            base.events.on("activity_clicked", function (activity) {
                base.itemClicked(activity);
            });


        }
    });

    return View;
});