define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/summary.html',
    'Organization/Apps/Daily/Collections/PlannedTasks',
    'Organization/Apps/Common/Views/WorkloadTimeline'
], function ($, _, Backbone, SummaryTemplate, PlannedTasksCollection, WorkloadTimelineView) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "activity_summary",
        initialize: function (activity) {
            var base = this;

            base.activity = activity;
            base.model = activity;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
        },
        render: function () {
            var base = this;

            var template = _.template(SummaryTemplate, {
                activity: base.activity,
                types: OrgApp.activity_types
            });
            base.$el.html(template);

            var planned_tasks = new PlannedTasksCollection();
            var tasks = base.activity.get("tasks").models;
            var required_time = 0;
            var work_done = 0;
            var work_todo = 0;
            var total_work = 0;
            var now = new Date();
            var pt_count = 0;
            for (var k in tasks) {
                var planned_tasks_c = tasks[k].get("planned_tasks");
                required_time += tasks[k].get("required_time");
                for (var k in planned_tasks_c.models) {
                    pt_count++;
                    var pt = planned_tasks_c.models[k];
                    total_work += parseInt(pt.get('duration'));
                    var start = pt.getStart();

                    var end = new Date();
                    end.setTime(start.getTime() + parseInt(pt.get('duration')));
                    if (end < now) {
                        work_done += parseInt(pt.get('duration'));
                    } else {
                        if (start > now) {
                            if (pt.get('duration'))
                                work_todo += parseInt(pt.get('duration'));
                        } else {
                            console.log("before", work_done);
                            work_done += end.getTime() - start.getTime();
                            work_todo += end.getTime() - now.getTime();
                        }
                    }

                    planned_tasks.add(planned_tasks_c.models[k]);
                }
            }

            base.$el.find(".work_done").html(OrgApp.common.getFullTimeString(work_done));
            base.$el.find(".work_todo").html(OrgApp.common.getFullTimeString(work_todo));
            base.$el.find(".total_work").html(OrgApp.common.getFullTimeString(total_work));
            base.$el.find(".pt_count").html(pt_count);

            var workload_timeline_view = new WorkloadTimelineView(planned_tasks, required_time);
            base.$el.find(".workload_timeline_container").html(workload_timeline_view.$el);
            workload_timeline_view.init(base.SmartBlocks);

        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});