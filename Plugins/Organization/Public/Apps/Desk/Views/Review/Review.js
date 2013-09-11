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
                    start.setHours(0, 0, 0, 0);
                    var stop = pt.getStop();
                    stop.setHours(23, 59, 59, 999);
                    if (start < now && now < stop) {
                        display = true;
                    }
                }
                return display;
            }));

            base.current_page = 1;
            base.page_size = 10;
            base.page_count = 1;
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

            var total_count = base.tasks.models.length;
            base.page_count = Math.ceil(total_count / base.page_size);

            if (base.current_page < 1) {
                base.current_page = 1;
            } else if (base.current_page > base.page_count) {
                base.current_page = base.page_count;
            }

            var page_start = (base.current_page - 1) * base.page_count;
            var page_stop = page_start + base.page_count + 1;

            current_list = base.tasks.slice(page_start, page_stop);

            for (var k in current_list) {
                var thumbnail = new TaskThumbnail(base.tasks.models[k]);
                base.$el.find(".tasks_list").append(thumbnail.$el);
                thumbnail.init(base.SmartBlocks);
            }

            base.$el.find(".pagination").html('');
            for (var i = 1; i <= base.page_count; i++) {
                base.$el.find(".pagination").append('<a href="javascript:void(0);" class="' + (base.current_page == i ? 'selected' : '') +  '" data-page="' + i + '"><div></div></a>');
            }
        },
        registerEvents: function () {
            var base = this;
            base.$el.delegate('.pagination a', 'click', function () {
                var elt = $(this);
                var page = elt.attr('data-page');
            });
        }
    });

    return View;
});