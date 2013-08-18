define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Common/Views/TaskThumbnail'
], function ($, _, Backbone, TaskThumbnail) {
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
            base.render();
            base.registerEvents();
            base.$el.disableSelection();
        },
        render: function () {
            var base = this;

            base.$el.html("");
            base.count = 0;
            base.width = 0;
            base.height = 0;
            for (var k in base.tasks.models) {
                base.count++;
                var task = base.tasks.models[k];
                var task_thumbnail = new TaskThumbnail(task);

                base.$el.append(task_thumbnail.$el);
                task_thumbnail.$el.addClass("medium");
                task_thumbnail.init(base.SmartBlocks, $.proxy(base.resize, base));

                base.width = 450;
                base.height = 235;
            }
            base.$el.append('<div class="clearer"></div>');

            base.resize();

        },
        resize: function () {
            var base = this;
            base.$el.css("width", (base.count + 1) * (base.width + 40) / Math.floor(base.$el.parent().height() / (base.height + 40)));
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
        },
        filterTasks: function (filter_word) {
            var base = this;

            base.tasks.fetch({
                data: {
                    "filter" : "stuff"
                }
            });
        },
        addFilterWord: function (word) {
            var base = this;
        },
        updateFilterWords: function () {
            var base = this;
        }
    });

    return View;
});