define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main_view.html',
    'Organization/Apps/Tasks/Collections/Tasks',
    './ThumbnailsContainer'
], function ($, _, Backbone, MainViewTemplate, TasksCollection, ThumbnailsContainerView) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "tasks_index_view",
        initialize: function () {
            var base = this;

            base.tasks = OrgApp.tasks;
            base.moving = false;
            base.moving_timer = 0;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
            base.registerEvents();
            base.pos = 0;
        },
        render: function () {
            var base = this;

            var template = _.template(MainViewTemplate, {});
            base.$el.html(template);

            var task_thumbnails_container = new ThumbnailsContainerView(base.tasks);
            base.$el.find(".thumbnails_container").html(task_thumbnails_container.$el);
            task_thumbnails_container.init(base.SmartBlocks);
            base.tt_container = task_thumbnails_container;

        },
        scroll: function (e) {
            var base = this;
            clearTimeout(base.moving_timer);

            var e = window.event || e; // old IE support
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

            base.previous = base.pos;
            if (delta < 0) {
                base.pos -= base.$el.width() - base.$el.width() % 490;
            } else {
                base.pos += base.$el.width() - base.$el.width() % 490;
            }

            if (base.pos > 0)
                base.pos = 0;

            if (-base.pos > base.tt_container.$el.width()) {
                base.pos = base.previous;
            }
            if (base.previous != base.pos)
                base.tt_container.$el.animate({
                    "margin-left": base.pos,
                    easing: "linear",
                    queue: false
                }, 300, function () {
                });


        },
        registerEvents: function () {
            var base = this;

            base.offset = 0;
            if (base.el.addEventListener) {
                // IE9, Chrome, Safari, Opera
                base.el.addEventListener("mousewheel", $.proxy(base.scroll, base), false);
                // Firefox
                base.el.addEventListener("DOMMouseScroll", $.proxy(base.scroll, base), false);
            }
        }
    });

    return View;
});