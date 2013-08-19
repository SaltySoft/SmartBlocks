define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Common/Views/TaskThumbnail',
    'text!../Templates/add_task_thumb.html'
], function ($, _, Backbone, TaskThumbnail, AddTaskThumbTemplate) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "task_thumbnails_container_view",
        initialize: function (tasks) {
            var base = this;

            base.tasks = tasks;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.width = 0;
            base.height = 0;
            base.count = 0;
//            base.render();
            base.registerEvents();
            base.$el.disableSelection();
        },
        render: function () {
            var base = this;

            base.$el.html("");
            base.count = 0;
            base.width = 480; // contains margins and padding.
            base.height = 275; // contains margins and padding.
            var div = $(document.createElement('div'));
            div.addClass("thumbnail_subcontainer");
            var vert_count = Math.floor(base.$el.parent().height() / base.height);
            var current = -1;
            var subcontainers_count = 1;
            for (var k in base.tasks.models) {
                base.count++;

                if (current < vert_count - 1) {
                    current++;
                } else {
                    base.$el.append(div);
                    div = $(document.createElement('div'));
                    div.addClass("thumbnail_subcontainer");
                    current = 0;
                    subcontainers_count++;
                }

                var task = base.tasks.models[k];
                var task_thumbnail = new TaskThumbnail(task);

                div.append(task_thumbnail.$el);

                task_thumbnail.$el.addClass("medium");
                task_thumbnail.init(base.SmartBlocks, $.proxy(base.resize, base));
            }

            var add_button = _.template(AddTaskThumbTemplate, {});
            if (current >= vert_count - 1) {
                base.$el.append(div);
                div = $(document.createElement('div'));
                div.addClass("thumbnail_subcontainer");
                subcontainers_count++;
            }
            div.append(add_button);
            base.$el.append(div);


            base.$el.append('<div class="clearer"></div>');

            base.$el.css("width", subcontainers_count * base.width);
            base.$el.css("margin-top", Math.floor((base.$el.parent().height() - base.height * vert_count) / 2));
//            base.resize();

        },
        resize: function () {
            var base = this;
//            base.$el.css("width", (base.count) * (base.width + 40) / Math.floor(base.$el.parent().height() / (base.height + 40)));

            base.$el.animate({
                opacity: 1,
                queue: false
            }, 100, function () {
            });
        },
        registerEvents: function () {
            var base = this;
            var resize_timer = 0;
            $(window).resize(function () {
//                base.resize();
                clearTimeout(resize_timer);
                resize_timer = setTimeout(function () {
                    base.render();
                }, 50);

            });
        }
    });

    return View;
});