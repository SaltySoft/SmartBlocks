define([
    'jquery',
    'underscore',
    'backbone',
    'text!./Templates/main.html',
    'Organization/Apps/Tasks/NormalThumbnail/Views/Main'
], function ($, _, Backbone, review_template, TaskThumbnail) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "day_review",
        initialize: function () {
            var base = this;
            var now = new Date();
            base.tasks = new OrgApp.TasksCollection(OrgApp.tasks.filter(function (task) {
                var planned_tasks = task.getPlannedTasks();
                var display = false;
                for (var k in planned_tasks.models) {
                    var pt = planned_tasks.models[k];
                    var start = pt.getStart();
                    start.setHours(0,0,0,0);
                    var stop = pt.getStop();
                    stop.setHours(23,59,59,999);
                    if (start < now && now < stop) {
                        display = true;
                    }
                }
                return display;
            }));

            base.current_page = 1;
            base.page_size = 10;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();

        },
        render: function () {
            var base = this;

            var template = _.template(review_template, {});
            base.$el.html(template);


            for (var k in base.tasks.models) {
                var thumbnail = new TaskThumbnail(base.tasks.models[k]);
                base.$el.find(".tasks_list").append(thumbnail.$el);
                thumbnail.init(base.SmartBlocks);
            }
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});