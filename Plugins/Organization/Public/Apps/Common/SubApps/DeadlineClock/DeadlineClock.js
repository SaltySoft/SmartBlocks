define([
    'Class'
], function (Class) {
    var DeadlineClock = new Class();

    DeadlineClock.include({
        init: function (canvas, task) {
            var base = this;
            base.task = task;
            base.canvas = canvas;
            base.ctx = base.canvas.getContext('2d');
            base.run();
        },
        logic: function () {
            var base = this;
        },
        draw: function () {
            var base = this;

            var now = new Date();
            var planned_tasks = base.task.get("planned_tasks").models;
            var start = new Date(base.task.get("creation_date"));
            var end = base.task.getDueDate();

            var total_time = end.getTime() - start.getTime();

            var uptonow = now.getTime() - start.getTime();

            var ratio = uptonow / total_time;

            var completed_time = 0;
            var planned_time = 0;
            var missing_time = 0;
            var required_time = base.task.get("required_time");

            var now = new Date();


            for (var k in planned_tasks) {
                var pt = planned_tasks[k];
                var start = pt.getStart();
                var end = new Date(start);
                var duration = parseInt(pt.get("duration"));
                end.setTime(end.getTime() + duration);

                if (now > start) {
                    if (now < end) {
                        completed_time += now.getTime() - start.getTime();
                        planned_time += end.getTime() - now.getTime();
                    } else {
                        completed_time += duration;
                    }
                } else {
                    planned_time += duration;
                }
            }
            missing_time = required_time - planned_time - completed_time;
            missing_time = missing_time < 0 ? 0 : missing_time;

            var ctx = base.ctx;
            var canvas = base.canvas;
            ctx.beginPath();
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 10, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 5, -Math.PI / 2 + ratio * 2 * Math.PI, -Math.PI / 2 + 2 * Math.PI, false);
            ctx.lineTo(canvas.width / 2, canvas.height / 2);
            ctx.closePath();
            ctx.fillStyle = "#cccccc";
            var end = base.task.getDueDate();
            if (now > end) {
                ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 5, 0, 2 * Math.PI, false);
                if (missing_time + planned_time <= 60000) {
                    ctx.fillStyle = "#3da02b";
                } else {
                    ctx.fillStyle = "#a62000";
                }
            }
            ctx.fill();

            if (now > end) {

                ctx.beginPath();
                ctx.strokeStyle = "rgba(0,0,0,0.5)";
                ctx.fillStyle = "rgba(0,0,0,0.2)";
                ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 30, 0, 2 * Math.PI, false);
                ctx.stroke();
                ctx.fill();
                ctx.fillStyle = "white";
                ctx.font = 'normal 10px Arial';
                if (missing_time + planned_time <= 60000) {
                    var metrics = ctx.measureText("OK");
                    ctx.fillText("OK", canvas.width / 2 - metrics.width / 2, canvas.height / 2 + 3);
                } else {
                    var metrics = ctx.measureText("Late");
                    ctx.fillText("Late", canvas.width / 2 - metrics.width / 2, canvas.height / 2 + 3);
                }
            } else {
                var msecs_left = end.getTime() - now.getTime();

                var text = "";

                var secs_left = Math.round(msecs_left / 1000) % 60;
                var min_left = Math.round(msecs_left / 60000) % 60;
                var hours_left = Math.round(msecs_left / 3600000) % 24;

                text = hours_left + "h" + (min_left < 10 ? "0" : "") + min_left + "m" + (secs_left < 10 ? "0" : "") +  secs_left + "s";

                ctx.fillStyle = "white";
                ctx.font = 'normal 11px Arial';
                var metrics = ctx.measureText(text);
                ctx.fillText(text, canvas.width / 2 - metrics.width / 2, canvas.height / 2 + 5);

                var days = Math.round(msecs_left / (24 * 3600000));
                days = days + " days";
                var metrics = ctx.measureText(days);
                ctx.fillText(days, canvas.width / 2 - metrics.width / 2, canvas.height / 2 - 5);

            }
        },
        run: function () {
            var base = this;
            base.ctx.clearRect(0, 0, base.canvas.width, base.canvas.height);
            base.logic();
            base.draw();

            requestAnimationFrame($.proxy(base.run, base), base.canvas);
        },
        registerEvents: function () {
            var base = this;
            var $c = $(base.canvas);
            $c.mousedown(function () {
                base.clicked = true;
            });

            $(document).mouseup(function () {
                base.clicked = false;
            });

            $c.mousemove(function (e) {
                var x = e.pageX - $c.offset().left;
                var y = e.pageY - $c.offset().top;
                base.mouse_mvt.x = x - base.mouse_pos.x;
                base.mouse_mvt.y = y - base.mouse_pos.y;

                base.mouse_pos.x = x;
                base.mouse_pos.y = y;
            });
        }
    });

    return DeadlineClock;
});