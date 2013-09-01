define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/task_thumbnail.html',
    './DeadlineThumbnail',
    '../SubApps/DeadlineClock/DeadlineClock',
    '../SubApps/DeadlineProgressBar/DeadlineProgressBar',
    './TaskTagItem',
    'ContextMenuView',
    'underscore_string'
], function ($, _, Backbone, TaskThumbnailTemplate, DeadlineInfoView, DeadlineClock, DeadlineProgressBar, TaskTagItem, ContextMenu, _s) {
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
            base.$el.disableSelection();
        },
        render: function () {
            var base = this;

            var template = _.template(TaskThumbnailTemplate, {
                task: base.task,
                _s: _s
            });
            base.$el.html(template);

            var canvas_c = base.$el.find(".deadline_clock");
            if (base.$el.hasClass("small")) {
                canvas_c.attr("height", 60);
                canvas_c.attr("width", 60);
            }

            var canvas_p = base.$el.find(".progress_bar_");

            if (base.$el.hasClass("small")) {
                canvas_p.attr("width", 140);
            }

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
                    context: [
                        {
                            name: "stuff",
                            callback: function () {

                            }
                        }
                    ]
                });
            }
        },
        update: function () {
            var base = this;

            //direct info
            base.$el.find(".task_name").html(_s.truncate(base.task.get("name"), 10));
            base.$el.find(".task_name").attr("title", base.task.get("name"));
            if (base.task.get('description'))
                base.$el.find(".description").html(base.task.get('description'));
            else
                base.$el.find(".description").html("No description");

            var date = base.task.getDueDate();

            var formatted_date = date.getDay() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
            var fully_planned = base.task.fullyPlanned();
            if (fully_planned == 1) {
                base.$el.find(".icon").html('<img src="/images/icons/tick.png" />');
            } else if (fully_planned < 0) {
                base.$el.find(".icon").html('<img src="/images/icons/time.png" />');
            } else if (fully_planned > 1) {
                base.$el.find(".icon").html('over');
            }

        },
        registerEvents: function () {
            var base = this;

            base.$el.attr("oncontextmenu", "return false;");

            base.$el.mouseup(function (e) {
                if (e.which == 3) {
                    var context_menu = new ContextMenu();
                    context_menu.addButton("Show", function () {
                        window.location = '#tasks/' + base.task.get('id');
                    });
                    context_menu.addButton("Delete", function () {
                        if (confirm("Are you sure you want to delete this task and all its planned events ?")) {
                            base.task.destroy({
                                success: function () {
                                    base.$el.remove();
                                }
                            });
                        }
                    });

                    context_menu.show(e);

                }
            });
        }
    });

    return View;
});