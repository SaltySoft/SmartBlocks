define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Common/Organization',
    'Organization/Apps/Recap/Views/TimelineOverlay'
], function ($, _, Backbone, Organization, Overlay) {
    var TimeSlot = function (timeline, planned_task) {

    };


    TimeSlot.prototype = {
        init: function (timeline, planned_task) {
            var base = this;
            base.timeline = timeline;
            base.context = base.timeline.canvas.getContext('2d');
            base.planned_task = planned_task;

            base.ih = base.timeline.input_handler;
            base.drawn = false;
            base.y = 100; // Math.round(Math.random() * 10) * 45 % base.timeline.canvas.height / 2;
            base.time_changed = false;
            base.add_time_x = 0;
            base.date = base.planned_task.getStart();
            base.overlay_shown = false;
            base.overlay = new Overlay(base.planned_task);
            base.planned_task.on("change", function () {
                var x = base.x + base.timeline.offset_x;

                base.overlay.setPosition(x, base.y + 45);
            });
        },

        draw: function () {
            var base = this;
            base.start_time = new Date();
            base.start_time.setHours(0, 0, 0, 0);
            base.context.beginPath();
            base.context.fillStyle = "#1c7783";
            var y = base.y;
            var x = (base.planned_task.getStart().getTime() - base.start_time.getTime()) / (3600000) * 50;
            var width = base.planned_task.get("duration") / (3600000 / 50);
            var height = 45;
            base.context.fillRect(x, y, width, height);
            base.context.fillStyle = "rgb(64, 190, 251)";
            base.context.fillRect(x-5, y, 5, height);

            base.x = x;
            base.y = y;
            base.width = width;
            base.height = height;

            base.context.lineWidth = 1;
            base.context.strokeStyle = '#000000';
            base.context.font = 'normal 15px arial';
            base.context.fillStyle = 'white';
            var metrics = base.context.measureText(base.planned_task.get("content"));
            var start = base.planned_task.getStart();
            base.context.fillText(start.getHours() + "." + (start.getMinutes() < 10 ? '0' : '') + start.getMinutes(), 5 + x, y + ( 30 + 5));
            base.context.fillText(base.planned_task.get("content"), 5 + x, y + ( 20));
            base.drawn = true;
        },

        logic: function () {
            var base = this;
            var mouse = base.ih.getMouse();
            if (base.ih.mousePressed(1)) {


                if (mouse.x >= base.x && mouse.x <= base.x + base.width &&
                    mouse.y >= base.y && mouse.y <= base.y + base.height) {
                    if (!base.overlay_shown) {
                        base.showOverlay();
                    }

                }
            }
//                if (base.drawn) {
//
//                    if (!base.moving) {
//                        if (mouse.x >= base.x && mouse.x <= base.x + base.width &&
//                            mouse.y >= base.y && mouse.y <= base.y + base.height) {
//                            base.moving = true;
//                            base.mouse_offset = mouse.x - base.x;
//                        }
//                    }
//
//                }
//            } else {
//                if (base.time_changed) {
//                    var correction = (base.planned_task.getStart().getTime() % 900000);
//                    base.planned_task.setStart(new Date(base.planned_task.getStart().getTime() - correction));
//                    base.planned_task.save();
//                    base.time_changed = false;
//                    base.moving = false;
//                }
//                base.add_time_x = 0;
//            }

//            if (base.moving) {
//                base.date = base.planned_task.getStart();
//
//                base.date.setTime((base.date.getTime() + (mouse.x - base.mouse_offset - base.x) / 50 * 3600000));
//                base.planned_task.setStart(base.date);
//                console.log("changed time");
//                base.time_changed = true;
//            }
        },
        showOverlay: function () {
            var base = this;
            base.overlay.$el.remove();
            base.overlay = new Overlay(base.planned_task);
            var canvas_parent = base.timeline.view.$el;
            canvas_parent.append(base.overlay.$el);
            base.overlay.init(base.timeline.SmartBlocks, base);

            var x = base.x + base.timeline.offset_x;

            base.overlay.setPosition(x, base.y + 45);

        }
    };
    return TimeSlot;
});