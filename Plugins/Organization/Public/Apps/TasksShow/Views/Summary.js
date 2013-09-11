define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/summary.html',
    'Organization/Apps/Daily/Collections/PlannedTasks',
    'Organization/Apps/Common/Views/WorkloadTimeline'
], function ($, _, Backbone, summary_template, PlannedTasksCollection, WorkloadTimeline) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "task_show_summary",
        initialize: function (task) {
            var base = this;
            base.task = task;
            base.model = task;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
        },
        render: function () {
            var base = this;

            var template = _.template(summary_template, {});
            base.$el.html(template);


            var planned_tasks = new PlannedTasksCollection();
            var task_pts = base.task.get('planned_tasks');
            for (var k in task_pts.models) {
                var pt = OrgApp.planned_tasks.get(task_pts.models[k]);
                planned_tasks.add(pt);
            }

            var workload_timeline = new WorkloadTimeline(planned_tasks);
            base.$el.find(".workload_timeline_container").html(workload_timeline.$el);
            var start = new Date();
            start.setTime(base.task.get("creation_date"));
            workload_timeline.init(base.SmartBlocks, base.task.get("required_time"), base.task, start);
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});