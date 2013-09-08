define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/activity_thumbnail.html',
    'Organization/Apps/Daily/Collections/PlannedTasks',
    'Organization/Apps/Common/Views/WorkloadTimeline',
    './Deadlines'
], function ($, _, Backbone, ActivityThumbnailTemplate, PlannedTasksCollection, WorkloadTimelineView, DeadlinesView) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "activity_thumbnail_view",
        initialize: function (activity) {
            var base = this;
            base.model = activity;
            base.activity = activity;
        },
        init: function (SmartBlocks, callback) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
            base.registerEvents();
            base.callback = callback;
        },
        render: function () {
            var base = this;

            if (base.activity.get("archived")) {
                base.$el.addClass("archived");
            } else {
                base.$el.removeClass("archived");
            }

            var template = _.template(ActivityThumbnailTemplate, {
                activity: base.activity
            });
            base.$el.html(template);
            console.log("id : " + base.activity.get("id"));
            base.$el.find(".name").html(base.activity.get("name"));

//            var description = base.activity.get("description") ? base.activity.get("description") : "No description...";
//            base.$el.find(".description").html(description);

            var planned_tasks = new PlannedTasksCollection();
            var tasks = base.activity.get("tasks").models;
            var required_time = 0;
            for (var k in tasks) {
                var planned_tasks_c = tasks[k].get("planned_tasks");
                required_time += tasks[k].get("required_time");
                for (var k in planned_tasks_c.models) {
                    planned_tasks.add(planned_tasks_c.models[k]);
                }
            }

            var workload_timeline_view = new WorkloadTimelineView(planned_tasks, required_time);
            base.$el.find(".workload_timeline_container").html(workload_timeline_view.$el);
            workload_timeline_view.init(base.SmartBlocks);

            var deadlines_view = new DeadlinesView(base.activity);
            base.$el.find(".deadlines_list_container").html(deadlines_view.$el);
            deadlines_view.init(base.SmartBlocks);

            base.update();
        },
        update: function () {
            var base = this;
        },
        registerEvents: function () {
            var base = this;


        }
    });

    return View;
});