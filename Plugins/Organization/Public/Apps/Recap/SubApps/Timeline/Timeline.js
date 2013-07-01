define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {


    var TimelineApp = function () {

    };
    TimelineApp.prototype = {
        init: function (SmartBlocks, canvas, view) {
            var base = this;
            base.view = view;
            base.planned_tasks = base.view.planned_tasks;
            base.SmartBlocks = SmartBlocks;
            base.canvas = canvas;
            base.context = base.canvas.getContext('2d');
            base.offset = 0;
            base.registerEvents();
            base.start_time = new Date();
            base.start_time.setHours(0,0,0,0);
            base.run();

        },

        drawBackground: function () {
            var base = this;

            base.context.moveTo(0, 0);
            for (var i = 0; i < 24; i++) {
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
                base.context.fillText((i < 10 ? "0" : "") + i + ".00", i * 50, base.canvas.height )
            }
        },

        drawEvents: function () {
            var base = this;

            for (var k in base.planned_tasks.models) {
                var planned_task = base.planned_tasks.models[k];
                base.context.beginPath();
                base.context.fillStyle = "#1c7783";


                base.context.fillRect((planned_task.getStart().getTime() - base.start_time.getTime()) / (3600000) * 50, k * 20, planned_task.get("duration") / (3600000 / 50), 20);
                base.context.lineWidth = 1;
                base.context.strokeStyle = '#000000';
                base.context.font = 'normal 15px arial';
                base.context.fillStyle = 'grey';
                base.context.fillText(planned_task.get("content"), (planned_task.getStart().getTime() - base.start_time.getTime()) / 3600000 * 50, k * 20, base.canvas.height);
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
            base.drawEvents();
            base.drawNowLine();
        },
        run: function () {
            var base = this;

            base.offset = new Date();

            base.context.restore();
            base.context.save();
            base.context.clearRect(0,0,base.canvas.width,  base.canvas.height);
            base.context.translate((- base.offset.getTime() + base.start_time.getTime()) / 3600000 * 50 + 5 * 50, 0);
            base.draw();

            requestAnimationFrame($.proxy(base.run, base), base.canvas);
        },
        registerEvents: function () {
            var base = this;


        }
    };

    return TimelineApp;
});