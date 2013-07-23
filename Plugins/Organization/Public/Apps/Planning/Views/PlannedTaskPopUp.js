define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/planned_task_popup.html'
], function ($, _, Backbone, PlannedTaskPopupTemplate) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "planned_task_popup",
        initialize: function (planned_task) {
            var base = this;
            base.planned_task = planned_task;
            base.events = $.extend({}, Backbone.Events);
        },
        init: function (SmartBlocks, e, event) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.posX = e.pageX;
            base.posY = e.pageY;

            base.event = event;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(PlannedTaskPopupTemplate, {
                planned_task: base.planned_task
            });
            base.$el.html(template);
            $("body").prepend(base.$el);
            base.updatePosition();
        },
        scroll: function (e) {
            e.stopPropagation();
        },
        updatePosition: function () {
            var base = this;
            base.$el.css("top", base.posY);
            base.$el.css("left", base.posX - 200);
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
                var date = new Date(base.event.start);
                var hours = base.$el.find(".start_hour").val();
                var minutes = base.$el.find(".start_minute").val();
                date.setHours(hours, minutes, 0);
                base.event.start = date;
                base.planned_task.setStart(date);
                base.planned_task.set("duration", base.$el.find(".duration_input").val() * 60000);
                var end = new Date(date);
                end.setTime(end.getTime() + base.planned_task.get("duration"));
                base.event.end = end;
                base.planned_task.set("content", base.$el.find(".content").val());
                base.event.title = base.planned_task.get("content");
                if (base.planned_task.get("content") != "") {
                    base.planned_task.save({}, {
                        success: function () {
                            console.log("Succesfully updated planned task");
                            base.$el.remove();
                            base.events.trigger("saved", base.event);
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
                        base.events.trigger("deleted");
                        base.$el.remove();
                    }
                });
            });

        }
    });

    return View;
});