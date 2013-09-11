define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Daily/Templates/planned_task_popup.html'
], function ($, _, Backbone, PlannedTaskPopupTemplate) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "planned_task_popup",
        initialize: function () {
            var base = this;
        },
        init: function (SmartBlocks, planned_task_view) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.planned_task_view = planned_task_view;
            base.planning = base.planned_task_view.planning;

            base.planned_task = base.planned_task_view.planned_task;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(PlannedTaskPopupTemplate, {
                planned_task: base.planned_task
            });
            base.$el.html(template);
            $("body").append(base.$el);
            base.updatePosition();
        },
        scroll: function (e) {
            e.stopPropagation();
        },
        updatePosition: function () {
            var base = this;
            base.$el.css("top", base.planned_task_view.$el.offset().top - base.$el.height() - 25);
            base.$el.css("left", base.planned_task_view.$el.offset().left);
        },
        cancel: function () {
            var base = this;
            if (!base.planned_task.get("id")) {
                base.planned_task_view.$el.remove();
                base.$el.remove();
            } else {
                base.$el.remove();
            }
        },
        registerEvents: function () {
            var base = this;

            base.$el.mousedown(function (e) {
                if (e.which == 3) {
                    e.stopPropagation();
                    return false;
                }

            });

            base.$el.delegate(".save_button", "click", function () {
                var date = new Date(base.planned_task_view.planning.current_date);
                var hours = base.$el.find(".start_hour").val();
                var minutes = base.$el.find(".start_minute").val();
                date.setHours(hours, minutes, 0);

                base.planned_task.setStart(date);
                base.planned_task.set("duration", base.$el.find(".duration_input").val() * 60000);
                base.planned_task.set("content", base.$el.find(".content").val());
                if (base.planned_task.get("content") != "") {
                    base.planned_task.save({}, {
                        success: function () {
                            base.planned_task_view.update();
                            console.log("Succesfully updated planned task");
                            base.$el.remove();
                        }
                    });
                } else {
                    alert("You must provide a content");
                }
            });

            base.$el.find(".cancel_button").click(function () {
               base.cancel();
            });

            base.$el.find(".delete_button").click(function () {
                base.planned_task.destroy({
                    success: function () {
                        base.planned_task_view.$el.remove();
                        base.$el.remove();
                    }
                });
            });

            if (base.el.addEventListener) {
                // IE9, Chrome, Safari, Opera
                base.el.addEventListener("mousewheel", $.proxy(base.scroll, base), false);
                // Firefox
                base.el.addEventListener("DOMMouseScroll", $.proxy(base.scroll, base), false);
            }

            base.planned_task_view.events.on("moving", function () {
                base.updatePosition();
            });

            base.planning.events.on("planned_task_popsremove", function () {
                base.cancel();
            });

        }
    });

    return View;
});