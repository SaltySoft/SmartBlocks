define([
    'jquery',
    'Class',
    './InputHandler'
], function ($, Class, InputHandler) {
    var Clock = new Class();

    Clock.include({
        init: function (canvas, planned_tasks) {
            var base = this;

            base.cv = canvas;
            base.$cv = $(canvas);

            base.ctx = base.cv.getContext('2d');

            base.planned_tasks = planned_tasks;

            base.ih = new InputHandler();

            base.ih.init(base.cv);
        },
        logic: function () {
            var base = this;

        },
        drawBackground: function () {
            var base = this;

            var now = new Date();

            base.ctx.strokeStyle = "gray";
            base.ctx.lineWidth = 2;
            base.ctx.beginPath();
            base.ctx.arc(base.cv.width / 2, base.cv.height / 2, base.cv.height / 2 - 2, 0, Math.PI * 2, false);
            base.ctx.fillStyle = 'whitesmoke';
            base.ctx.fill();
//            base.ctx.stroke();
            base.ctx.closePath();

            base.ctx.fillStyle = 'black';

            for (var i = 1; i <= 24; i++) {
                base.ctx.beginPath();
                var font_size = 15;

                base.ctx.fillStyle = 'black';

                base.ctx.font = "normal 15px arial";


                var angle = i * Math.PI / 12 - Math.PI / 2;
                var x = Math.cos(angle) * (base.cv.width / 2 - 15) + base.cv.width / 2;
                var y = Math.sin(angle) * (base.cv.height / 2 - 15) + base.cv.height / 2;
                var metrics = base.ctx.measureText(i);

                base.ctx.fillText(i, x - metrics.width / 2, y + font_size / 3);

                base.ctx.fill();
                base.ctx.closePath();
            }



            base.ctx.beginPath();
            base.ctx.strokeStyle = "black";
            base.ctx.lineWidth = 3;

            var time = (now.getHours() < 10 ? '0' : '') +
                now.getHours() + ":" +
                (now.getMinutes() < 10 ? '0' : '') +
                now.getMinutes() + ":" +
                (now.getSeconds() < 10 ? '0' : '') +
                now.getSeconds();

            base.ctx.font = "bold 20px arial";
            var metrics = base.ctx.measureText(time);
            base.ctx.fillText(time, base.cv.width / 2 - metrics.width / 2, base.cv.height / 2 - 10);
            base.ctx.closePath();




        },
        drawTasks: function () {
            var base = this;
            var now = new Date();
            for (var k in base.planned_tasks.models) {
                var today_start = new Date();
                var today_end = new Date();
                today_start.setHours(0, 0, 0, 0);
                today_end.setHours(23,59,59,999);
                var planned_task = base.planned_tasks.models[k];
                var pstart = planned_task.getStart();
                var pend = new Date(planned_task.getStart().getTime() + planned_task.get("duration"));
                if (pstart >= today_start && pstart < today_end) {
                    var start_angle = (pstart.getHours() + pstart.getMinutes() / 60) * Math.PI / 12 - Math.PI / 2;
                    var end_angle = (pend.getHours() + pend.getMinutes() / 60) * Math.PI / 12 - Math.PI / 2;
                    base.ctx.fillStyle = planned_task.get("task").get("activity") ? planned_task.get("task").get("activity").type.color :"rgba(43, 184, 203, 0.48)";



                    base.ctx.beginPath();




                    base.ctx.arc(base.cv.width / 2, base.cv.height / 2, base.cv.height / 2 - 3, start_angle, end_angle, false);
                    base.ctx.lineTo(base.cv.width / 2, base.cv.height / 2);
                    base.ctx.closePath();
                    base.ctx.save();
                    base.ctx.globalAlpha = 0.4;
                    if (pstart <= now && now <= pend) {
                        base.ctx.globalAlpha = 0.2;
                    }
                    base.ctx.fill();
                    base.ctx.restore();
                    base.ctx.strokeStyle = "grey";
                    base.ctx.lineWidth = 1;
                    base.ctx.stroke();


                }
            }
        },
        drawSticks: function () {
            var base = this;
            var now = new Date();
            //sticks
            //hours
            base.ctx.beginPath();
            base.ctx.strokeStyle = "red";
            base.ctx.lineWidth = 2;
            var angle = (now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600) * Math.PI / 12 - Math.PI / 2;
            base.ctx.moveTo(base.cv.width / 2, base.cv.height / 2);
            var x = Math.cos(angle) * (80) + base.cv.width / 2;
            var y = Math.sin(angle) * (80) + base.cv.height / 2;
            base.ctx.lineTo(x, y);
            base.ctx.stroke();
        },
        draw: function () {
            var base = this;
            base.drawBackground();
            base.drawTasks();
            base.drawSticks();
        },
        run: function () {
            var base = this;

            base.ctx.clearRect(0, 0, base.cv.width, base.cv.height);

            base.ih.run();
            base.logic();
            base.draw();


            requestAnimationFrame($.proxy(base.run, base), base.cv);
        }
    });

    return Clock;
});
