define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/workload_timeline.html',
    '../SubApps/WorkloadTimeline/WorkloadTimeline'
], function ($, _, Backbone, WorkloadTimelineTemplate, WorkloadTimelineApp) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "workload_timeline",
        initialize: function (planned_tasks) {
            var base = this;

            base.planned_tasks = planned_tasks;

        },
        init: function (SmartBlocks,total_amount, deadline, start) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.total_amount = total_amount ? total_amount : 0;
            base.deadline = deadline;
            base.render();

            base.canvas = base.$el.find(".workload_timeline_canvas")[0];
            base.ctx = base.canvas.getContext('2d');
            base.wt = new WorkloadTimelineApp(base.canvas, base.planned_tasks, base.total_amount, base.deadline, start);
            base.$el.disableSelection();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(WorkloadTimelineTemplate, {});
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;

            base.$el.find("canvas").attr("width", base.$el.width());
            base.$el.find("canvas").attr("height", base.$el.height());
        }
    });

    return View;
});