define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main_view.html',
    './Calendar',
    './TasksPanel',
    'Organization/Apps/Tasks/Collections/Tasks'
], function ($, _, Backbone, MainViewTemplate, CalendarView, TasksPanel, TasksCollection) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "planning_view",
        initialize: function () {
            var base = this;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.tasks = new TasksCollection();

            base.tasks.fetch({
                success: function () {
                    base.render();
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


            base.task_panel = new TasksPanel();
            base.$el.find(".activity_tree_container").html(base.task_panel.$el);
            base.task_panel.init(base.SmartBlocks, base);


        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});