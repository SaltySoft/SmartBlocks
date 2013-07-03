define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Recap/Templates/timeline_overlay_template.html'
], function ($, _, Backbone, OverlayTemplate) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "timeline_overlay",
        initialize: function (planned_task) {
            var base = this;
            base.planned_task = planned_task;
            base.model = planned_task;
            base.shown = true;
        },
        init: function (SmartBlocks, slot_canvas) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.slot_canvas = slot_canvas;
            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(OverlayTemplate, {});
            base.$el.html(template);

            base.update();
        },
        update: function () {
            var base = this;
            base.$el.find(".content").html(base.planned_task.get("content"));
            var start = base.planned_task.getStart();
            var stop = new Date(base.planned_task.getStart());
            stop.setTime(stop.getTime() + base.planned_task.get("duration"));
            base.$el.find(".time_start").html(start.getHours() + "." + (start.getMinutes() < 10 ? '0' : '') + start.getMinutes());
            base.$el.find(".time_stop").html(stop.getHours() + "." + (stop.getMinutes() < 10 ? '0' : '') + stop.getMinutes());

            if (base.planned_task.get("task")) {
                base.$el.find(".deadline_name").html(base.planned_task.get("task").get("name"));
            }
        },
        registerEvents: function () {
            var base = this;
            base.$el.delegate(".close_button", "click", function () {
                base.$el.remove();
                base.planned_task.fetch({
                    reset: true
                });
            });

            base.$el.delegate(".save_button", "click", function () {
                base.$el.remove();
                base.planned_task.save();
            });

            base.$el.delegate(".postpone_button", "click", function () {
                var date = base.planned_task.getStart();
                date.setMinutes(date.getMinutes() + 30);
                base.planned_task.setStart(date);
            });

            base.$el.delegate(".addtime_button", "click", function () {
                base.planned_task.set("duration",  base.planned_task.get("duration") + 30 * 60 * 1000);
            });
        },
        setPosition: function (x, y) {
            var base = this;
            base.$el.css("left", x);
            base.$el.css("top", y);
        }
    });

    return View;
});