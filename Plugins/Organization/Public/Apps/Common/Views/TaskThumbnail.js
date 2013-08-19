define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/task_thumbnail.html',
    './DeadlineThumbnail',
    '../SubApps/DeadlineClock/DeadlineClock',
    '../SubApps/DeadlineProgressBar/DeadlineProgressBar',
    './TaskTagItem'
], function ($, _, Backbone, TaskThumbnailTemplate, DeadlineInfoView, DeadlineClock, DeadlineProgressBar, TaskTagItem) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "task_thumbnail_view",
        initialize: function (task) {
            var base = this;
            base.model = task;
            base.task = task;
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

            var template = _.template(TaskThumbnailTemplate, {
                task: base.task
            });
            base.$el.html(template);

            var canvas_c = base.$el.find(".deadline_clock");

            var canvas_p = base.$el.find(".progress_bar");

            if (base.task.hasDeadline()) {
                base.deadline_clock = new DeadlineClock(canvas_c[0], base.task);
                base.deadline_progress_bar = new DeadlineProgressBar(canvas_p[0], base.task);
                base.$el.addClass("deadline");
                base.$el.removeClass("normal");
            } else {
                base.$el.addClass("normal");
                base.$el.removeClass("deadline");
            }




            base.update()
            var timer = setInterval(function () {
                if (base.$el.height() > 0)
                    base.update()
            }, 500);


            base.$el.hide();


            base.$el.fadeIn(100, function () {
                if (base.callback) {
                    base.callback();
                }
            });

            base.renderTags();
        },
        renderTags: function () {
            var base = this;

            var tags = base.task.get("tags");
            for (var k in tags.models) {
                var tag = tags.models[k];
                var tag_item = new TaskTagItem(tag);
                base.$el.find(".tags_container").append(tag_item.$el);
                tag_item.init(base.SmartBlocks, {
                    main: function () {

                    },
                    context: [{
                        name: "stuff",
                        callback: function () {

                        }
                    }]
                });
            }
        },
        update: function () {
            var base = this;

            //direct info
            base.$el.find(".task_name").html(base.task.get("name"));
            if (base.task.get('description'))
                base.$el.find(".description").html(base.task.get('description'));
            else
                base.$el.find(".description").html("No description");

            var date = base.task.getDueDate();

            var formatted_date = date.getDay() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();


        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});