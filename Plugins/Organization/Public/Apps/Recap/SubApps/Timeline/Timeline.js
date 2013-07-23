define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Recap/Subapps/Timeline/TimeSlot',
    'Organization/Apps/Recap/Subapps/Timeline/InputHandler'
], function ($, _, Backbone, TimeSlot, InputHandler) {


    var TimelineApp = function () {

    };
    TimelineApp.prototype = {
        init: function (SmartBlocks, canvas, view) {
            var base = this;
            base.view = view;
            base.timeslots = [];



            base.SmartBlocks = SmartBlocks;
            base.canvas = canvas;
            base.context = base.canvas.getContext('2d');
            base.offset = 0;
            base.registerEvents();
            base.start_time = new Date();
            base.start_time.setHours(0,0,0,0);
            base.input_handler = new InputHandler(base.canvas);
            base.input_handler.init(base, base.canvas);


            for (var k in base.view.planned_tasks.models) {
                var planned_task = base.view.planned_tasks.models[k];
                var timeslot = new TimeSlot();
                timeslot.init(base, planned_task);
                base.timeslots.push(timeslot);
            }


            base.speedx = 0;
            base.posx = 0;

            base.run();
        },
        drawBackground: function () {
            var base = this;

            base.context.moveTo(0, 0);
            for (var i = 0; i < 70; i++) {
                base.context.beginPath();
                base.context.lineWidth = 1;
                base.context.strokeStyle = '#eeeeee';
                base.context.moveTo(i * 50, 0);
                base.context.lineTo(i * 50, base.canvas.height);
                base.context.stroke();
                base.context.lineWidth = 1;
                base.context.strokeStyle = '#000000';
                base.context.font = 'normal 15px arial';
                base.context.fillStyle = 'grey';
                var time = i % 24;
                base.context.fillText((time < 10 ? "0" : "") + time + ".00", i * 50, base.canvas.height )
            }
        },
        drawTimeSlots: function () {
            var base = this;

            for (var k in base.timeslots) {
               var ts = base.timeslots[k];
                ts.draw();
            }
        },
        drawNowLine: function () {
            var base = this;

            base.context.beginPath();
            base.context.strokeStyle = 'blue';
            var x = (base.offset.getHours() + base.offset.getMinutes() / 60 + base.offset.getSeconds() / 3600) * 50;
            base.context.moveTo(x, 0);
            base.context.lineTo(x, base.canvas.height);
            base.context.stroke();
        },
        draw: function () {
            var base = this;

            base.drawBackground();
            base.drawTimeSlots();
            base.drawNowLine();
        },
        logic: function () {
            var base = this;

            for (var k in base.timeslots) {
                var ts = base.timeslots[k];
                ts.logic();
            }

            if (base.input_handler.mouse_pressed[1]) {
                base.speedx = base.input_handler.mouse.dx * 2;
            } else {
                base.speedx *= 0.9;
                base.posx *= 0.995;
            }

            base.posx += base.speedx;

        },
        run: function () {
            var base = this;


            base.offset = new Date();
            base.offset_x = (- base.offset.getTime() + base.start_time.getTime()) / 3600000 * 50 + 5 * 50;
            base.context.restore();
            base.context.save();
            base.context.clearRect(0,0,base.canvas.width,  base.canvas.height);
            base.context.translate(base.offset_x + base.posx, 0);
            base.draw();
            base.logic();
            requestAnimationFrame($.proxy(base.run, base), base.canvas);
            base.input_handler.run();
        },
        registerEvents: function () {
            var base = this;


        }
    };

    return TimelineApp;
});