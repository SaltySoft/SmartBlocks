define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Common/Views/ActivityThumbnail'
], function ($, _, Backbone, TaskThumbnail) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "task_thumbnails_container_view",
        initialize: function (activities) {
            var base = this;

            base.activities = activities;
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
            for (var k in base.activities.models) {
                base.count++;

                if (current < vert_count - 1) {
                    current++;
                } else {
                    div = $(document.createElement('div'));
                    div.addClass("thumbnail_subcontainer");
                    current = 0;
                    subcontainers_count++;
                }

                var activity = base.activities.models[k];
                var task_thumbnail = new TaskThumbnail(activity);
                base.$el.append(div);
                div.append(task_thumbnail.$el);

                task_thumbnail.$el.addClass("medium");
                task_thumbnail.init(base.SmartBlocks, $.proxy(base.resize, base));
            }
            base.$el.append(div);

            base.$el.css("width", subcontainers_count * base.width);
            base.$el.append('<div class="clearer"></div>');
            var margin_top = Math.floor((base.$el.parent().height() - base.$el.height()) / 2);


            base.$el.css("margin-top", margin_top);
            console.log("MARGIN TOP", margin_top, "PARENT HEIGHT", base.$el.parent().height(), "ELEMENT HEIGHT", base.$el.height());
            console.log("VERT_COUNT", vert_count);



        },
        resize: function () {
            var base = this;
//            base.$el.css("width", (base.count + 1) * (base.width + 40) / Math.floor(base.$el.parent().height() / (base.height + 40)));
            base.$el.animate({
                opacity: 1,
                queue: false
            }, 100, function () {
            });
        },
        registerEvents: function () {
            var base = this;

            $(window).resize(function () {
                base.resize();
            });
        }
    });

    return View;
});