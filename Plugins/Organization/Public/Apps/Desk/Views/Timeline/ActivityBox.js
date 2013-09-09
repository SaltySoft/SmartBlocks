define([
    'jquery',
    'underscore',
    'backbone',
    'text!../../Templates/Timeline/activity_box.html',
    'Organization/Apps/Common/Views/WorkloadTimeline'
], function ($, _, Backbone, activity_box_tpl, WorkloadTimeline) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "activity_box",
        initialize: function (activity) {
            var base = this;
            base.activity = activity;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
        },
        render: function () {
            var base = this;

            var template = _.template(activity_box_tpl, {
                activity: base.activity
            });
            base.$el.html(template);

            base.update();

            var workload_timeline = new WorkloadTimeline(base.activity.getPlannedTasks());
            base.$el.find(".workload_timeline_container").html(workload_timeline.$el);

            workload_timeline.init(base.SmartBlocks);

            setInterval(function () {
                if (base.$el.width() > 0) {
                    base.update();
                }
            }, 1000);
        },
        update: function () {
            var base = this;
            base.$el.find(".activity_name").html(base.activity.get('name'));


        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});