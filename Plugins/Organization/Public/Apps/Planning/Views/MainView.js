define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main_view.html',
    './Calendar',
    './TasksPanel',
    'Organization/Apps/Tasks/Collections/Tasks',
    'Organization/Apps/Tasks/Models/Task'
], function ($, _, Backbone, MainViewTemplate, CalendarView, TasksPanel, TasksCollection, Task) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "planning_view",
        initialize: function () {
            var base = this;
            base.events = $.extend({}, Backbone.Events);
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.tasks_all = new TasksCollection();

            base.tasks_all.fetch({
                success: function () {

                    base.render();
                    base.update();
                    base.registerEvents();
                }
            });


        },
        render: function () {
            var base = this;

            var template = _.template(MainViewTemplate, {});
            base.$el.html(template);

            var calendar_view = new CalendarView();
            base.$el.find(".calendar_container").html(calendar_view.$el);
            calendar_view.init(base.SmartBlocks, base);
        },
        update: function () {
            var base = this;
            var tasks = base.tasks_all.filter(function (task) {
                return !task.fullyPlanned();
            });
            base.tasks = new TasksCollection();
            for (var k in tasks) {
                base.tasks.add(tasks[k]);
            }
            console.log(base.tasks);

            base.task_panel = new TasksPanel();
            base.$el.find(".activity_tree_container").html(base.task_panel.$el);
            base.task_panel.init(base.SmartBlocks, base);

        },
        registerEvents: function () {
            var base = this;
            base.events.on("updated_planned_task", function (planned_task) {
                base.tasks_all.fetch({
                    success: function () {
                        base.update();
                    }
                });
            });

        }
    });

    return View;
});