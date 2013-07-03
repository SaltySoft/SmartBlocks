define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Daily/Templates/planned_list.html',
    'Organization/Apps/Daily/Collections/PlannedTasks'
], function ($, _, Backbone, PlannedListTemplate, PlannedTasksCollection) {
    var PlannedList = Backbone.View.extend({
        tagName: "div",
        className: "planned_list",
        initialize: function (planned_list) {
            var base = this;
            base.collection = planned_list;
        },
        init: function (SmartBlocks, planning) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            if (!base.collection)
                base.planned_tasks = new PlannedTasksCollection();
            else
                base.planned_tasks = base.collection;

            base.planning = planning;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;
            var template = _.template(PlannedListTemplate, {});

            base.$el.html(template);
            if (!base.collection)
                base.fetchList();
        },
        startLoading: function () {
            var base = this;
//            base.SmartBlocks.startLoading("Fetching stuff");
        },
        stopLoading: function () {
            var base = this;
//            base.SmartBlocks.stopLoading();
        },
        fetchList: function () {
            var base = this;
            var date = new Date(base.planning.current_date);
            date.setHours(0, 0, 0, 0);
            base.startLoading();
            base.planned_tasks.fetch({
                data: {
                    "date": date.getTime()
                },
                success: function () {
                    var planned_list = base.$el.find(".planned_list");
                    planned_list.html("");
                    var contained_tasks = [];
                    for (var k in base.planned_tasks.models) {
                        var planned_task = base.planned_tasks.models[k];
                        if (!contained_tasks[planned_task.getName()]) {

                            planned_list.append('<li class="todays_planned">' + planned_task.getName() + '</li>');
                            contained_tasks[ planned_task.getName()] = true;
                        }
                    }
                    base.stopLoading();
                    console.log(base.planned_tasks.models);
                }
            });
        },
        registerEvents: function () {
            var base = this;
            if (base.planning)
                base.planning.events.on("planning_modified", function () {
                    base.fetchList();
                });
        }
    });

    return PlannedList;
});