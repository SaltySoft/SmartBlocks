define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main_view.html',
    'Organization/Apps/Common/Collections/Activities',
    './ThumbnailsContainer',
    'Organization/Apps/Common/Collections/ActivityTypes'
], function ($, _, Backbone, MainViewTemplate, ActivitiesCollection, ThumbnailsContainerView, ActivityTypesCollection) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "activities_index_view",
        initialize: function () {
            var base = this;
            base.$el.addClass("loading");
            base.activities = OrgApp.activities;
            base.moving = false;
            base.moving_timer = 0;
        },
        init: function (SmartBlocks) {
            var base = this;

            base.SmartBlocks = SmartBlocks;

            base.activity_types = new ActivityTypesCollection();
            base.pos = 0;
            base.activity_types.fetch({
                success: function () {
                    base.render();
                    base.registerEvents();

                }
            });


        },
        render: function () {
            var base = this;

            var template = _.template(MainViewTemplate, {
                activity_types: base.activity_types.models
            });
            base.$el.html(template);

            var task_thumbnails_container = new ThumbnailsContainerView(base.activities);
            base.$el.find(".thumbnails_container").html(task_thumbnails_container.$el);
            task_thumbnails_container.init(base.SmartBlocks);
            base.tt_container = task_thumbnails_container;
            base.filterActivities();

        },
        scroll: function (e) {
            var base = this;
            clearTimeout(base.moving_timer);

            var e = window.event || e; // old IE support
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

            base.previous = base.pos;
            if (delta < 0) {
                base.pos -= base.$el.width() - base.$el.width() % 480;
            } else {
                base.pos += base.$el.width() - base.$el.width() % 480;
            }

            if (base.pos > 0)
                base.pos = 0;

            if (-base.pos >= base.tt_container.$el.width()) {
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

            var name_filter = base.$el.find(".name_filter");
            var name_timer = 0;

            name_filter.keyup(function () {
                clearTimeout(name_timer);
                name_timer = setTimeout(function () {
                    base.filterActivities();
                }, 200);
            });

            var more_filters_button = base.$el.find(".more_filters_button");
            var form = base.$el.find(".filters_container");

            more_filters_button.click(function () {
                if (form.hasClass("normal")) {
                    form.removeClass("normal");
                    form.addClass("expanded");
                } else if (form.hasClass("expanded")) {
                    form.removeClass("expanded");
                    form.addClass("normal");
                }
            });

            var finished_filter = base.$el.find(".archived_filter");

            finished_filter.change(function () {
                base.filterActivities();
            });

            var types_filter = base.$el.find(".types_filter");

            types_filter.change(function () {
                base.filterActivities();
            });
        },
        filterActivities: function () {
            var base = this;

            base.$el.addClass("loading");
            base.activities.fetch({
                data: {
                    "name": base.$el.find(".name_filter").val(),
                    "archives": base.$el.find(".archived_filter").is(":checked") ? "1" : undefined,
                    "type": base.$el.find(".types_filter").val()
                },
                success: function () {

                    base.$el.removeClass("loading");
                    base.$el.find(".found_count_nb").html(base.activities.models.length);
                    base.tt_container.render();


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